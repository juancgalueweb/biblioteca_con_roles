const mongoose = require("mongoose");

const local_db = process.env.LOCAL_DB_URL;
const deploy_db = process.env.MONGO_URI;

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(deploy_db);
}
