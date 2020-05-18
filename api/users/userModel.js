
const mongoose = require('mongoose');
// Setup schema
const userSchema = mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  excludeTerms: [String],
  diet: [String],
  recipes: [String],
});

// Export User model
module.exports = mongoose.model('user', userSchema);
