import * as express from 'express';

import AdCtrl from './controllers/Ad';
import UserCtrl from './controllers/user';
import StatsCtrl from './controllers/stats';
import Ad from './models/ad';
import User from './models/user';

export default function setRoutes(app) {

  const router = express.Router();

  const adCtrl = new AdCtrl();
  const userCtrl = new UserCtrl();
  const statsCtrl = new StatsCtrl();

  // Ads
  router.route('/ads').get(adCtrl.getAll);
  router.route('/ads/count').get(adCtrl.count);
  router.route('/ads').post(adCtrl.insert);
  router.route('/ads/:id').get(adCtrl.get);
  router.route('/ads/:id').put(adCtrl.update);
  router.route('/ads/:id').delete(adCtrl.delete);

  //Statistics for charts
  router.get('/stats/day/:id', statsCtrl.getStatsByHour);
  router.get('/stats/day', statsCtrl.getStatsByDay);
  router.get('/stats/time', statsCtrl.getTime);


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
