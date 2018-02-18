import * as express from 'express';
import * as Promise from 'bluebird';
import * as uuidv1 from 'uuid/v1';

import { Permission } from '../library/permissions';
import { Config } from '../library/configs';
import { Gencode } from '../library/gencodes';
import { Database } from '../library/databases';

const productStoreRouter: express.Router = express.Router();

const permission = new Permission();
const conn = new Config();
// const gencode = new Gencode();
const db = new Database();

/**
 * Use functiion
 *
 * @access public
 * @param callback function req res next
 * @return JSON
 */
productStoreRouter.use(function (req, res, next) {
  // console.log('perrmission : ', permission.readToken(req));
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



/**
 * MaxProductId
 *
 * @return JSON
 */
productStoreRouter.get('/max', (req, res, next) => {
  const connection = conn.init();

  /**
   * Get product max id
   *
   * @access public
   * @return Promise
   */
  const getProductMaxId = function(){
    return new Promise((resolve, reject) => {
      const get = {
        fields: [
          'MAX(DATE_FORMAT(updated_date, \'%Y-%m-%d %H:%i:%s\')) AS max'
        ],
        table: 'product',
        where: 'status = \'Y\''
      };
      db.SelectAll(connection, get, (data) => {
        resolve(data);
      }, (error) => {
        console.log(error);
        reject('error');
      });
    });
  };

  getProductMaxId()
  .then((data) => {
    // console.log(data[0].max);
    res.json({
      status: true,
      data: data[0].max
    });
    connection.end();
  })
  .catch((error) => {
    console.log('error => ', error);
    res.json({
      status: false,
      error: error
    });
    connection.end();
  });
});



/**
 * Get producname for autocomplete max producr
 *
 * @access function
 * @param max_id
 * @return JSON
 */
productStoreRouter.get('/max_update/:date', (req, res, next) => {
  const max_update: any = req.params.date;
  // const max_update = req.body.max_update;
  const connection = conn.init();

  /**
   * Get data function
   *
   * @access public
   * @return promist
   */
  const getProductName = function(){
    return new Promise((resolve, reject) => {
      const get = {
        fields: [
          'id, code, product_name as name, product_description, DATE_FORMAT(updated_date, \'%Y-%m-%d %H:%i:%s\') as updated_date'
        ],
        table: 'product',
        where: 'status = \'Y\' and updated_date > ' + 'date_format(\'' + max_update + '\', \'%Y-%m-%d %H:%i:%s\')',
        order: ['updated_date']
      };

      db.SelectAll(connection, get, (data) => {
        resolve(data);
      }, (error) => {
        if (error === 'nodata') {
          resolve([]);
        } else {
          console.log(error);
          reject(error);
        }
      });
    });
  };


  /**
   * Blue bird start
   *
   * @return JSON
   */
  getProductName()
  .then(function(data){
    // console.log(data);
    res.json({
      status: true,
      data: data
    });
    connection.end();
  }).catch((errors) => {
    console.log('Roll back error is', errors);
    res.json({
      status: false,
      error: errors
    });
    connection.end();
  });

});


/**
 * Get producname for autocomplete
 *
 * @access function
 * @param max_id
 * @return JSON
 */
productStoreRouter.get('/getAllProductStore/:max_date', (req, res, next) => {
  const max_update = req.params.max_date;
  const connection = conn.init();

  /**
   * Get data function
   *
   * @access public
   * @return promist
   */
  const getProductName = function(){
    return new Promise((resolve, reject) => {
      const get = {
        fields: [
          'id, code, product_name as name, product_description, DATE_FORMAT(updated_date, \'%Y-%m-%d %H:%i:%s\') as updated_date'
        ],
        table: 'product',
        where: 'status = \'Y\' and updated_date > ' + 'date_format(\'' + max_update + '\', \'%Y-%m-%d %H:%i:%s\')',
        order: ['updated_date']
      };
      // console.log(get);
      db.SelectAll(connection, get, (data) => {
        resolve(data);
      }, (error) => {
        if (error === 'nodata') {
          resolve([]);
        } else {
          console.log(error);
          reject(error);
        }
      });
    });
  };


  /**
   * Blue bird start
   *
   * @return JSON
   */
  getProductName()
  .then(function(data){
    // console.log(data);
    res.json({
      status: true,
      data: data
    });
    connection.end();
  }).catch((errors) => {
    console.log('Roll back error is', errors);
    res.json({
      status: false,
      error: errors
    });
    connection.end();
  });

});

/**
 * Get product by id
 *
 * @access public
 * @param callbackfucnt(@pruduct id)
 * @return JSON
 */
productStoreRouter.get('/:id', (req, res, next) => {
  const product_id = req.params.id;
  const connection: any = conn.init();
  const product: any = req.body;
  // let $scope;
  let product_data: any = {};

  const get_product = function($id){
    return new Promise((resolve, reject) => {
      const get = {
        table: 'product',
        where: {
          id: $id
        }
      };
      db.SelectRow(connection, get, (data) => {
        product_data = data;
        resolve(data.id);
      }, (error) => {
        console.log(error);
        reject('error');
      });
    });
  };

  const get_product_pic = function($id){
    // console.log('$data = ', $data);
    return new Promise((resolve, reject) => {
      const gets = {
        table: 'product_pic',
        where: {
          product_id: $id,
          status: 'Y'
        }
      };

      db.SelectAll(connection, gets, (data) => {
        product_data.pic = data;
        resolve('success');
      }, (error) => {
        if (error === 'nodata') {
          resolve('success');
        } else {
          reject(error);
        }
      });
    });

  };

    get_product(product_id)
    .then(get_product_pic)
    .then(function($d){
      res.json({
        status: true,
        data: product_data
      });
      connection.end();
    }).catch(function($e){
      res.json({
        status: false,
        error: $e
      });
      connection.end();
    });
});


/**
 * Save stock in
 */
productStoreRouter.post('/saveStockIn', (req, res, next) => {
  const connection = conn.init();
  const stock = req.body;

  /** Save stock */
  const saveStock = function(){
    return new Promise((resolve, reject) => {
      const insert = {
        table: 'lot_in',
        query: {
          product_id: stock.product_id,
          // product_code: stock.product_code,
          lot_in: stock.product_qty,
          uuid: uuidv1()
        }
      };
      const insertStock = db.Insert(
        connection, insert,
        results => resolve(results.insert_id),
        errors => reject(errors));
    });
  };

  db.beginTransection(connection)
  .then(saveStock)
  .then((stock_id) => {
    return new Promise((resolve, reject) => {
      console.log('commit');
      db.Commit(connection, (success) => {
        console.log('commited !!');
        res.json({
          status: true,
          data: success
        });
        resolve(success);
      }, errors => reject(errors));
      connection.end();
    });
  }).catch((errors) => {
    console.log('Roll back error is', errors);
    db.Rollback(connection, (roll) => {
      res.json({
        status: false,
        error: errors
      });
    });
    connection.end();
  });
});




productStoreRouter.get('/getStockList/:id', (req, res, next) => {
  const connection = conn.init();
  const stock = req.body;
  const productId = req.params.id;

  /** Get data of stock */
  const getStockById = function(){
    return new Promise((resolve, reject) => {
      const get = {
        fields: [
          's.lot_in',
          's.created_at',
          'p.code',
          'p.product_name',
          'p.product_price'
        ],
        table: 'lot_in s inner join product p on s.product_id = p.id',
        where: {'p.status': 'Y', 's.product_id': productId}
      };
      db.SelectAll(connection, get, (data) => {
        resolve(data);
      }, (error) => {
        console.log(error);
        reject('error');
      });
    });
  };

  getStockById()
  .then((data) => {
    // console.log(data[0].max);
    res.json({
      status: true,
      data: data
    });
    connection.end();
  })
  .catch((error) => {
    console.log('error => ', error);
    res.json({
      status: false,
      error: error
    });
    connection.end();
  });

});

export { productStoreRouter };
