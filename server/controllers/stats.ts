
import Ad from '../models/ad';



export default class StatsContr {

  DAYS = [ 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday' ];

  getStatsByDay = (req, res) => {
    Ad.find({}, (err, ads) => {
      if (err)
        console.log(err);
      else {
        let dates = [];
        let days = [];
        let data = [];

        for (let i = 0; i < 7; i ++)
          days.push({adN: 0, dates: []});

        ads.forEach(ad => {
          ad.timeFrames.forEach(frame => {
            for (let date = new Date(frame.startDate.slice(3,6) + frame.startDate.slice(0,3) + frame.startDate.slice(6));
                 date <= new Date(frame.endDate.slice(3,6) + frame.endDate.slice(0,3) + frame.endDate.slice(6));
                 date.setDate(date.getDate() + 1)) {
              let day = date.getDay() === 0 ? 6 : date.getDay() - 1;

              if(frame.days.indexOf(this.DAYS[day])!==-1) {

                if(days[day].dates.indexOf(date) === - 1)
                  days[day].dates.push(date);

                days[day].adN++;
              }
            }
          });
        });

        days.forEach(day => {
          data.push(Math.round(day.adN / day.dates.length));
        });

        res.json({data: data});
      }
    });

  };

  getStatsByHour = (req, res) => {

    let day = this.DAYS[req.params.id];

    Ad.find({
      timeFrames: {'$elemMatch':
        {days: {'$all': [ day ]}
        }}
    }, (err, ads) => {
      if(err)
        console.log(err);
      else {
        let hours = [];
        let data = [];
        for (let i = 0; i < 24; i ++)
          hours.push({adN: 0, dates: []});

        ads.forEach(ad => {
          ad.timeFrames.forEach(frame => {
            for (let date = new Date(frame.startDate.slice(3,6) + frame.startDate.slice(0,3) + frame.startDate.slice(6));
                 date <= new Date(frame.endDate.slice(3,6) + frame.endDate.slice(0,3) + frame.endDate.slice(6));
                 date.setDate(date.getDate() + 1)) {

              let day1 = date.getDay() === 0 ? 6 : date.getDay() - 1;

              if(frame.days.indexOf(this.DAYS[day1])!==-1) {
                for (let hour = parseInt(frame.startTime);
                     hour < parseInt(frame.endTime);
                     hour++) {
                  if(hours[hour].dates.indexOf(date) === -1)
                    hours[hour].dates.push(date);
                  hours[hour].adN++;
                }
              }
            }
          });
        });

        hours.forEach(hour => {
          data.push(Math.round(hour.adN / hour.dates.length));
        });

        res.json({data: data});
      }
    });
  };

  getTime = (req, res) => {

    Ad.aggregate([{
      '$group': {
        _id: null,
        data: { '$avg': '$ttl' }
      }
    }], (err, data) => {
      err
        ? console.log(err)
        : res.json({data: Math.round(data[0].data)});
    });
  }

}

