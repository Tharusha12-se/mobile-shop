const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: Number,
  category: { type: String, required: true },
  brand: { type: String, required: true },
  images: [String],
  stock: { type: Number, required: true, default: 0 },
  specifications: {
    display: String,
    processor: String,
    ram: String,
    storage: String,
    camera: String,
    battery: String,
    os: String
  },
  features: [String],
  colors: [String],
  ratings: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  },
  reviews: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: Number,
    comment: String,
    createdAt: { type: Date, default: Date.now }
  }],
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);