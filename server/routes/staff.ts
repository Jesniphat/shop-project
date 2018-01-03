import * as express from 'express';
import * as Promise from 'bluebird';
import * as uuidv1 from 'uuid/v1';

import { Permission } from '../library/permissions';
import { Config } from '../library/configs';
import { Database } from '../library/databases';

const staffRouter: express.Router = express.Router();
const permission = new Permission();
const conn = new Config();
const db = new Database();

staffRouter.use(function (req, res, next) {
  // console.log('perrmission : ', permission.readToken(req));
  if (permission.isLogin(req)) {
    next();
  } else {
    res.json({
      status: true,
      nologin: true,
      error: 'Access Denied'
    });
  }
});

staffRouter.post('/createstaff', (req, res, next) => {
  const con = conn.init();
  const staff = req.body;

  const insertStaff = function(){
    return new Promise((resolve, reject) => {
      const insertData = {
        table: 'staff',
        query: {
          name: staff.staffName,
          lastname: staff.staffLastName,
          user: staff.staffUserName,
          password: staff.staffPassword,
          uuid: uuidv1()
        }
      };
      const insertThings = db.Insert(con, insertData, success => resolve(success), error => reject(error));
    });
  };

  db.beginTransection(con)
  .then(insertStaff)
  .then((data) => {
    console.log('commit');
    return new Promise((resolve, reject) => {
      const commit = db.Commit(con, (success) => {
        res.json({
          status: true,
          data: data
        });
      }, error => reject(error));
      con.end();
    });
  }).catch((error) => {
    res.json({
      status: false,
      error: error
    });
    con.end();
  });
});


staffRouter.post('/updatestaff', (req, res, next) => {
  const con = conn.init();
  const staff = req.body;

  const updataStaff = function(){
    return new Promise((resolve, reject) => {
      const updataStaffdata = {
        table: 'staff',
        query: {
          name: staff.name,
          lastname: staff.lastName,
          user: staff.user
        },
        where: { id: staff.id }
      };
      const update = db.Update(con, updataStaffdata, success => resolve(success), error => reject(error));
    });
  };

  db.beginTransection(con)
  .then(updataStaff)
  .then((result) => {
    console.log('uo');
    return new Promise((resolve, reject) => {
      db.Commit(con, (success) => {
        res.json({
          status: true,
          data: result
        });
      }, error => reject(error));
      con.end();
    });
  }).catch((error) => {
    res.json({
      status: false,
      data: error
    });
    con.end();
  });

});

export { staffRouter };
