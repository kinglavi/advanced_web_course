// ```
// todo.model.js
// (c) 2016 David Newman
// david.r.niciforovic@gmail.com
// todo.model.js may be freely distributed under the MIT license
// ```

// */app/models/todo.model.js*

// ## Ad Model

// Note: MongoDB will autogenerate an _id for each Ad object created

// Grab the Mongoose module
import mongoose from 'mongoose';

// Create a `schema` for the `Ad` object
let todoSchema = new mongoose.Schema({
  text: String,
  name: String,
  screenIds: [Number],
  images: [String],
  template: String,
  duration: Number,
  timing: {
    startDate: Date,
    endDate: Date,
    daySchedule: [
      {
        from:{dayTimeInSeconds: Number},
        to:{dayTimeInSeconds: Number},
        days: [Number]
      }
    ]
  },
});

// Expose the model so that it can be imported and used in
// the controller (to search, delete, etc.)
export default mongoose.model('Ad', todoSchema);
