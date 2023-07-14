const jwt = require("jsonwebtoken");
const { isEmail } = require("validator");
const uuid = require("uuid");
const pool = require("../pool");
const bcrypt = require("bcrypt");

module.exports.signupController = async (req, res) => {
  const { email, password } = req.body;

  if (!isEmail(email) || password.length < 8 || password.length > 20)
    return res.status(422).json({
      message: "Invalid email or password",
    });

  // check if email already existed
  const { rows } = await pool.query("select * from users where email = $1", [
    email,
  ]);
  if (rows.length > 0)
    return res.status(401).json({
      message: "You already created an account with this email",
    });

  try {
    const generatedID = uuid.v4();
    bcrypt.hash(
      password,
      +process.env.PASSWORD_SALT_ROUND,
      function (err, hash) {
        // //save users in database
        pool.query("insert into users (id,email,password) values ($1,$2,$3)", [
          generatedID,
          email,
          hash,
        ]);
      }
    );

    const token = jwt.sign({ userId: generatedID }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE_TIME,
    });

    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: 7 * 60 * 60 * 24 * 1000,
      domain: "http://localhost:3000",
      path: "/",
    });

    return res.status(200).json({
      message: "Succes",
      token,
      userId: generatedID,
    });
  } catch (err) {
    return res.status(300).json({
      message: err.message,
    });
  }
};

module.exports.logInController = async (req, res) => {
  const { email, password } = req.body;

  if (!isEmail(email) || password.length < 8 || password.length > 20)
    return res.status(422).json({
      message: "Invalid email or password",
    });

  try {
    const { rows } = await pool.query("select * from users where email = $1", [
      email,
    ]);
    const user = rows[0];
    // console.log(user);
    if (user) {
      bcrypt.compare(password, user.password, (err, same) => {
        // console.log(same);
        if (same) {
          const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRE_TIME,
          });

          res.cookie("jwt", token, { maxAge: 3000000 });

          return res.status(200).json({
            message: "Success",
            token,
            userId: user.id,
          });
        }
        if (!same) {
          return res.status(400).json({
            message: "Please enter the correct password",
          });
        }
      });
    }
    if (!user) {
      return res.status(401).json({
        message: "Your email wasn't registered to Ed Space",
      });
    }
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};

module.exports.protected = async (req, res, next) => {
  const tokenSent = req.headers.authorization.split(" ")[1];
  const userIdSent = req.body.userId;

  jwt.verify(tokenSent, process.env.JWT_SECRET, (err, decoded) => {
    if (decoded.userId !== userIdSent || err) {
      console.log("damn");
      return res.status(401).json({ message: "Unauthorized" });
    }
    next();
  });
};
