const mongoose = require("mongoose");
const { Schema } = mongoose;

const refresh_Token_Schema = new Schema({
  token: {
    type: String,
    required: true,
    unique: true,
  },
  email:{
    type: String,
    required: true,
    unique: true,
  }
},{
  timestamps: true,
});

const RefreshToken = mongoose.model("RefreshToken", refresh_Token_Schema);

module.exports = RefreshToken;
