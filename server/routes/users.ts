import * as express from 'express';
const usersRouter: express.Router = express.Router();

/* GET users listing. */
usersRouter.get('/', function(req, res, next) {
  console.log('jes test server run normoly.');
  res.send('respond with a resource');
});

export { usersRouter };
