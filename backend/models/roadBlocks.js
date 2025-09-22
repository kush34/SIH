import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const RoadBlockSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  severity: { type: String, enum: ['Low', 'Medium', 'High'], required: true },
  reportedBy: { type: String },
  timestamp: { type: Date, default: Date.now }
});

export default model('RoadBlock', RoadBlockSchema);
