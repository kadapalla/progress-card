const mongoose = require('mongoose');

const explanationRequestSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Student requesting the explanation is required'],
    },
    lectureId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lecture',
      required: [true, 'Lecture being explained is required'],
    },
    explainerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'completed'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

explanationRequestSchema.index({ studentId: 1, lectureId: 1 });
explanationRequestSchema.index({ explainerId: 1, status: 1 });

module.exports = mongoose.model('ExplanationRequest', explanationRequestSchema);
