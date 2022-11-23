const mongoose = require("mongoose");

const local_db = process.env.LOCAL_DB_URL; //To manage DB locally
const deploy_db = process.env.MONGO_URI; //To manage DB with MongoDB Atlas

main().catch((err) => console.log(err));
async function main() {
  try {
    await mongoose.connect(local_db);
    console.log("Data base connected 🔥🔥🔥");
  } catch (error) {
    console.log("😒😒😒 connection refused!!!");
  }
}
