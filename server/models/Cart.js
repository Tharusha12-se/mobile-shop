const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity cannot be less than 1'],
    default: 1
  },
  price: {
    type: Number,
    required: true
  },
  discountPrice: Number,
  color: String,
  storage: String,
  specifications: Object,
  addedAt: {
    type: Date,
    default: Date.now
  }
});

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  items: [cartItemSchema],
  coupon: {
    code: String,
    discount: Number,
    type: String, // percentage or fixed
    minPurchase: Number,
    expiresAt: Date
  },
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Update updatedAt on save
cartSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Calculate subtotal
cartSchema.virtual('subtotal').get(function() {
  return this.items.reduce((sum, item) => {
    const price = item.discountPrice || item.price;
    return sum + (price * item.quantity);
  }, 0);
});

// Calculate discount
cartSchema.virtual('discountAmount').get(function() {
  if (!this.coupon || !this.coupon.discount) return 0;
  
  if (this.coupon.type === 'percentage') {
    return (this.subtotal * this.coupon.discount) / 100;
  } else {
    return this.coupon.discount;
  }
});

// Calculate total after discount
cartSchema.virtual('totalAfterDiscount').get(function() {
  return Math.max(0, this.subtotal - this.discountAmount);
});

// Calculate estimated tax (8%)
cartSchema.virtual('estimatedTax').get(function() {
  return this.totalAfterDiscount * 0.08;
});

// Calculate estimated shipping (free over $100)
cartSchema.virtual('estimatedShipping').get(function() {
  return this.totalAfterDiscount > 100 ? 0 : 10;
});

// Calculate estimated total
cartSchema.virtual('estimatedTotal').get(function() {
  return this.totalAfterDiscount + this.estimatedTax + this.estimatedShipping;
});

// Calculate total items
cartSchema.virtual('totalItems').get(function() {
  return this.items.reduce((sum, item) => sum + item.quantity, 0);
});

// Check if coupon is valid
cartSchema.methods.isCouponValid = function() {
  if (!this.coupon || !this.coupon.expiresAt) return true;
  
  const now = new Date();
  return now < new Date(this.coupon.expiresAt);
};

// Check minimum purchase for coupon
cartSchema.methods.meetsCouponRequirements = function() {
  if (!this.coupon || !this.coupon.minPurchase) return true;
  
  return this.subtotal >= this.coupon.minPurchase;
};

module.exports = mongoose.model('Cart', cartSchema);