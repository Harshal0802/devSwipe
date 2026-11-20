const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    `mongodb://harshrathod1111_db_user:MGo9R43Yum867o7D@ac-mnmp6g0-shard-00-00.a5tpuil.mongodb.net:27017,ac-mnmp6g0-shard-00-01.a5tpuil.mongodb.net:27017,ac-mnmp6g0-shard-00-02.a5tpuil.mongodb.net:27017/devSwipe?ssl=true&replicaSet=atlas-21bb7p-shard-0&authSource=admin&appName=devSwipe`,
  );
};

module.exports = { connectDB };
