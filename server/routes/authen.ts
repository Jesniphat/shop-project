import * as express from 'express';
import * as Promise from 'bluebird';
import * as md5 from 'md5';
import { Config } from '../library/configs';
import { Permission } from '../library/permissions';
import { Database } from '../library/databases';
import { connect } from 'net';

const authenRouter: express.Router = express.Router();

const conn: any = new Config();
const permission: any = new Permission();
const db: any = new Database;

authenRouter.post('/checklogin', function(req, res, next){
  // console.log("check login");
  const isLogin = permission.isLogin(req);

  res.json({
    status: true,
    data: isLogin
  });
});

authenRouter.post('/clearlogin', function(req, res, next){
  permission.clearToken(res);
  // console.log("permission : ", permission.readToken(req));
  res.json({
    status: true,
    data: 'set0'
  });
});

authenRouter.post('/login', function(req, res, next) {
  const connection = conn.init();
  const login = req.body;
  let $scope;

  const login_data = function(){
    return new Promise((resolve, reject) => {
      const where = {user: login.user, password: md5(login.password)};
      const gets = {
        fields: '*',
        table:  'staff',
        where:  where
      };
      db.SelectRow(connection, gets,
      (data) => {
        if (data.id === undefined) {
          reject('Can\'t login');
        }
        const id = data.id;
        if (id !== 0 || id !== '0') {
          permission.writeToken(res, id);
          $scope = data;
          resolve(data);
        } else {
          reject('Can\'t login');
        }
      }, (error) => {
        console.log('Error is ', error);
        reject(error);
      });
    });
  };

  login_data()
  .then((data) => {
    res.json({
      status: true,
      data: {
        id: $scope.id,
        display_name: $scope.name,
        last_name: $scope.lastname,
        login_name: $scope.user,
        password: $scope.password,
        type: $scope.type
      }
    });
    connection.end();
  }).catch((error) => {
    res.json({
      status: false,
      error: error
    });
    connection.end();
  });

});

export { authenRouter} ;
