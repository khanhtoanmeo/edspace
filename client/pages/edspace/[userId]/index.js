import axios from "axios";
import pg from "pg";
import Profile from "../../../components/Edspace/Profile";

function UserProfile({ userInfor }) {
  return (
    <>
      <Profile userInfor={userInfor}></Profile>
    </>
  );
}

export async function getStaticProps(context) {
  const userId = context.params.userId;

  const pool = new pg.Pool({
    database: "edspace",
    host: "localhost",
    port: 5432,
    user: "postgres",
    password: "toancoder",
  });
  const { rows } = await pool.query(
    "select id,email,avatar from users where id = $1",
    [userId]
  );
  console.log("rows:", rows);

  let data = {};
  if (rows.length > 0) {
    data = {
      ...rows[0],
      username: rows[0].email.split("@")[0],
    };
  }

  return {
    props: {
      userInfor: data,
    },
  };
}

// export async function getStaticProps(context) {
//   const userId = context.params.userId;

//   const pool = new pg.Pool({
//     database: "edspace",
//     host: "localhost",
//     port: 5432,
//     user: "postgres",
//     password: "toancoder",
//   });
//   const { rows } = await pool.query(
//     "select id,email,avatar from users where id = $1",
//     [userId]
//   );
//   const data = {
//     ...rows[0],
//     username: rows[0].email.split("@")[0],
//   };
//   return {
//     props: {
//       userInfor: data,
//     },
//   };
// }

export async function getStaticPaths() {
  const pool = new pg.Pool({
    database: "edspace",
    host: "localhost",
    port: 5432,
    user: "postgres",
    password: "toancoder",
  });
  const { rows } = await pool.query("select id from users");

  const data = rows.map((user) => ({ params: { userId: user.id } }));
  return {
    paths: data,
    fallback: true,
  };
}

export default UserProfile;
