const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({});

module.exports = mongoose.model('Category', categorySchema);
