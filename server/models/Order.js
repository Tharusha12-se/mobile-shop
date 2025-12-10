const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  sku: String,
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true
  },
  discountPrice: Number,
  image: String,
  color: String,
  storage: String,
  specifications: Object
});

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  orderNumber: {
    type: String,
    unique: true,
    required: true
  },
  items: [orderItemSchema],
  shippingAddress: {
    type: {
      type: String,
      enum: ['home', 'work', 'other'],
      default: 'home'
    },
    street: String,
    city: String,
    state: String,
    country: {
      type: String,
      default: 'United States'
    },
    zipCode: String,
    phone: String
  },
  billingAddress: {
    sameAsShipping: {
      type: Boolean,
      default: true
    },
    street: String,
    city: String,
    state: String,
    country: String,
    zipCode: String
  },
  contactInfo: {
    email: String,
    phone: String
  },
  paymentMethod: {
    type: String,
    enum: ['cod', 'card', 'paypal', 'stripe', 'bank_transfer'],
    required: true,
    default: 'cod'
  },
  paymentResult: {
    id: String,
    status: String,
    update_time: String,
    email_address: String,
    receipt_url: String
  },
  subtotal: {
    type: Number,
    required: true,
    default: 0.0
  },
  taxPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  shippingPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  discount: {
    type: Number,
    default: 0.0
  },
  coupon: {
    code: String,
    discount: Number,
    type: String // percentage or fixed
  },
  totalPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  currency: {
    type: String,
    default: 'USD'
  },
  isPaid: {
    type: Boolean,
    required: true,
    default: false
  },
  paidAt: Date,
  paymentMethodDetails: Object,
  isDelivered: {
    type: Boolean,
    required: true,
    default: false
  },
  deliveredAt: Date,
  status: {
    type: String,
    enum: [
      'pending',
      'confirmed',
      'processing',
      'shipped',
      'delivered',
      'cancelled',
      'refunded',
      'failed'
    ],
    default: 'pending'
  },
  trackingNumber: String,
  carrier: String,
  shippingMethod: String,
  estimatedDelivery: Date,
  notes: String,
  adminNotes: String,
  cancellationReason: String,
  refundReason: String,
  refundAmount: Number,
  refundedAt: Date
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Generate order number before saving
orderSchema.pre('save', async function(next) {
  if (!this.orderNumber) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    
    // Find last order number
    const lastOrder = await this.constructor.findOne(
      {},
      { orderNumber: 1 },
      { sort: { createdAt: -1 } }
    );
    
    let sequence = 1;
    if (lastOrder && lastOrder.orderNumber) {
      const lastSequence = parseInt(lastOrder.orderNumber.slice(-4));
      sequence = lastSequence + 1;
    }
    
    this.orderNumber = `ORD${year}${month}${day}${sequence.toString().padStart(4, '0')}`;
  }
  
  // Calculate prices if items exist
  if (this.items && this.items.length > 0 && this.isModified('items')) {
    this.subtotal = this.items.reduce((sum, item) => {
      const price = item.discountPrice || item.price;
      return sum + (price * item.quantity);
    }, 0);
    
    // Apply discount if exists
    let discountedTotal = this.subtotal;
    if (this.coupon && this.coupon.discount) {
      if (this.coupon.type === 'percentage') {
        this.discount = (this.subtotal * this.coupon.discount) / 100;
      } else {
        this.discount = this.coupon.discount;
      }
      discountedTotal = Math.max(0, this.subtotal - this.discount);
    }
    
    // Calculate tax (assuming 8% tax rate)
    this.taxPrice = discountedTotal * 0.08;
    
    // Calculate shipping (free over $100)
    this.shippingPrice = discountedTotal > 100 ? 0 : 10;
    
    // Calculate total
    this.totalPrice = discountedTotal + this.taxPrice + this.shippingPrice;
  }
  
  next();
});

// Virtual field for formatted total
orderSchema.virtual('formattedTotal').get(function() {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: this.currency || 'USD'
  }).format(this.totalPrice);
});

// Virtual field for item count
orderSchema.virtual('itemCount').get(function() {
  return this.items.reduce((sum, item) => sum + item.quantity, 0);
});

// Indexes
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ user: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ 'items.product': 1 });

// Update product stock after order is placed
orderSchema.post('save', async function(doc) {
  if (doc.status === 'confirmed' || doc.status === 'processing') {
    const Product = mongoose.model('Product');
    
    for (const item of doc.items) {
      await Product.findByIdAndUpdate(
        item.product,
        { 
          $inc: { 
            stock: -item.quantity,
            sold: item.quantity 
          }
        }
      );
    }
  }
  
  // Restore stock if order is cancelled or refunded
  if (doc.status === 'cancelled' || doc.status === 'refunded') {
    const Product = mongoose.model('Product');
    
    for (const item of doc.items) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: item.quantity, sold: -item.quantity } }
      );
    }
  }
});

module.exports = mongoose.model('Order', orderSchema);