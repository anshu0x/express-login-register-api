require("dotenv/config");
const mongoose = require("mongoose");

const ConnectTODB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error(err);
  }

  mongoose.connection.on("error", (err) => {
    console.error(err);
  });
};

module.exports = ConnectTODB;
