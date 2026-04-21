const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  kycType: { type: String, enum: ['BVN', 'NIN'], required: true },
  kycID: { type: String, required: true, unique: true },
  accountNumber: { type: String, unique: true }, // The 10-digit NUBAN from NIBSS
  balance: { type: Number, default: 15000 },     // Assignment requirement: pre-funded 15k
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);

UserSchema.methods.matchPassword = async function(enteredPassword) {
  const bcrypt = require('bcryptjs');
  return await bcrypt.compare(enteredPassword, this.password);
};
