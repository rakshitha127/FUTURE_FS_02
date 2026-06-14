import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
      trim: true
    },
    createdBy: {
      type: String,
      default: 'Admin'
    }
  },
  { timestamps: true }
);

const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },
    phone: {
      type: String,
      trim: true,
      default: ''
    },
    company: {
      type: String,
      trim: true,
      default: ''
    },
    source: {
      type: String,
      trim: true,
      default: 'Website Contact Form'
    },
    service: {
      type: String,
      trim: true,
      default: 'Website / App Development'
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    },
    estimatedValue: {
      type: Number,
      default: 0,
      min: 0
    },
    nextFollowUp: {
      type: Date,
      default: null
    },
    message: {
      type: String,
      trim: true,
      default: ''
    },
    status: {
      type: String,
      enum: ['new', 'contacted', 'converted'],
      default: 'new'
    },
    notes: [noteSchema]
  },
  { timestamps: true }
);

export default mongoose.model('Lead', leadSchema);
