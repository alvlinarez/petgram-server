const mongoose = require('mongoose');
const crypto = require('crypto');

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      max: 32
    },
    email: {
      type: String,
      trim: true,
      required: true,
      lowercase: true,
      unique: true
    },
    favorites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Photo'
      }
    ],
    hashedPassword: {
      type: String,
      required: true
    },
    salt: String
  },
  {
    timestamps: true
  }
);

// Method to fill users with favorites photos
const autoPopulate = function (next) {
  this.populate([
    {
      path: 'favorites'
    }
  ]);
  next();
};

userSchema
  .pre('find', autoPopulate)
  .pre('findOne', autoPopulate)
  .pre('findOneAndUpdate', autoPopulate)
  .pre('update', autoPopulate);

// Replace _id to id, and delete hashedPassword, salt and __v in responses
userSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
    delete ret.hashedPassword;
    delete ret.salt;
    delete ret.__v;
  }
});

// virtual password
userSchema
  .virtual('password')
  .set(function (password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashedPassword = this.encryptPassword(password);
  })
  .get(function () {
    return this._password;
  });

// methods
userSchema.methods = {
  authenticate: function (plainText) {
    return this.encryptPassword(plainText) === this.hashedPassword;
  },
  encryptPassword: function (password) {
    if (!password) return '';
    try {
      return crypto
        .createHmac('sha1', this.salt)
        .update(password)
        .digest('hex');
    } catch (e) {
      return '';
    }
  },
  makeSalt: function () {
    return Math.round(new Date().valueOf() * Math.random()) + '';
  }
};

module.exports = mongoose.model('User', userSchema);
