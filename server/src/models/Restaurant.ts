import mongoose, { Schema, Document } from 'mongoose';

export interface IRestaurant extends Document {
  name: string;
  cuisine: string;
  location: {
    type: string;
    coordinates: [number, number];
  };
  address: string;
  menu: Array<{
    name: string;
    price: number;
    description: string;
    category: string;
  }>;
  rating: number;
  isOpen: boolean;
}

const RestaurantSchema: Schema = new Schema({
  name: { type: String, required: true },
  cuisine: { type: String, required: true },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  address: { type: String, required: true },
  menu: [{
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String },
    category: { type: String, required: true }
  }],
  rating: { type: Number, default: 0 },
  isOpen: { type: Boolean, default: true }
});

// Create geospatial index
RestaurantSchema.index({ location: '2dsphere' });

export default mongoose.model<IRestaurant>('Restaurant', RestaurantSchema); 