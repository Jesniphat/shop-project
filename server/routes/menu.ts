import * as express from 'express';

import * as promise from 'bluebird';
import { Config } from '../library/configs';
import { Permission } from '../library/permissions';
import { Database } from '../library/databases';

const menuRouter: express.Router = express.Router();

const conn: any = new Config();
const permission: any = new Permission();
const db: any = new Database();

menuRouter.use((req, res, next) => {
  // console.log("perrmission : ", permission.readToken(req));
  if (permission.isLogin(req)) {
    next();
  }else {
    res.status(401).json({
      status: true,
      nologin: true,
      error: 'Access Denied'
    });
  }
});

menuRouter.post('/ping', (req, res, next) => {
  res.json({
      status: true,
      data: '1'
    });
});

menuRouter.post('/menulist', (req, res, next) => {
  const connection = conn.init();
  const param = req.body;
  let $scope;

  const menu_list = function(){
    return new promise((resolve, reject) => {
      const gets = {
        fields: ' * ',
        table: 'menu',
        where: {
          page: param.page
        }
      };
      db.SelectAll(connection, gets, (data) => {
          $scope = data;
          resolve(data);
      }, (error) => {
          console.log(error);
          reject(error);
      });
    });
  };

  menu_list()
  .then(function(data){
    res.json({
      status: true,
      data: data
    });
    connection.end();
  })
  .catch(function(error){
    res.json({
      status: false,
      error: error
    });
    connection.end();
  });
});

export { menuRouter };
