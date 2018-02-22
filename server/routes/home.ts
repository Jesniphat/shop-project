import * as express from 'express';
import { Permission } from '../library/permissions';
import { Databases } from '../library/databases';

const homeRouter: express.Router = express.Router();

const permission: any = new Permission();

homeRouter.use((req, res, next) => {
  // console.log("perrmission : ", permission.readToken(req));
  if (permission.isLogin(req)) {
    next();
  } else {
    res.status(401).json({
      status: true,
      nologin: true,
      error: 'Access Denied'
    });
  }
});

homeRouter.post('/ping', (req, res, next) => {
  res.json({
      status: true,
      data: '1'
    });
});

export {homeRouter};
