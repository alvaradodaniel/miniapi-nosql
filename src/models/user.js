const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const identificationSchema = new mongoose.Schema({
  type: String,
  OCR: String,
});

const transactionsSchema = new mongoose.Schema({
  datetime: String,
  description: String,
  amount: Number,
  location: String,
  transaction_type: String,
  ip: String,
  mac_address: String,
  concept: String,
  reference: String,
});

const cardsSchema = new mongoose.Schema({
  type: String,
  card_number: String,
  expiration_date: String,
  cvv: String,
  transactions: [transactionsSchema],
});

const bank_accountSchema = new mongoose.Schema({
  account_number: String,
  CLABE: String,
  balance: Number,
  cards: [cardsSchema],
});

const credentialsSchema = new mongoose.Schema({
  password: String,
  security_question: String,
  security_answer: String,
});

const userSchema = new mongoose.Schema({
  name: String,
  date_of_birth: String,
  address: String,
  email: String,
  phone: String,
  identification: [identificationSchema],
  bank_account: [bank_accountSchema],
  credentials: [credentialsSchema],
});

credentialsSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

module.exports = mongoose.model("User", userSchema);
