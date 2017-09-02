import * as mongoose from 'mongoose';

const adSchema = new mongoose.Schema({
  name: String,
  adText: [String],
  screens: [Number],
  imageLink: [String],
  templateLink: String,
  ttl: Number,
  timeFrames: {
    startDate: Date,
    endDate: Date,
    days: [String],
    startTime: String,
    endTime: String
  },
});

const Ad = mongoose.model('Ad', adSchema);

export default Ad;
