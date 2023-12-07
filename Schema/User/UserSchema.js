const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config({ path: '../.env' });


const userSchema = new mongoose.Schema({
  dairyCode: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String },
  address: { type: String },
  contact: { type: String, required: true },
  role: { type: String, enum: ['farmer', 'manager', 'veterinarian'], required: true },
  password: { type: String, required: true },
  tokens: [{ token: { type: String, required: true } }]
});


userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);

  }
  next();
});
userSchema.methods.generateAuthToken = async function () {
  try {
    let token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY, { expiresIn: '1h' });
    this.tokens = this.tokens.concat({ token: token });
    await this.save();
    return token;
  } catch (error) {
    throw error;
  }
};


const User = mongoose.model('User', userSchema);
module.exports = User;
