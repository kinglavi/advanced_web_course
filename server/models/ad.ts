import * as mongoose from 'mongoose';

const adSchema = new mongoose.Schema({
  name: String,
  adText: [ String ],
  image: [ String ],
  templateLink: [ String ],
  ttl: Number,
  timeFrames: [{
    startDate: String,
    endDate: String,
    days: [String],
    startTime: String,
    endTime: String
  }],
  screens: [ Number ]

});

const Ad = mongoose.model('Ad', adSchema);

export default Ad;
