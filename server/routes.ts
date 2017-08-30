import * as express from 'express';

import AdCtrl from './controllers/Ad';
import UserCtrl from './controllers/user';
import Ad from './models/ad';
import User from './models/user';

export default function setRoutes(app) {

  const router = express.Router();

  const adCtrl = new AdCtrl();
  const userCtrl = new UserCtrl();

  // Ads
  router.route('/ads').get(adCtrl.getAll);
  router.route('/ads/count').get(adCtrl.count);
  router.route('/ads').post(adCtrl.insert);
  router.route('/ads/:id').get(adCtrl.get);
  router.route('/ads/:id').put(adCtrl.update);
  router.route('/ads/:id').delete(adCtrl.delete);

  router.get('/stats/day/:id', (req, res) => {

    const dataArr = [
      {data: [24, 33, 55, 24, 56, 65, 64, 73, 68, 33, 66, 77, 64, 57, 76, 82, 74, 56, 67, 74, 68, 84, 57, 55]},
      {data: [34, 67, 34, 56, 45, 75, 45, 4, 46, 57, 55, 64, 45, 75, 56, 34, 45, 45, 65, 53, 56, 34, 64, 36]},
      {data: [56, 65 ,56, 34, 65, 54,65,65,87,55,76,57,89,65,34,96,23,56,87,56,67,67,34,45]},
      {data: [32,65,34,76,45,65,98,86,87,56,87,46,67,34,86,56,87,45,78,23,45,34,45,34]},
      {data: [34,45,76,65,87,45,87,45,86,97,45,76,45,76,65,56,76,56,67,56,67,65,57,45]},
      {data: [34,67,34,76,45,67,34,76,34,75,34,45,34,87,44,88,33,66,46,34,85,34,56,46]},
      {data: [23,54,67,43,78,56,98,56,58,45,67,46,67,34,89,64,56,85,43,56,34,86,34,75]}
    ];
    res.json(dataArr[req.params.id]);

  });

  router.get('/stats/day', (req, res) => {
    res.json({data: [55, 45, 87, 56, 34, 23, 67]});
  });


  router.get('/stats/time', (req, res) => {
    res.json({data: 4});
  });


  // Users
  router.route('/login').post(userCtrl.login);
  router.route('/users').get(userCtrl.getAll);
  router.route('/users/count').get(userCtrl.count);
  router.route('/user').post(userCtrl.insert);
  router.route('/user/:id').get(userCtrl.get);
  router.route('/user/:id').put(userCtrl.update);
  router.route('/user/:id').delete(userCtrl.delete);

  // Apply the routes to our appliAdion with the prefix /api
  app.use('/api', router);

}
