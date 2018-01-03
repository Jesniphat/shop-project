import * as express from 'express';
import * as Promise from 'bluebird';
import * as uuidv1 from 'uuid/v1';

import { Permission } from '../library/permissions';
import { Config } from '../library/configs';
import { Gencode } from '../library/gencodes';
import { Database } from '../library/databases';

const productRouter: express.Router = express.Router();

const permission = new Permission();
const conn = new Config();
const gencode = new Gencode();
const db = new Database();


/**
 * Manage product picture
 *
 * @param product id
 * @return product id and error
 */
const product_pic_manage = function(param: any) {
  return new Promise((resolve, reject) => {
    if ((param.product.pic_id).length > 0) {
      const update = {
        table: 'product_pic',
        query: { status: 'N' },
        where: { product_id: param.product.id }
      };
      const nPic = db.Update(param.connection, update, (success) => {
        const updatePic = {
          table: 'product_pic',
          query: { product_id: param.product.id, status: 'Y' },
          where: ' id IN (' + (param.product.pic_id).toString() + ')'
        };
        const aPic = db.Update(param.connection, updatePic, succes => resolve(param), errors => reject(errors));
      }, errors => reject(errors));
    } else {
      const update = {
        table: 'product_pic',
        query: {
          status: 'N',
          cover: 'N'
        },
        where: { product_id: param.product.id }
      };
      const updatePicData = db.Update(param.connection, update, success => resolve(param), errors => reject(errors));
    }
  });
};

/**
 * Product reccommen
 * @param function connection
 * @param object product
 * @access public
 * @returns function connection
 * @returns object product
 */
const product_recommend = function(param: any) {
  return new Promise((resolve, reject) => {
    if (param.product.recommend === true) {
      const query = {
        table: 'product',
        fields: ['id'],
        where: { recommend: 'Y' },
        order: ['rec_row']
      };
      db.SelectAll(param.connection, query, (success) => {
        const recommend_list = [];
        const recs = [];
        success.forEach((value, index) => {
          recs.push(value);
        });
        const checkId = recs.indexOf(param.product.id);
        success.forEach((value, index) => {
          if (index === 0 && success.length === 3 && checkId === (-1)) {
            return;
          }
          recommend_list.push(value.id);
        });
        recommend_list.push(param.product.id);
        const updateNRecomment = {
          table: 'product',
          query: { recommend: 'N' },
          where: { recommend: 'Y' }
        };
        db.Update(param.connection, updateNRecomment, (succes) => {
          recommend_list.forEach((value, index) => {
            const updateRecomment = {
              table: 'product',
              query: { recommend: 'Y', rec_row: index },
              where: { id: value }
            };
            db.Update(param.connection, updateRecomment, successs => resolve(param), er => reject(er));
          });
        }, err => reject(err));
      }, errers => reject(errers));
    } else {
      const updateRecomment = {
        table: 'product',
        query: { recommend: 'N', rec_row: '0' },
        where: { id: param.product.id }
      };
      db.Update(param.connection, updateRecomment, success => resolve(param), errors => reject(errors));
    }
  });
};

/**
 * Set cover pic
 *
 * @param {*} product_id
 * @return product_id and error
 */
const product_set_cover = function(param: any){
  console.log('set cover');
  return new Promise((resolve, reject) => {
    if (param.product.coverId !== '0') {
      const updateNCover = {
        table: 'product_pic',
        query: { cover: 'N'},
        where: { product_id: param.product.id }
      };
      db.Update(param.connection, updateNCover, (success) => {
        const updateCover = {
          table: 'product_pic',
          query: { cover: 'Y' },
          where: { id: param.product.coverId }
        };
        db.Update(param.connection, updateCover, succes => resolve(param), error => reject(error));
      }, errors => reject(errors));
    } else {
      resolve(param);
    }
  });
};


/**
 * Use functiion
 *
 * @access public
 * @param callback function req res next
 * @return JSON
 */
productRouter.use(function (req, res, next) {
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

/**
 * product list
 *
 * @access public
 * @param callback function req res next
 * @return JSON
 */
productRouter.get('/', (req, res, next) => {
  const connection = conn.init();
  const product = req.body;
  // let $scope;

  const product_list = function(){
    return new Promise((resolve, reject) => {
      const gets = {
        fields: [
          'p.*',
          'max(pp.productpic_path) as img'
        ],
        table: 'product p left join product_pic pp on p.id = pp.product_id and pp.cover = \'Y\'',
        where: {'p.status': 'Y'},
        group: 'p.id'
      };
      // console.log('line 186: ', gets);
      db.SelectAll(connection, gets, (data) => {
          resolve(data);
        }, (error) => {
          console.log(error);
          reject(error);
        });
    });
  };

  product_list()
  .then(($data) => {
    res.json({
      status: true,
      data: $data
    });
    connection.end();
  })
  .catch(($error) => {
    res.json({
      status: false,
      error: $error
    });
    connection.end();
  });
});


// productRouter.post('/product_list', (req, res, next) => { });
/**
 * Get product by id
 *
 * @access public
 * @param callbackfucnt(@pruduct id)
 * @return JSON
 */
productRouter.get('/:id', (req, res, next) => {
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
 * Get product by id
 *
 * @access public
 * @param callbackfucnt(@pruduct id)
 * @return JSON
 */
productRouter.post('/getproductbyid', (req, res, next) => {
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

  const get_product_pic = function($data){
    // console.log('$data = ', $data);
    return new Promise((resolve, reject) => {
      const gets = {
        table: 'product_pic',
        where: {
          product_id: $data,
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

    get_product(product.product_id)
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
  }
);


/**
 * Save product
 * @access public
 * @param {product object}
 * @return JSON
 */
productRouter.post('/', (req, res, next) => {
  const connection = conn.init();
  console.log('save product = ', req.body);
  const product = req.body;
  const product_id = '';
  let product_code = '';

  /**
   * Gencode
   * @access public
   * @returns maxcode: string
   */
  const getCode = function() {
    return new Promise((resolve, reject) => {
      gencode.Code(connection, 'product', 'code', 'P', 5, 1,
        maxcode => {
          resolve(maxcode);
        },
        error => {
          reject(error);
        }
      );
    });
  };

  /**
   * Save product
   * @return product id and error
   */
  const saveProduct = function(code: any){
    return new Promise((resolve, reject) => {
      product_code = code;
      const insert = {
        table: 'product',
        query: {
          code: product_code,
          product_name: product.name,
          product_description: product.desc,
          product_price: product.price,
          product_cost: product.cost,
          created_by: product.staffid,
          category_id: product.category,
          uuid: uuidv1()
        }
      };
      const insertProduct = db.Insert(connection, insert,
        (results) => {
          product.id = results.insert_id;
          const result = {
            connection: connection,
            product: product
          };
          resolve(result);
        },
        (errors) => {
          reject(errors);
        }
      );
    });
  };

  db.beginTransection(connection)
  .then(getCode)
  .then(saveProduct)
  .then(product_pic_manage)
  .then(product_recommend)
  .then(product_set_cover)
  .then((product_ids) => {
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

/**
 * Edit product
 * @param url /
 * @param request
 * @access public
 * @return JSON
 */
productRouter.put('/', (req, res, next) => {
  const connection = conn.init();
  console.log('save product = ', req.body);
  const product = req.body;

  /**
   * Save product
   *
   * @return product id and error
   */
  const saveProduct = function(){
    return new Promise((resolve, reject) => {
      const update = {
        table: 'product',
        query: {
          product_name: product.name,
          product_description: product.desc,
          product_price: product.price,
          product_cost: product.cost,
          created_by: product.staffid,
          category_id: product.category
        },
        where: { id: product.id }
      };
      const updateProduct = db.Update(connection, update,
        results => resolve({connection: connection, product: product}),
        error => reject(error)
      );
    });
  };

  db.beginTransection(connection)
  .then(saveProduct)
  .then(product_pic_manage)
  .then(product_recommend)
  .then(product_set_cover)
  .then((product_ids) => {
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


productRouter.post('/saveproduct', (req, res, next) => {
  const connection = conn.init();
  console.log('save product = ', req.body);
  const product = req.body;
  const product_id = '';
  let product_code = '';

  /**
   * Save product
   *
   * @return product id and error
   */
  const saveProduct = function(){
    return new Promise((resolve, reject) => {
      if (product.id === 'create') {
        gencode.Code(connection, 'product', 'code', 'P', 5, 1, (max_code) => {
          product_code = max_code;
          const insert = {
            table: 'product',
            query: {
              code: product_code,
              product_name: product.name,
              product_description: product.desc,
              product_price: product.price,
              product_cost: product.cost,
              created_by: product.staffid,
              category_id: product.category,
              uuid: uuidv1()
            }
          };
          const insertProduct = db.Insert(connection, insert, results => resolve(results.insert_id), errors => reject(errors));
        }, (error) => {
          reject(error);
        });
      } else {
        const update = {
          table: 'product',
          query: {
            product_name: product.name,
              product_description: product.desc,
              product_price: product.price,
              product_cost: product.cost,
              created_by: product.staffid,
              category_id: product.category
          },
          where: { id: product.id }
        };
        const updateProduct = db.Update(connection, update, results => resolve(product.id), error => reject(error));
      }
    });
  };

  /**
   * Manage product picture
   *
   * @param product id
   * @return product id and error
   */
  const picManage = function(product_ids: any) {
    return new Promise((resolve, reject) => {
      if ((product.pic_id).length > 0) {
        const update = {
          table: 'product_pic',
          query: { status: 'N' },
          where: { product_id: product_ids }
        };
        const nPic = db.Update(connection, update, (success) => {
          const updatePic = {
            table: 'product_pic',
            query: { product_id: product_ids, status: 'Y' },
            where: ' id IN (' + (product.pic_id).toString() + ')'
          };
          const aPic = db.Update(connection, updatePic, succes => resolve(product_ids), errors => reject(errors));
        }, errors => reject(errors));
      } else {
        const update = {
          table: 'product_pic',
          query: {
            status: 'N',
            cover: 'N'
          },
          where: { product_id: product_ids }
        };
        const updatePicData = db.Update(connection, update, success => resolve(product_ids), errors => reject(errors));
      }
    });
  };

  /**
   * Reccommend
   *
   * @param {*} product_id
   * @return product_id and error
   */
  const recommendProduct = function(product_ids) {
    return new Promise((resolve, reject) => {
      if (product.recommend === true) {
        const query = {
          table: 'product',
          fields: ['id'],
          where: { recommend: 'Y' },
          order: ['rec_row']
        };
        db.SelectAll(connection, query, (success) => {
          const recommend_list = [];
          const recs = [];
          success.forEach((value, index) => {
            recs.push(value);
          });
          const checkId = recs.indexOf(product_ids);
          success.forEach((value, index) => {
            if (index === 0 && success.length === 3 && checkId === (-1)) {
              return;
            }
            recommend_list.push(value.id);
          });
          recommend_list.push(product_ids);
          const updateNRecomment = {
            table: 'product',
            query: { recommend: 'N' },
            where: { recommend: 'Y' }
          };
          db.Update(connection, updateNRecomment, (succes) => {
            recommend_list.forEach((value, index) => {
              const updateRecomment = {
                table: 'product',
                query: { recommend: 'Y', rec_row: index },
                where: { id: value }
              };
              db.Update(connection, updateRecomment, successs => resolve(product_ids), er => reject(er));
            });
          }, err => reject(err));
        }, errers => reject(errers));
      } else {
        const updateRecomment = {
          table: 'product',
          query: { recommend: 'N', rec_row: '0' },
          where: { id: product_ids }
        };
        db.Update(connection, updateRecomment, success => resolve(product_ids), errors => reject(errors));
      }
    });
  };


  /**
   * Set cover pic
   *
   * @param {*} product_id
   * @return product_id and error
   */
  const setCover = function(product_ids){
    console.log('set cover');
    return new Promise((resolve, reject) => {
      if (product.coverId !== '0') {
        const updateNCover = {
          table: 'product_pic',
          query: { cover: 'N'},
          where: { product_id: product_ids }
        };
        db.Update(connection, updateNCover, (success) => {
          const updateCover = {
            table: 'product_pic',
            query: { cover: 'Y' },
            where: { id: product.coverId }
          };
          db.Update(connection, updateCover, succes => resolve(product_ids), error => reject(error));
        }, errors => reject(errors));
      } else {
        resolve(product_ids);
      }
    });
  };

  db.beginTransection(connection)
  .then(saveProduct)
  .then(picManage)
  .then(recommendProduct)
  .then(setCover)
  .then((product_ids) => {
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


/**
 * Delete product
 *
 * @access publict
 * @param product id
 * @return JSON
 */
productRouter.post('/delete_product', (req, res, next) => {
  const product = req.body;
  const connection = conn.init();

  /**
   * Delete product
   *
   * @return void
   */
  const deleteProd = function(){
    return new Promise((resolve, reject) => {
      const updateDelete = {
        table: 'product',
        query: { status: 'N' },
        where: { id: product.id }
      };
      const up = db.Update(connection, updateDelete, success => resolve(success), error => reject(error));
    });
  };


  /**
   * Blue bird start
   *
   * @return JSON
   */
  db.beginTransection(connection)
  .then(deleteProd)
  .then(function(){
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


/**
 * Get producname for autocomplete
 *
 * @access function
 * @param max_id
 * @return JSON
 */
productRouter.post('/getAllProductStore', (req, res, next) => {
  const max_update = req.body.max_update;
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
 * MaxProductId
 *
 * @return JSON
 */
productRouter.post('/maxProductUpdate', (req, res, next) => {
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
 * Save stock in
 */
productRouter.post('/saveStockIn', (req, res, next) => {
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


productRouter.post('/getStockList', (req, res, next) => {
  const connection = conn.init();
  const stock = req.body;

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
        where: {'p.status': 'Y', 's.product_id': stock.product_id}
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

export { productRouter };
