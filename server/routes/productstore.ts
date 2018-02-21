import * as express from 'express';
import * as uuidv1 from 'uuid/v1';

import { Permission } from '../library/permissions';
import { Config } from '../library/configs';
import { Gencode } from '../library/gencodes';
import { Databases } from '../library/databases.1';

const productStoreRouter: express.Router = express.Router();

const permission = new Permission();

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
  class MaxData {
    private db = new Databases();

    constructor(private _req, private _res, private _next) {}

    /**
     * Get product max id
     * @access private
     * @return Promise
     */
    private getProductMaxId(): Promise<any> {
      return new Promise((resolve, reject) => {
        const get = {
          fields: [
            'MAX(DATE_FORMAT(updated_date, \'%Y-%m-%d %H:%i:%s\')) AS max'
          ],
          table: 'product',
          where: 'status = \'Y\''
        };

        this.db.SelectAll(get, (data) => {
          resolve(data);
        }, (error) => {
          reject('error');
        });
      });
    }

    /**
     * Get get data to client
     * @access public
     * @return Primise
     */
    public async getData() {
      try {
        const data = await this.getProductMaxId();
        await this.db.EndConnect();
        await this._res.json({
          status: true,
          data: data[0].max
        });
      } catch (error) {
        await this.db.EndConnect();
        await this._res.json({
          status: false,
          error: error
        });
      }
    }
  }

  const max = new MaxData(req, res, next);
  max.getData();
});



/**
 * Get producname for autocomplete max producr
 *
 * @access function
 * @param max_id
 * @return JSON
 */
productStoreRouter.get('/max_update/:date', (req, res, next) => {
  class MaxUpdate {
    private db = new Databases();
    private _max_update: any;

    constructor(private _req, private _res) {
      this._max_update = this._req.params.data;
    }

    /**
     * Get data function
     *
     * @access public
     * @return promist
     */
    private _getProductName(): Promise<any> {
      return new Promise((resolve, reject) => {
        const get = {
          fields: [
            'id, code, product_name as name, product_description, DATE_FORMAT(updated_date, \'%Y-%m-%d %H:%i:%s\') as updated_date'
          ],
          table: 'product',
          where: 'status = \'Y\' and updated_date > ' + 'date_format(\'' + this._max_update + '\', \'%Y-%m-%d %H:%i:%s\')',
          order: ['updated_date']
        };

        this.db.SelectAll(get, (data) => {
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
    }

    public async getProduct() {
      try {
        const data = await this._getProductName();
        await this.db.EndConnect();
        await this._res.json({
          status: true,
          data: data
        });
      } catch (error) {
        await this.db.EndConnect();
        await this._res.json({
          status: false,
          error: error
        });
      }
    }
  }

  const maxUpdate = new MaxUpdate(req, res);
  maxUpdate.getProduct();
});


/**
 * Get producname for autocomplete
 *
 * @access function
 * @param max_id
 * @return JSON
 */
productStoreRouter.get('/getAllProductStore/:max_date', (req, res, next) => {
  class GetAllProductStore {
    private db = new Databases();
    private _max_update: any;

    constructor(private _req, private _res) {
      this._max_update = this._req.params.max_data;
    }

    /**
     * Get data function
     *
     * @access private
     * @return promist
     */
    private _getProductName(): Promise<any> {
      return new Promise((resolve, reject) => {
        const get = {
          fields: [
            'id, code, product_name as name, product_description, DATE_FORMAT(updated_date, \'%Y-%m-%d %H:%i:%s\') as updated_date'
          ],
          table: 'product',
          where: 'status = \'Y\' and updated_date > ' + 'date_format(\'' + this._max_update + '\', \'%Y-%m-%d %H:%i:%s\')',
          order: ['updated_date']
        };
        // console.log(get);
        this.db.SelectAll(get, (data) => {
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
    }

    public async getData() {
      try {
        const data = await this._getProductName();
        await this.db.EndConnect();
        await this._res.json({
          status: true,
          data: data
        });
      } catch (error) {
        await this.db.EndConnect();
        await this._res.json({
          status: false,
          error: error
        });
      }
    }
  }

  const getAllProductStore = new GetAllProductStore(req, res);
  getAllProductStore.getData();
});

/**
 * Get product by id
 *
 * @access public
 * @param callbackfucnt(@pruduct id)
 * @return JSON
 */
productStoreRouter.get('/:id', (req, res, next) => {
  class GetProduct {
    private db: any = new Databases();
    private _product_id: any;
    private _product: any;
    private _product_data: any = {};

    constructor(private _req, private _res) {
      this._product_id = this._req.params.id;
      this._product = this._req.body;
    }

    private _get_product(): Promise<any> {
      return new Promise((resolve, reject) => {
        const get = {
          table: 'product',
          where: {
            id: this._product_id
          }
        };
        this.db.SelectRow(get, (data) => {
          this._product_data = data;
          resolve(data.id);
        }, (error) => {
          console.log(error);
          reject('error');
        });
      });
    }

    private _get_product_pic(): Promise<any> {
      // console.log('$data = ', $data);
      return new Promise((resolve, reject) => {
        const gets = {
          table: 'product_pic',
          where: {
            product_id: this._product_id,
            status: 'Y'
          }
        };

        this.db.SelectAll(gets, (data) => {
          this._product_data.pic = data;
          resolve('success');
        }, (error) => {
          if (error === 'nodata') {
            resolve('success');
          } else {
            reject(error);
          }
        });
      });
    }

    public async getData() {
      try {
        await this._get_product();
        await this._get_product_pic();
        await this.db.EndConnect();

        await this._res.json({
          status: true,
          data: this._product_data
        });
      } catch (error) {
        await this.db.EndConnect();

        await this._res.json({
          status: false,
          error: error
        });
      }
    }
  }

  const getProduct = new GetProduct(req, res);
  getProduct.getData();
});


/**
 * Save stock in
 */
productStoreRouter.post('/saveStockIn', (req, res, next) => {
  class SavestockIn {
    private db = new Databases();
    private _stock: any;

    constructor(private _req, private _res) {
      this._stock = this._req.body;
    }

    /** Save stock */
    private _saveStock(): Promise<any> {
      return new Promise((resolve, reject) => {
        const insert = {
          table: 'lot_in',
          query: {
            product_id: this._stock.product_id,
            // product_code: stock.product_code,
            lot_in: this._stock.product_qty,
            uuid: uuidv1()
          }
        };
        const insertStock = this.db.Insert(insert,
          results => resolve(results.insert_id),
          errors => reject(errors));
      });
    }

    public async saveData() {
      try {
        await this.db.beginTransection();
        const stock_id = await this._saveStock();
        await this.db.Commit();
        await this.db.EndConnect();

        await this._res.json({
          status: true,
          data: 'Update success'
        });
      } catch ($e) {
        await this.db.Rollback();
        this._res.json({
          status: false,
          error: $e
        });
      }
    }
  }

  const saveStockIn = new SavestockIn(req, res);
  saveStockIn.saveData();
});




productStoreRouter.get('/getStockList/:id', (req, res, next) => {
  class GetStockList {
    private db = new Databases();
    private _stock: any = req.body;
    private _productId = req.params.id;

    constructor(private _req, private _res) {
      this._stock = this._req.body;
      this._productId = this._req.params.id;
    }

    /** Get data of stock */
    private _getStockById = function(){
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
          where: {'p.status': 'Y', 's.product_id': this._productId}
        };
        this.db.SelectAll(get, (data) => {
          resolve(data);
        }, (error) => {
          console.log(error);
          reject('error');
        });
      });
    };

    public async getData() {
      try {
        const data = await this._getStockById();
        await this.db.EndConnect();

        await this._res.json({
          status: true,
          data: data
        });
      } catch ($e) {
        await this.db.EndConnect();

        await this._res.json({
          status: false,
          error: $e
        });
      }
    }
  }

  const getStockList = new GetStockList(req, res);
  getStockList.getData();

});

export { productStoreRouter };
