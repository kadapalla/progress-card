const mongoose = require('mongoose');

const rentalTransactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    componentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Component',
      required: [true, 'Component ID is required'],
    },
    quantityRented: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [1, 'Quantity must be at least 1'],
    },
    checkoutTime: {
      type: Date,
      default: Date.now,
    },
    dueTime: {
      type: Date,
      required: [true, 'Due time is required'],
    },
    returnTime: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ['pending', 'active', 'returned', 'overdue', 'rejected'],
      default: 'pending',
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual: check if overdue
rentalTransactionSchema.virtual('isOverdue').get(function () {
  if (this.status === 'returned') return false;
  return new Date() > this.dueTime;
});

// Auto-update status to overdue if past due time
rentalTransactionSchema.pre('save', function () {
  if (this.status === 'active' && new Date() > this.dueTime) {
    this.status = 'overdue';
  }
});

// Index for efficient queries
rentalTransactionSchema.index({ userId: 1, status: 1 });
rentalTransactionSchema.index({ componentId: 1, status: 1 });
rentalTransactionSchema.index({ status: 1, dueTime: 1 });

module.exports = mongoose.model('RentalTransaction', rentalTransactionSchema);
