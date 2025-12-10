const mongoose = require('mongoose');
const slugify = require('slugify');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter product name'],
    trim: true,
    maxlength: [200, 'Product name cannot exceed 200 characters'],
    unique: true
  },
  slug: String,
  description: {
    type: String,
    required: [true, 'Please enter product description'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  shortDescription: {
    type: String,
    maxlength: [500, 'Short description cannot exceed 500 characters']
  },
  price: {
    type: Number,
    required: [true, 'Please enter product price'],
    min: [0, 'Price cannot be negative']
  },
  discountPrice: {
    type: Number,
    min: [0, 'Discount price cannot be negative'],
    validate: {
      validator: function(value) {
        return !value || value <= this.price;
      },
      message: 'Discount price cannot be greater than original price'
    }
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Please select category']
  },
  brand: {
    type: String,
    required: [true, 'Please enter brand']
  },
  sku: {
    type: String,
    unique: true,
    uppercase: true
  },
  stock: {
    type: Number,
    required: [true, 'Please enter product stock'],
    min: [0, 'Stock cannot be negative'],
    default: 0
  },
  images: [{
    public_id: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    },
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  specifications: {
    display: String,
    processor: String,
    ram: String,
    storage: String,
    camera: String,
    battery: String,
    os: String,
    dimensions: String,
    weight: String,
    connectivity: [String],
    colors: [String]
  },
  features: [String],
  ratings: {
    type: Number,
    default: 0,
    min: [0, 'Rating must be at least 0'],
    max: [5, 'Rating cannot exceed 5']
  },
  numOfReviews: {
    type: Number,
    default: 0
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: {
      type: String,
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      required: true
    },
    images: [{
      public_id: String,
      url: String
    }],
    helpful: {
      type: Number,
      default: 0
    },
    notHelpful: {
      type: Number,
      default: 0
    },
    verifiedPurchase: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  meta: {
    title: String,
    description: String,
    keywords: [String]
  },
  featured: {
    type: Boolean,
    default: false
  },
  bestSeller: {
    type: Boolean,
    default: false
  },
  newArrival: {
    type: Boolean,
    default: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  views: {
    type: Number,
    default: 0
  },
  sold: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Create slug from name before saving
productSchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  
  // Generate SKU if not provided
  if (!this.sku) {
    const prefix = this.brand.substring(0, 3).toUpperCase();
    const random = Math.floor(1000 + Math.random() * 9000);
    this.sku = `${prefix}-${random}`;
  }
  
  next();
});

// Virtual field for discount percentage
productSchema.virtual('discountPercentage').get(function() {
  if (this.discountPrice && this.price) {
    return Math.round(((this.price - this.discountPrice) / this.price) * 100);
  }
  return 0;
});

// Virtual field for final price
productSchema.virtual('finalPrice').get(function() {
  return this.discountPrice || this.price;
});

// Virtual field for primary image
productSchema.virtual('primaryImage').get(function() {
  const primary = this.images.find(img => img.isPrimary);
  return primary ? primary.url : (this.images[0] ? this.images[0].url : null);
});

// Indexes for better performance
productSchema.index({ name: 'text', description: 'text', brand: 'text', 'specifications.colors': 'text' });
productSchema.index({ category: 1 });
productSchema.index({ price: 1 });
productSchema.index({ ratings: -1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ featured: 1 });
productSchema.index({ bestSeller: 1 });
productSchema.index({ newArrival: 1 });

// Update average rating method
productSchema.methods.updateAverageRating = async function() {
  if (this.reviews.length === 0) {
    this.ratings = 0;
    this.numOfReviews = 0;
    return;
  }

  const total = this.reviews.reduce((acc, item) => acc + item.rating, 0);
  this.ratings = total / this.reviews.length;
  this.numOfReviews = this.reviews.length;
  
  await this.save();
};

module.exports = mongoose.model('Product', productSchema);