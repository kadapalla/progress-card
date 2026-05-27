const mongoose = require('mongoose');

const labCompletionRequestSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    lectureId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lecture',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    requestedVerifierId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Optional selected verifier
    },
    actionedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Verifier who approved/rejected
    },
    rejectionReason: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Allow only one active pending request per student per lecture
labCompletionRequestSchema.index({ studentId: 1, lectureId: 1, status: 1 });

module.exports = mongoose.model('LabCompletionRequest', labCompletionRequestSchema);
