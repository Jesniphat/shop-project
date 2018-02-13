// const express = require('express');
import * as express from 'express';
import * as uuidv1 from 'uuid/v1';
// import * as Promise from 'bluebird';
import { Config } from '../library/configs';
import { Permission } from '../library/permissions';
import { Databases } from '../library/databases.1';

const categoryRouter: express.Router = express.Router();
const permission = new Permission();

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
  class CategoryList {
    private db = new Databases();
    private category: any = req.body;

    public constructor() {

    }

    private _category_list(): Promise<any> {
      return new Promise((resolve, reject) => {
        const gets: any = {
          fields: '*, \'\' as product_qty ',
          table: 'category',
          where: {
            status: 'Y'
          }
        };

        try {
          const response = this.db.SelectAll(gets);
          resolve(response);
        } catch (error) {
          reject(error);
        }
      });
    }

    public async getCategoryList() {
      try {
        const result = await this._category_list();
        const end = await this.db.EndConnect();
        await res.json({
          status: true,
          data: result
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

  const getCategoryList = new CategoryList();
  getCategoryList.getCategoryList();

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
  class CategoryById {
    private db = new Databases();
    private category_id: any = req.params.id;
    private category: any = req.body;

    private _getcategorybyids(): Promise<any> {
      return new Promise((resolve, reject) => {
        const where: any = {id: this.category_id};
        const gets: any = {
          fields: ['*'],
          table:  'category',
          where:  where
        };

        try {
          const response_data = this.db.SelectRow(gets);
          resolve(response_data);
        } catch (error) {
          reject(error);
        }
      });
    }

    public async getCategoryById() {
      try {
        const result = await this._getcategorybyids();
        const end = await this.db.EndConnect();
        await res.json({
          status: true,
          data: result
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

  const getCategoryById = new CategoryById();
  getCategoryById.getCategoryById();
});


/**
 * Save category
 * @param url/ : string
 * @param requires: object
 * @access public
 * @returns data: JSON
 */
categoryRouter.post('/', (req: express.Request, res: express.Response, next: express.NextFunction) => {
  class SaveCategory {
    private db = new Databases();
    private category: any = req.body;

    private _savecetegory(): Promise<void> {
      return new Promise((resolve, reject) => {
          const data = {
          query: {
            cate_name: this.category.cateName,
            cate_description: this.category.cateDescription,
            status: this.category.selectedStatus,
            cover_pic: this.category.coverPic,
            created_by: permission.getID(req),
            updated_by: permission.getID(req),
            uuid: uuidv1()
          },
          table: 'category'
        };

        try {
          const save = this.db.Insert(data);
          resolve(save);
        } catch (error) {
          reject(error);
        }
      });
    }

    public async saveCategory() {
      try {
        const begin = await this.db.beginTransection();
        const result = await this._savecetegory();
        const commit = await this.db.Commit();
        const end = await this.db.EndConnect();
        await res.json({
          status: true,
          data: result
        });
      } catch (error) {
        const rollback = await this.db.Rollback();
        const end = await this.db.EndConnect();
        await res.json({
          status: false,
          error: error
        });
      }
    }
  }

  const saveCategory = new SaveCategory();
  saveCategory.saveCategory();
});


/**
 * Edit category
 * @argument /: string, requires: object
 * @access public
 * @returns data: JSON
 */
categoryRouter.put('/', (req: express.Request, res: express.Response, next: express.NextFunction) => {
  class UpdateCategory {
    private db = new Databases();
    private category: any = req.body;

    private _savecetegory(): Promise<any> {
      return new Promise((resolve, reject) => {
        const data = {
          query: {
            cate_name: this.category.cateName,
            cate_description: this.category.cateDescription,
            status: this.category.selectedStatus,
            cover_pic: this.category.coverPic
          },
          table: 'category',
          where: {
            id: this.category.cateId
          }
        };

        try {
          const update = this.db.Update(data);
          resolve(update);
        } catch (error) {
          reject(error);
        }
      });
    }


    public async updateCategory() {
      try {
        const begin = await this.db.beginTransection();
        const result = await this._savecetegory();
        const commit = await this.db.Commit();
        const end = await this.db.EndConnect();
        await res.json({
          status: true,
          data: result
        });
      } catch (error) {
        const rollback = await this.db.Rollback();
        const end = await this.db.EndConnect();
        await res.json({
          status: false,
          error: error
        });
      }
    }
  }

  const updateCategory = new UpdateCategory();
  updateCategory.updateCategory();
});

export { categoryRouter };
