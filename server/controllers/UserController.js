const pool = require("../pool");

module.exports.setAvatarController = async (req, res) => {
  const { userId, avatar } = req.body;
  if (avatar && userId) {
    await pool.query("update users set avatar = $1 where id = $2", [
      avatar,
      userId,
    ]);
    return res.status(200).json({
      message: "Succes",
    });
  } else {
    return res.status(400).json({
      message: "Fail to set avatar!",
    });
  }
};

module.exports.uploadImage = async (req, res) => {
  const { caption, userId } = req.body;

  // Store file path in database
  const filePath = req.file.filename;
  await pool.query(
    "insert into posts (user_id,caption,image) values ($1,$2,$3)",
    [userId, caption, filePath]
  );
  res.status(200).json({
    message: "Success",
  });
};

module.exports.getAllMyPosts = async (req, res) => {
  const { userId } = req.body;

  if (userId) {
    const { rows } = await pool.query(
      "select caption,image from posts where user_id = $1",
      [userId]
    );

    return res.status(200).json({
      message: "Succes",
      data: rows,
    });
  }
};

module.exports.getAllPosts = async (req, res) => {
  const userId = req.body.userId;
  const { rows } = await pool.query(
    "select * from users join posts on users.id = posts.user_id where user_id != $1 order by posts.id desc",
    [userId]
  );
  const data = rows.map((r) => ({
    ...r,
    userId: r.user_id,
    likes: r.likes_count || 0,
  }));

  return res.status(200).json({
    message: "Succes",
    data,
  });
};

module.exports.likePost = async (req, res) => {
  const { userId, postId } = req.body;

  console.log(userId, postId);
  const { rows } = await pool.query(
    "select * from likes where user_id = $1 and post_id = $2",
    [userId, postId]
  );
  if (rows.length === 0) {
    await pool.query("insert into likes (user_id,post_id) values ($1,$2)", [
      userId,
      postId,
    ]);
    const { rows } = await pool.query(
      "select count(*) as likes_count from likes where post_id = $1",
      [postId]
    );

    return res.status(200).json({
      message: "Success",
      likes: rows[0].likes_count,
    });
  }
  if (rows.length === 1) {
    await pool.query("delete from likes where user_id = $1 and post_id = $2", [
      userId,
      postId,
    ]);
    const { rows } = await pool.query(
      "select count(*) as likes_count from likes where post_id = $1",
      [postId]
    );

    return res.status(200).json({
      message: "Success",
      likes: rows[0].likes_count,
    });
  }
};

module.exports.likeCount = async (req, res) => {
  const { postId } = req.body;
  const { rows } = await pool.query(
    "select user_id from likes where post_id = $1",
    [postId]
  );
  return res.status(200).json({
    message: "Success",
    likes: rows.length,
    userIdList: rows.map((e) => e.user_id),
  });
};

module.exports.makeComment = async (req, res) => {
  const { userId, postId, content } = req.body;
  if (content.trim() === "")
    return res.status(400).json({
      message: "Not a valid comment",
    });
  await pool.query(
    "insert into comments (user_id,post_id,content) values ($1,$2,$3)",
    [userId, postId, content]
  );
  return res.status(200).json({
    message: "Success",
  });
};

module.exports.getAllComments = async (req, res) => {
  const { postId } = req.body;

  const { rows } = await pool.query(
    "select avatar,created_at,content,email from comments join users on comments.user_id = users.id where post_id = $1",
    [postId]
  );
  return res.status(200).json({
    message: "Success",
    comments: rows.map((c) => ({
      ...c,
      createdAt: c.created_at,
    })),
  });
};

module.exports.follow = async (req, res) => {
  const { userId, followedId } = req.body;

  const { rows } = await pool.query(
    "select * from follow_system where following_id = $1 and followed_id = $2",
    [userId, followedId]
  );
  if (rows.length === 1) {
    await pool.query(
      "delete from follow_system where following_id = $1 and followed_id = $2",
      [userId, followedId]
    );

    return res.status(200).json({
      message: "Success",
      followed: false,
    });
  }
  if (rows.length === 0) {
    await pool.query(
      "insert into follow_system (following_id ,followed_id) values ($1, $2)",
      [userId, followedId]
    );
    return res.status(200).json({
      message: "Success",
      followed: true,
    });
  }
};

module.exports.getFollowing = async (req, res) => {
  const { userId, followedId } = req.body;

  const { rows } = await pool.query(
    "select * from follow_system where following_id = $1 and followed_id = $2",
    [userId, followedId]
  );

  if (rows.length === 1) {
    return res.status(200).json({
      message: "Success",
      followed: true,
    });
  }
  if (rows.length === 0) {
    return res.status(200).json({
      message: "Success",
      followed: false,
    });
  }
};

module.exports.getAllFriends = async (req, res) => {
  const { userId } = req.body;
  const { rows } = await pool.query(
    `select avatar,email,s3.followed_id from (
      select s1.* from (select * from follow_system where following_id = $1) as s1
    join follow_system as s2 on s1.following_id = s2.followed_id and s1.followed_id = s2.following_id) as s3 
    join users on users.id = s3.followed_id`,
    [userId]
  );
  res.status(200).json({
    message: "Success",
    friends: rows.map((f) => ({
      ...f,
      userId: f.followed_id,
    })),
  });
};

module.exports.getMessages = async (req, res) => {
  const { receiverId } = req.body;
  const senderId = req.body.userId;

  const { rows } = await pool.query(
    "select * from messages join users on users.id = messages.sender_id where( sender_id = $1 and receiver_id = $2) or (sender_id = $3 and receiver_id = $4) ",
    [senderId, receiverId, receiverId, senderId]
  );

  res.status(200).json({
    message: "Success",
    messages: rows.map((m) => ({
      ...m,
      receiverId: m.sender_id,
      createdAt: new Date(m.created_at).toLocaleString("vi"),
    })),
  });
};

module.exports.sendMessage = async (req, res) => {
  const { receiverId, content } = req.body;
  const senderId = req.body.userId;

  await pool.query(
    "insert into messages (sender_id,receiver_id,content) values ($1,$2,$3) ",
    [senderId, receiverId, content]
  );
  res.status(200).json({
    message: "Success",
  });
};
