import * as express from 'express';
// import * as Promise from 'bluebird';
import * as uuidv1 from 'uuid/v1';

import { Permission } from '../library/permissions';
import { Config } from '../library/configs';
import { Gencode } from '../library/gencodes';
import { Databases } from '../library/databases.1';

const productRouter: express.Router = express.Router();

const permission = new Permission();
const gencode = new Gencode();

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
    res.status(401).json({
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
  class GetProductAll {
    private db = new Databases();
    private product = req.body;
    private filter = req.query;
    private $scope = {
      row: 1,
      data: ''
    };

    private _filterName() {
      let filtername = '';
      if (this.filter.filtertext !== '') {
        filtername = ' and product_name like \'%' + this.filter.filtertext + '%\'';
      }
      return filtername;
    }

    private _pageStart() {
      const page_start = (this.filter.limit * this.filter.page) - this.filter.limit;
      return page_start;
    }

    private _productCount() {
      const productCount = {
        fields: 'count(id) as row ',
        table: 'product',
        where: 'status = \'Y\'' + this._filterName()
      };
      return productCount;
    }

    private _productList() {
      const productList = {
        fields: [
          'p.*',
          'max(pp.productpic_path) as img'
        ],
        table: 'product p left join product_pic pp on p.id = pp.product_id and pp.cover = \'Y\'',
        where: 'p.status = \'Y\'' + this._filterName() ,
        order: this.filter.sort,
        limit: this._pageStart() + ', ' + this.filter.limit,
        group: 'p.id'
      };

      return productList;
    }

    public async getProductAll() {
      try {
        const count = await this.db.SelectRow(this._productCount());
        if (count.row <= this.filter.limit) {
          this.$scope.row = 1;
        } else if ((count.row % this.filter.limit) === 0) {
          this.$scope.row = (count.row / this.filter.limit) ;
        } else {
          this.$scope.row = Math.ceil((count.row / this.filter.limit));
        }

        const list = await this.db.SelectAll(this._productList());
        this.$scope.data = list;

        const end = await this.db.EndConnect();
        await res.json({
          status: true,
          data: this.$scope
        });
      } catch (error) {
        const end = await this.db.EndConnect();
        await res.json({
          status: false,
          error: error
        });
      }
    }
  }

  const getProductAll = new GetProductAll();
  getProductAll.getProductAll();
});


productRouter.get('/name', (req, res, next) => {
  class GetProductListByName {
    private db = new Databases();
    private product = req.body;
    private filter = req.query;

    private filterName: any = '';

    private _genFilterByName() {
      if (this.filter.keyword) {
        this.filterName = ' and ' + this.filter.column + ' like \'%' + this.filter.keyword + '%\'';
      }
    }

    private _product_list(): Promise<any> {
      return new Promise((resolve, reject) => {
        const page_start = ((this.filter.limit * this.filter.page) - this.filter.limit);
        const gets = {
          fields: [
            'p.*'
          ],
          table: 'product p ',
          where: 'p.status = \'Y\'' + this.filterName
        };
        // console.log('line 186: ', gets);
        try {
          const data = this.db.SelectAll(gets);
          resolve(data);
        } catch (error) {
          reject(error);
        }
      });
    }

    public async productListByName() {
      try {
        const filter = await this._genFilterByName();
        const list = await this._product_list();
        const end = await this.db.EndConnect();
        await res.json({
          status: true,
          data: list
        });
      } catch (error) {
        const end = await this.db.EndConnect();
        await res.json({
          status: false,
        error: error
        });
      }
    }
  }

  const productListByName = new GetProductListByName();
  productListByName.productListByName();
});


// // productRouter.post('/product_list', (req, res, next) => { });
// /**
//  * Get product by id
//  *
//  * @access public
//  * @param callbackfucnt(@pruduct id)
//  * @return JSON
//  */
// productRouter.get('/:id', (req, res, next) => {
//   const product_id = req.params.id;
//   const connection: any = conn.init();
//   const product: any = req.body;
//   // let $scope;
//   let product_data: any = {};

//   const get_product = function($id){
//     return new Promise((resolve, reject) => {
//       const get = {
//         table: 'product',
//         where: {
//           id: $id
//         }
//       };
//       db.SelectRow(connection, get, (data) => {
//         product_data = data;
//         resolve(data.id);
//       }, (error) => {
//         console.log(error);
//         reject('error');
//       });
//     });
//   };

//   const get_product_pic = function($id){
//     // console.log('$data = ', $data);
//     return new Promise((resolve, reject) => {
//       const gets = {
//         table: 'product_pic',
//         where: {
//           product_id: $id,
//           status: 'Y'
//         }
//       };

//       db.SelectAll(connection, gets, (data) => {
//         product_data.pic = data;
//         resolve('success');
//       }, (error) => {
//         if (error === 'nodata') {
//           resolve('success');
//         } else {
//           reject(error);
//         }
//       });
//     });

//   };

//     get_product(product_id)
//     .then(get_product_pic)
//     .then(function($d){
//       res.json({
//         status: true,
//         data: product_data
//       });
//       connection.end();
//     }).catch(function($e){
//       res.json({
//         status: false,
//         error: $e
//       });
//       connection.end();
//     });
// });


// /**
//  * Save product
//  * @access public
//  * @param {product object}
//  * @return JSON
//  */
// productRouter.post('/', (req, res, next) => {
//   const connection = conn.init();
//   console.log('save product = ', req.body);
//   const product = req.body;
//   const product_id = '';
//   let product_code = '';

//   /**
//    * Gencode
//    * @access public
//    * @returns maxcode: string
//    */
//   const getCode = function() {
//     return new Promise((resolve, reject) => {
//       gencode.Code(connection, 'product', 'code', 'P', 5, 1,
//         maxcode => {
//           resolve(maxcode);
//         },
//         error => {
//           reject(error);
//         }
//       );
//     });
//   };

//   /**
//    * Save product
//    * @return product id and error
//    */
//   const saveProduct = function(code: any){
//     return new Promise((resolve, reject) => {
//       product_code = code;
//       const insert = {
//         table: 'product',
//         query: {
//           code: product_code,
//           product_name: product.name,
//           product_description: product.desc,
//           product_price: product.price,
//           product_cost: product.cost,
//           created_by: product.staffid,
//           category_id: product.category,
//           uuid: uuidv1()
//         }
//       };
//       const insertProduct = db.Insert(connection, insert,
//         (results) => {
//           product.id = results.insert_id;
//           const result = {
//             connection: connection,
//             product: product
//           };
//           resolve(result);
//         },
//         (errors) => {
//           reject(errors);
//         }
//       );
//     });
//   };

//   db.beginTransection(connection)
//   .then(getCode)
//   .then(saveProduct)
//   .then(product_pic_manage)
//   .then(product_recommend)
//   .then(product_set_cover)
//   .then((product_ids) => {
//     return new Promise((resolve, reject) => {
//       console.log('commit');
//       db.Commit(connection, (success) => {
//         console.log('commited !!');
//         res.json({
//           status: true,
//           data: success
//         });
//         resolve(success);
//       }, errors => reject(errors));
//       connection.end();
//     });
//   }).catch((errors) => {
//     console.log('Roll back error is', errors);
//     db.Rollback(connection, (roll) => {
//       res.json({
//         status: false,
//         error: errors
//       });
//     });
//     connection.end();
//   });
// });

// /**
//  * Edit product
//  * @param url /
//  * @param request
//  * @access public
//  * @return JSON
//  */
// productRouter.put('/', (req, res, next) => {
//   const connection = conn.init();
//   console.log('save product = ', req.body);
//   const product = req.body;

//   /**
//    * Save product
//    *
//    * @return product id and error
//    */
//   const saveProduct = function(){
//     return new Promise((resolve, reject) => {
//       const update = {
//         table: 'product',
//         query: {
//           product_name: product.name,
//           product_description: product.desc,
//           product_price: product.price,
//           product_cost: product.cost,
//           created_by: product.staffid,
//           category_id: product.category
//         },
//         where: { id: product.id }
//       };
//       const updateProduct = db.Update(connection, update,
//         results => resolve({connection: connection, product: product}),
//         error => reject(error)
//       );
//     });
//   };

//   db.beginTransection(connection)
//   .then(saveProduct)
//   .then(product_pic_manage)
//   .then(product_recommend)
//   .then(product_set_cover)
//   .then((product_ids) => {
//     return new Promise((resolve, reject) => {
//       console.log('commit');
//       db.Commit(connection, (success) => {
//         console.log('commited !!');
//         res.json({
//           status: true,
//           data: success
//         });
//         resolve(success);
//       }, errors => reject(errors));
//       connection.end();
//     });
//   }).catch((errors) => {
//     console.log('Roll back error is', errors);
//     db.Rollback(connection, (roll) => {
//       res.json({
//         status: false,
//         error: errors
//       });
//     });
//     connection.end();
//   });
// });


// /**
//  * Delete product
//  *
//  * @access publict
//  * @param product id
//  * @return JSON
//  */
// productRouter.post('/delete_product', (req, res, next) => {
//   const product = req.body;
//   const connection = conn.init();

//   /**
//    * Delete product
//    *
//    * @return void
//    */
//   const deleteProd = function(){
//     return new Promise((resolve, reject) => {
//       const updateDelete = {
//         table: 'product',
//         query: { status: 'N' },
//         where: { id: product.id }
//       };
//       const up = db.Update(connection, updateDelete, success => resolve(success), error => reject(error));
//     });
//   };


//   /**
//    * Blue bird start
//    *
//    * @return JSON
//    */
//   db.beginTransection(connection)
//   .then(deleteProd)
//   .then(function(){
//     return new Promise((resolve, reject) => {
//       console.log('commit');
//       db.Commit(connection, (success) => {
//         console.log('commited !!');
//         res.json({
//           status: true,
//           data: success
//         });
//         resolve(success);
//       }, errors => reject(errors));
//       connection.end();
//     });
//   }).catch((errors) => {
//     console.log('Roll back error is', errors);
//     db.Rollback(connection, (roll) => {
//       res.json({
//         status: false,
//         error: errors
//       });
//     });
//     connection.end();
//   });
// });


class ProductSaveStaff {
  public constructor(private db, private param) { }

  /**
   * Manage product picture
   *
   * @param product id
   * @return product id and error
   */
  public async product_pic_manage() {
    let checkUpdate: any = false;
    if (this.param.product.pic_id.length > 0) {
      const update = {
        table: 'product_pic',
        query: { status: 'N' },
        where: { product_id: this.param.product.id }
      };
      const nPic = await this.db.Update(update);
      checkUpdate = nPic;

      const updatePic = {
        table: 'product_pic',
        query: { product_id: this.param.product.id, status: 'Y' },
        where: ' id IN (' + (this.param.product.pic_id).toString() + ')'
      };
      const aPic = await this.db.Update(updatePic);
      checkUpdate = aPic;
    } else {
      const update = {
        table: 'product_pic',
        query: {
          status: 'N',
          cover: 'N'
        },
        where: { product_id: this.param.product.id }
      };
      const updatePicData = this.db.Update(update);
      checkUpdate = updatePicData;
    }

    return new Promise((resolve, reject) => {
      if (!checkUpdate) {
        reject('Can \'t Update product pic.');
      } else {
        resolve(this.param);
      }
    });
  }


  /**
   * Product reccommen
   * @param function connection
   * @param object product
   * @access public
   * @returns function connection
   * @returns object product
   */
  public product_recommend(param: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
      if (param.product.recommend === true) {
        const recommend_list = [];
        const recs = [];
        try {
          const query = {
            table: 'product',
            fields: ['id'],
            where: { recommend: 'Y' },
            order: ['rec_row']
          };
          const product_data = await this.db.SelectAll(query);

          if (product_data.length > 0) {
            product_data.forEach((value, index) => {
              recs.push(value);
            });
          }
          const checkId = recs.indexOf(param.product.id);
          product_data.forEach((value, index) => {
            if (index === 0 && product_data.length === 3 && checkId === (-1)) {
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
          await this.db.Update(updateNRecomment);

          recommend_list.forEach(async (value, index) => {
            const updateRecomment = {
              table: 'product',
              query: { recommend: 'Y', rec_row: index },
              where: { id: value }
            };
            await this.db.Update(updateRecomment);
          });
          resolve(param);
        } catch (error) {
          reject(error);
        }
      } else {
        const updateRecomment = {
          table: 'product',
          query: { recommend: 'N', rec_row: '0' },
          where: { id: param.product.id }
        };
        try {
          this.db.Update(updateRecomment);
          resolve(param);
        } catch (error) {
          reject(error);
        }
      }
    });
  }

  /**
   * Set cover pic
   *
   * @param {*} product_id
   * @return product_id and error
   */
  public async product_set_cover(): Promise<any> {
    console.log('set cover');
    let chack: any;
    if (this.param.product.coverId !== '0') {
      const updateNCover = {
        table: 'product_pic',
        query: { cover: 'N'},
        where: { product_id: this.param.product.id }
      };
      chack = await this.db.Update(updateNCover);

      const updateCover = {
        table: 'product_pic',
        query: { cover: 'Y' },
        where: { id: this.param.product.coverId }
      };
      chack = await this.db.Update(updateCover);
    } else {
      chack = true;
    }
    return new Promise((resolve, reject) => {
      if (chack) {
        resolve(this.param);
      } else {
        reject('Can\'t update cover pic.');
      }
    });
  }
}


export { productRouter };
