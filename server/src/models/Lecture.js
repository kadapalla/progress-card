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
    language: {
      type: String,
      enum: ['Telugu', 'Hindi', 'English'],
      default: 'English',
    },
    difficulty: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Beginner',
    },
    category: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'easy',
    },
    department: {
      type: String,
      enum: ['Electronics', 'Mechanical', 'Computer Science', 'Civil', 'Electrical'],
      default: 'Electronics',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Lecture', lectureSchema);
