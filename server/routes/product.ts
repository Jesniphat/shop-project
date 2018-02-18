import * as express from 'express';
// import * as Promise from 'bluebird';
import * as uuidv1 from 'uuid/v1';

import { Permission } from '../library/permissions';
import { Config } from '../library/configs';
import { Gencode } from '../library/gencodes';
import { Databases } from '../library/databases.1';

const productRouter: express.Router = express.Router();

const permission = new Permission();
// const gencode = new Gencode();

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
    private product: any;
    private filter: any;
    private $scope = {
      row: 1,
      data: ''
    };

    constructor(private request, private response) {
      this.product = this.request.body;
      this.filter = this.request.query;
    }

    /** Text for where product name by filter text */
    private _filterName() {
      let filtername = '';
      if (this.filter.filtertext !== '') {
        filtername = ' and product_name like \'%' + this.filter.filtertext + '%\'';
      }
      return filtername;
    }

    /** Page start number */
    private _pageStart() {
      const page_start = (this.filter.limit * this.filter.page) - this.filter.limit;
      return page_start;
    }

    /** All product row */
    private _productCount(): Promise<any> {
      const productCount = {
        fields: 'count(id) as row ',
        table: 'product',
        where: 'status = \'Y\'' + this._filterName()
      };
      return new Promise((resolve, reject) => {
        this.db.SelectRow(productCount, (result) => {
          if (result.row <= this.filter.limit) {
            this.$scope.row = 1;
          } else if ((result.row % this.filter.limit) === 0) {
            this.$scope.row = (result.row / this.filter.limit) ;
          } else {
            this.$scope.row = Math.ceil((result.row / this.filter.limit));
          }
          resolve(this.$scope.row);
        }, (error) => {
          reject(error);
        });
      });
    }

    /** get product lists */
    private _productList(): Promise<any> {
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
      return new Promise((resolve, reject) => {
        this.db.SelectAll(productList, (results) => {
          this.$scope.data = results;
          resolve(this.$scope.data);
        }, (error) => {
          reject(error);
        });
      });
    }

    /** function for ger all data */
    public async getProductAll() {
      try {
        const count = await this._productCount();
        const list = await this._productList();
        const end = await this.db.EndConnect();

        await this.response.json({
          status: true,
          data: this.$scope
        });
      } catch (error) {
        const end = await this.db.EndConnect();
        await this.response.json({
          status: false,
          error: error
        });
      }
    }
  }

  const getProductAll = new GetProductAll(req, res);
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
        this.db.SelectAll(gets, (results) => {
          resolve(results);
        }, (error) => {
          reject(error);
        });
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


/**
 * Get product by id
 *
 * @access public
 * @param callbackfucnt(@pruduct id)
 * @return JSON
 */
productRouter.get('/:id', (req, res, next) => {
  class GetProductById {
    private db = new Databases();
    private product_id: number;
    private product: any;
    private product_data: any = {};

    constructor(private request, private response) {
      this.product_id = this.request.params.id;
      this.product = this.request.body;
    }

    private _get_product(): Promise<any> {
      const get = {
        table: 'product',
        where: {
          id: this.product_id
        }
      };
      return new Promise((resolve, reject) => {
        this.db.SelectRow(get, result => resolve(result), error => reject(error));
      });
    }

    private _get_product_pic(): Promise<any> {
      const gets = {
        table: 'product_pic',
        where: {
          product_id: this.product_id,
          status: 'Y'
        }
      };
      return new Promise((resolve, reject) => {
        this.db.SelectAll(gets, results => resolve(results), error => reject(error));
      });
    }

    public async getProductById() {
      try {
        this.product_data = await this._get_product();
        this.product_data.pic = await this._get_product_pic();

        await this.db.EndConnect();
        await this.response.json({
          status: true,
          data: this.product_data
        });
      } catch ($e) {
        await this.db.EndConnect();
        await this.response.json({
          status: false,
          error: $e
        });
      }
    }
  }

  const getProductById = new GetProductById(req, res);
  getProductById.getProductById();
});


/**
 * Save product
 * @access public
 * @param {product object}
 * @return JSON
 */
productRouter.post('/', (req, res, next) => {
  class SaveProduct {
    private db = new Databases();
    private gencode = new Gencode(this.db);
    private productStaff = new ProductSaveStaff(this.db);
    private _product: any;
    private _product_id: any = '';
    private _product_code: any = '';

    constructor(private request, private response) {
      this._product = request.body;
    }

    /**
     * Gencode
     * @access private
     * @returns mixed
     */
    private _getCode(): Promise<any> {
      return new Promise((resolve, reject) => {
        this.gencode.Code('product', 'code', 'P', 5, 1,
          maxcode => resolve(maxcode), error => reject(error)
        );
      });
    }

    /**
     * Save product
     * @access private
     * @return product
     */
    private _saveProduct(): Promise<any> {
      return new Promise((resolve, reject) => {
        const insert = {
          table: 'product',
          query: {
            code: this._product_code,
            product_name: this._product.name,
            product_description: this._product.desc,
            product_price: this._product.price,
            product_cost: this._product.cost,
            created_by: this._product.staffid,
            category_id: this._product.category,
            uuid: uuidv1()
          }
        };
        const insertProduct = this.db.Insert(insert,
          (results) => {
            this._product.id = results.insert_id;
            resolve(this._product);
          },
          (errors) => {
            reject(errors);
          }
        );
      });
    }

    /**
     * Shere method save data
     * @access public
     * @returns express
     */
    public async saveProduct() {
      try {
        await this.db.beginTransection();
        this._product_code = await this._getCode();

        await this._saveProduct();
        await this.productStaff.product_pic_manage(this._product);
        await this.productStaff.product_recommend(this._product);
        await this.productStaff.product_set_cover(this._product);
        await this.db.Commit();
        await this.db.EndConnect();
        await this.response.json({
          status: true,
          data: this._product.id
        });
      } catch (error) {
        await this.db.Rollback();
        await this.db.EndConnect();
        await this.response.json({
          status: false,
          error: error
        });
      }
    }
  }
  const saveProduct = new SaveProduct(req, res);
  saveProduct.saveProduct();
});

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
  public constructor(private db) { }

  /**
   * Manage product picture
   *
   * @param product id
   * @return product id and error
   */
  public product_pic_manage(product: any): Promise<any> {
    return new Promise((resolve, reject) => {
      /** If have product pic list */
      if ((product.pic_id).length > 0) {
        const update = {
          table: 'product_pic',
          query: { status: 'N' },
          where: { product_id: product.id }
        };
        /** Updata all pic to N first by uses product id */
        const nPic = this.db.Update(update, success => {
          const updatePic = {
            table: 'product_pic',
            query: { product_id: product.id, status: 'Y' },
            where: ' id IN (' + (product.pic_id).toString() + ')'
          };
          /** Update pic status to Y  by pic_id list */
          const aPic = this.db.Update(updatePic, succes => resolve(product), errors => reject(errors));
        }, errors => reject(errors));
      } else {
        /** mean don't have pic or pic has remove */
        const update = {
          table: 'product_pic',
          query: {
            status: 'N',
            cover: 'N'
          },
          where: { product_id: product.id }
        };
        /** Updata all old pic to N by product id */
        const updatePicData = this.db.Update(update, success => resolve(product), errors => reject(errors));
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
  public product_recommend(product: any): Promise<any> {
    return new Promise((resolve, reject) => {
      /** Check this product is recomment ro not */
      if (product.recommend === true) {
        const query = {
          table: 'product',
          fields: ['id'],
          where: { recommend: 'Y' },
          order: ['rec_row']
        };
        /** Get all id from all product recomment */
        this.db.SelectAll(query, (success) => {
          const recommend_list = [];
          const recs = [];
          success.forEach((value, index) => {
            recs.push(value);
          });

          /**
           * Check if product id is not in list mean it is new recomment.
           * Cut first id from old list out then push new id in last of list.
           **/
          const checkId = recs.indexOf(product.id);
          success.forEach((value, index) => {
            if (index === 0 && success.length === 3 && checkId === (-1)) {
              return;
            }
            recommend_list.push(value.id);
          });
          recommend_list.push(product.id);
          const updateNRecomment = {
            table: 'product',
            query: { recommend: 'N' },
            where: { recommend: 'Y' }
          };
          /** First up data all recomment to N */
          this.db.Update(updateNRecomment, (succes) => {
            recommend_list.forEach((value, index) => {
              const updateRecomment = {
                table: 'product',
                query: { recommend: 'Y', rec_row: index },
                where: { id: value }
              };
              /** Updata New recomment by product id list */
              this.db.Update(updateRecomment, successs => resolve(product), er => reject(er));
            });
          }, err => reject(err));
        }, errers => reject(errers));
      } else {
        /** This product has remove from recomment than chang recomment to N */
        const updateRecomment = {
          table: 'product',
          query: { recommend: 'N', rec_row: '0' },
          where: { id: product.id }
        };
        this.db.Update(updateRecomment, success => resolve(product), errors => reject(errors));
      }
    });
  }

  /**
   * Set cover pic
   *
   * @param {*} product_id
   * @return product_id and error
   */
  public product_set_cover(product: any): Promise<any> {
    console.log('set cover');
    return new Promise((resolve, reject) => {
      if (product.coverId !== '0') {
        const updateNCover = {
          table: 'product_pic',
          query: { cover: 'N'},
          where: { product_id: product.id }
        };
        /** Update all pic set all cover to N first */
        this.db.Update(updateNCover, (success) => {
          const updateCover = {
            table: 'product_pic',
            query: { cover: 'Y' },
            where: { id: product.coverId }
          };
          /** Updata this pic to by new cover by change cover to Y where by pic id */
          this.db.Update(updateCover, succes => resolve(product), error => reject(error));
        }, errors => reject(errors));
      } else {
        resolve(product);
      }
    });
  }
}

export { productRouter };
