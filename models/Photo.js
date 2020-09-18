const mongoose = require('mongoose');

const photoSchema = mongoose.Schema({});

module.exports = mongoose.model('Photo', photoSchema);
