const mongoose = require('mongoose');

const categorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true
    },
    emoji: {
      type: String,
      trim: true,
      required: true
    },
    cover: {
      type: String,
      trim: true,
      required: true
    }
  },
  { timestamps: true }
);

// Replace _id to id and remove __v in responses
categorySchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
    delete ret.__v;
  }
});

module.exports = mongoose.model('Category', categorySchema);
