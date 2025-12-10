class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields', 'search'];
    excludedFields.forEach(field => delete queryObj[field]);

    // Advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  search() {
    if (this.queryString.search) {
      const searchTerm = this.queryString.search;
      this.query = this.query.find({
        $or: [
          { name: { $regex: searchTerm, $options: 'i' } },
          { description: { $regex: searchTerm, $options: 'i' } },
          { brand: { $regex: searchTerm, $options: 'i' } },
          { sku: { $regex: searchTerm, $options: 'i' } }
        ]
      });
    }
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  paginate() {
    const page = parseInt(this.queryString.page, 10) || 1;
    const limit = parseInt(this.queryString.limit, 10) || 12;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    this.page = page;
    this.limit = limit;
    return this;
  }

  // For products specific filtering
  filterProducts() {
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields', 'search', 'category', 'brand', 'price'];
    excludedFields.forEach(field => delete queryObj[field]);

    // Filter by category
    if (this.queryString.category) {
      this.query = this.query.find({ 
        'category.slug': this.queryString.category 
      });
    }

    // Filter by brand
    if (this.queryString.brand) {
      const brands = this.queryString.brand.split(',');
      this.query = this.query.find({ brand: { $in: brands } });
    }

    // Filter by price range
    if (this.queryString.price) {
      const [min, max] = this.queryString.price.split('-').map(Number);
      this.query = this.query.find({ 
        $or: [
          { discountPrice: { $gte: min, $lte: max } },
          { price: { $gte: min, $lte: max } }
        ]
      });
    }

    // Filter by rating
    if (this.queryString.rating) {
      this.query = this.query.find({ 
        ratings: { $gte: parseInt(this.queryString.rating) } 
      });
    }

    // Filter by stock
    if (this.queryString.inStock === 'true') {
      this.query = this.query.find({ stock: { $gt: 0 } });
    }

    // Filter by featured
    if (this.queryString.featured === 'true') {
      this.query = this.query.find({ featured: true });
    }

    // Filter by bestSeller
    if (this.queryString.bestSeller === 'true') {
      this.query = this.query.find({ bestSeller: true });
    }

    // Filter by newArrival
    if (this.queryString.newArrival === 'true') {
      this.query = this.query.find({ newArrival: true });
    }

    // Apply other filters
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
    
    if (Object.keys(JSON.parse(queryStr)).length > 0) {
      this.query = this.query.find(JSON.parse(queryStr));
    }

    return this;
  }
}

module.exports = APIFeatures;