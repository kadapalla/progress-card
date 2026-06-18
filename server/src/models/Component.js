const mongoose = require('mongoose');

const componentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Component name is required'],
      trim: true,
      maxlength: [150, 'Name cannot exceed 150 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      enum: [
        'Microcontrollers',
        'Sensors',
        'Displays',
        'Power',
        'Connectivity',
        'Motors',
        'Cables',
        'Tools',
        'Breadboards',
        'Components',
        'Other',
      ],
      default: 'Other',
    },
    imageUrl: {
      type: String,
      default: '',
    },
    totalQuantity: {
      type: Number,
      required: [true, 'Total quantity is required'],
      min: [0, 'Total quantity cannot be negative'],
      default: 0,
    },
    availableQuantity: {
      type: Number,
      required: true,
      min: [0, 'Available quantity cannot be negative'],
      default: 0,
    },
    unit: {
      type: String,
      default: 'pcs',
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);


componentSchema.virtual('isAvailable').get(function () {
  return this.availableQuantity > 0;
});


componentSchema.pre('save', function () {
  if (this.availableQuantity > this.totalQuantity) {
    this.availableQuantity = this.totalQuantity;
  }
});

module.exports = mongoose.model('Component', componentSchema);
