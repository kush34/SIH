import mongoose from "mongoose"

const trafficDataSchema = new mongoose.Schema({
  camera_id: {
    type: String,
    required: true
  },
  vehicle_count: {
    type: Number,
    required: true
  },
  avg_count: {
    type: Number,
    default: 0
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('TrafficData', trafficDataSchema);
