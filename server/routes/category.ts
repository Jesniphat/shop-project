// const express = require('express');
import * as express from 'express';
import * as uuidv1 from 'uuid/v1';
import * as promise from 'bluebird';
import { Config } from '../library/configs';
import { Permission } from '../library/permissions';
import { Database } from '../library/databases';

const categoryRouter: express.Router = express.Router();

const conn = new Config();
const permission = new Permission();
const db = new Database();

categoryRouter.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
//   console.log('perrmission : ', permission.readToken(req));
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

/**
 * Get All Category
 * @param url: string
 * @param requert: object
 * @access public
 * @returns data: JSON
 */
categoryRouter.get('/', (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const connection: any = conn.init();
  const category: any = req.body;
  let $scope: any;
  // let sql = 'SELECT id, cate_name, cate_description, '' as product_qty FROM category WHERE status = \'Y\'';
  // let where = [];
  const category_list: any = function(){
    return new promise((resolve, reject) => {
      const gets: any = {
        fields: '*, \'\' as product_qty ',
        table: 'category',
        where: {
          status: 'Y'
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

  category_list()
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

// categoryRouter.post('/getcategorybyid', (req: express.Request, res: express.Response, next: express.NextFunction) => { });
/**
 * Get Category by id
 * @param url/id/:id: strung
 * @param request: object
 * @access public
 * @returns data: JSON
 */
categoryRouter.get('/:id', (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const category_id: any = req.params.id;
  const connection: any = conn.init();
  const category: any = req.body;
  let $scope: any;

  const getcategorybyid: any = function(){
    return new promise((resolve, reject) => {
      const where: any = {id: category_id};
      const gets: any = {
        fields: ['*'],
        table:  'category',
        where:  where
      };
      db.SelectRow(connection, gets,
        (data) => {
          $scope = data;
          resolve(data);
        }, (error) => {
          console.log(error);
          reject(error);
      });
    });
  };

  getcategorybyid()
  .then(function(data){
    res.json({
      status: true,
      data: data
    });
    connection.end();
  }).catch(function(e){
    res.json({
      status: false,
      error: e
    });
    connection.end();
  });
});


/**
 * Save category
 * @param url/ : string
 * @param requires: object
 * @access public
 * @returns data: JSON
 */
categoryRouter.post('/', (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const connection: any = conn.init();
  const category: any = req.body;
  let $scope: any = '';

  const savecetegory: any = function(transection) {
    return new promise((resolve, reject) => {
        const data = {
        query: {
          cate_name: category.cateName,
          cate_description: category.cateDescription,
          status: category.selectedStatus,
          cover_pic: category.coverPic,
          created_by: permission.getID(req),
          updated_by: permission.getID(req),
          uuid: uuidv1()
        },
        table: 'category'
      };
      // sql = "INSERT INTO category SET ? ";
      db.Insert(connection, data, (success) => {
        // console.log("Insert Category success = ", success);
        $scope = success;
        resolve(success);
      }, (error) => {
        // console.log("Noooooooooooooo!!! Insert Category Error !!! = ", error);
        reject(error);
      });
    });
  };


  db.beginTransection(connection)
  .then(savecetegory)
  .then(function(d){
    return new promise((resolve, reject) => {
      db.Commit(connection, (success) => {
        console.log('create cate !!');
        res.json({
          status: true,
          data: $scope
        });
        resolve('commited');
      }, (error) => {
        reject(error);
      });
      connection.end();
    });
  }).catch(function(e){
    console.log('Roll back error is', e);
    db.Rollback(connection, (roll) => {
      res.json({
        status: false,
        error: e
      });
      connection.end();
    });
  });
});


/**
 * Edit category
 * @argument /: string, requires: object
 * @access public
 * @returns data: JSON
 */
categoryRouter.put('/', (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const connection: any = conn.init();
  const category: any = req.body;
  let $scope: any = '';

  const savecetegory: any = function() {
    return new promise((resolve, reject) => {
      const data = {
        query: {
          cate_name: category.cateName,
          cate_description: category.cateDescription,
          status: category.selectedStatus,
          cover_pic: category.coverPic
        },
        table: 'category',
        where: {
          id: category.cateId
        }
      };

      db.Update(connection, data, (success) => {
        // console.log("Update categort success = ", success);
        resolve(success);
        $scope = success;
      }, (error) => {
        // console.log("Error Update Category = ", error);
        reject(error);
      });
    });
  };


  db.beginTransection(connection)
  .then(savecetegory)
  .then(function(d){
    return new promise((resolve, reject) => {
      db.Commit(connection, (success) => {
        console.log('Update cate !!');
        res.json({
          status: true,
          data: $scope
        });
        resolve('commited');
      }, (error) => {
        reject(error);
      });
      connection.end();
    });
  }).catch(function(e){
    console.log('Roll back error is', e);
    db.Rollback(connection, (roll) => {
      res.json({
        status: false,
        error: e
      });
      connection.end();
    });
  });
});

export { categoryRouter };
