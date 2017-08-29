import * as mongoose from 'mongoose';

const adSchema = new mongoose.Schema({
  name: String,
  weight: Number,
  age: Number,
  screenIds: [Number],
  images: [String],
  template: String,
  duration: Number,
  timing: {
    startDate: Date,
    endDate: Date,
    daySchedule: [
      {
        from: { dayTimeInSeconds: Number},
        to: { dayTimeInSeconds: Number},
        days: [Number]
      }
    ]
  },
});

const Ad = mongoose.model('Ad', adSchema);

export default Ad;
