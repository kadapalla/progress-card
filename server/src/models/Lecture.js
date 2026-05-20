const mongoose = require('mongoose');

const lectureSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Lecture title is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    videoUrl: {
      type: String,
      required: [true, 'Video URL is required'],
      trim: true,
    },
    requiredEquipment: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Component',
      },
    ],
    prerequisites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lecture',
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Lecture', lectureSchema);
