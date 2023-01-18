import slugify from 'slugify';
import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'A product must have a title'],
      unique: true,
      trim: true,
    },
    slug: String,
    desc: {
      type: String,
      required: [true, 'A product must have a description'],
      trim: true,
    },
    img: {
      type: String,
      required: [true, 'A product must have an image'],
    },
    categories: {
      type: Array,
    },
    size: {
      type: Array,
    },
    color: {
      type: Array,
    },
    price: {
      type: Number,
      required: [true, 'A product must have a price'],
    },
    inStock: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

productSchema.index({
  title: 'text',
  desc: 'text',
});

productSchema.index({ title: 1, price: 1 });
productSchema.index({ categories: 1, slug: 1 });

productSchema.pre('save', function (next) {
  if (!this.isModified('title')) return next();
  this.slug = slugify(this.title, { lower: true });
  next();
});

const Product = mongoose.models.Product ||
  mongoose.model('Product', productSchema);

export default Product;
