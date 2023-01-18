import mongoose from 'mongoose';

const orderSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: [true, 'An order must belong to a user'],
    },
    products: [
      {
        productId: {
          type: mongoose.Types.ObjectId,
          ref: 'Product',
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
    amount: {
      type: Number,
      required: [true, 'An order must have amount'],
    },
    address: {
      type: Object,
      required: [true, 'An order must have address'],
    },
    status: {
      type: String,
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

orderSchema.pre(/^find/, function (next) {
  this.populate({ path: 'user' });

  next();
});

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

export default Order;
