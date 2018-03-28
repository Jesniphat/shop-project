// const express = require('express');
import * as express from 'express';
import * as uuidv1 from 'uuid/v1';
// import * as Promise from 'bluebird';
import { Config } from '../library/configs';
import { Permission } from '../library/permissions';
import { Databases } from '../library/databases';

const categoryRouter: express.Router = express.Router();
const permission = new Permission();

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
    private category: any;

    public constructor(private request, private response) {
      this.category = this.request.body;
    }

    private _getsCategoryList(): Promise<any> {
      const gets: any = {
        fields: '*, \'\' as product_qty ',
        table: 'category',
        where: {
          status: 'Y'
        }
      };
      return new Promise((resolve, reject) => {
        this.db.SelectAll(gets, results => resolve(results), error => reject(error));
      });
    }

    public async getCategoryList() {
      try {
        // const result = await this._category_list();
        const result = await this._getsCategoryList();
        const end = await this.db.EndConnect();
        await this.response.json({
          status: true,
          data: result
        });
      } catch (error) {
        const end = await this.db.EndConnect();
        await this.response.status(400).json({
          status: false,
          error: error
        });
      }
    }

  }

  const getCategoryList = new CategoryList(req, res);
  getCategoryList.getCategoryList();

});


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
    private category_id: any;
    private category: any;

    constructor(private request, private response) {
      this.category_id = this.request.params.id;
      this.category = this.request.body;
    }

    private _getcategorybyids(): Promise<any> {
      const where: any = {id: this.category_id};
      const gets: any = {
        fields: ['*'],
        table:  'category',
        where:  where
      };
      return new Promise((resolve, reject) => {
        this.db.SelectRow(gets, results => resolve(results), error => reject(error));
      });
    }

    public async getCategoryById() {
      try {
        const result = await this._getcategorybyids();
        const end = await this.db.EndConnect();
        await this.response.json({
          status: true,
          data: result
        });
      } catch (error) {
        const end = await this.db.EndConnect();
        await this.response.status(400).json({
          status: false,
          error: error
        });
      }
    }

  }

  const getCategoryById = new CategoryById(req, res);
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
  if (!permission.canCreate(req, res)) {
    return;
  }
  class SaveCategory {
    private db = new Databases();
    private category: any;

    constructor(private request, private response) {
      this.category = this.request.body;
    }

    private _saveCategoryData(): Promise<any> {
      const data = {
        query: {
          cate_name: this.category.cateName,
          cate_description: this.category.cateDescription,
          status: this.category.selectedStatus,
          cover_pic: this.category.coverPic,
          created_by: permission.getID(this.request),
          updated_by: permission.getID(this.request),
          uuid: uuidv1()
        },
        table: 'category'
      };
      return new Promise((resolve, reject) => {
        this.db.Insert(data, result => resolve(result), error => reject(error));
      });
    }

    public async saveCategory() {
      try {
        const begin = await this.db.beginTransection();
        const result = await this._saveCategoryData();
        const commit = await this.db.Commit();
        const end = await this.db.EndConnect();
        await this.response.json({
          status: true,
          data: result
        });
      } catch (error) {
        const rollback = await this.db.Rollback();
        const end = await this.db.EndConnect();
        await this.response.status(400).json({
          status: false,
          error: error
        });
      }
    }
  }

  const saveCategory = new SaveCategory(req, res);
  saveCategory.saveCategory();
});


/**
 * Edit category
 * @argument /: string, requires: object
 * @access public
 * @returns data: JSON
 */
categoryRouter.put('/', (req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (!permission.canEdit(req, res)) {
    return;
  }
  class UpdateCategory {
    private db = new Databases();
    private category: any = req.body;

    constructor(private request, private response) {
      this.category = request.body;
    }

    private _savecetegory(): Promise<any> {
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
      return new Promise((resolve, reject) => {
        this.db.Update(data, result => resolve(result), error => reject(error));
      });
    }


    public async updateCategory() {
      try {
        const begin = await this.db.beginTransection();
        const result = await this._savecetegory();
        const commit = await this.db.Commit();
        const end = await this.db.EndConnect();
        await this.response.json({
          status: true,
          data: result
        });
      } catch (error) {
        const rollback = await this.db.Rollback();
        const end = await this.db.EndConnect();
        await this.response.status(400).json({
          status: false,
          error: error
        });
      }
    }
  }

  const updateCategory = new UpdateCategory(req, res);
  updateCategory.updateCategory();
});

/**
 * Delete category
 */
 categoryRouter.delete('/:id', (req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (!permission.canDelete(req, res)) {
    return;
  }

  class DeleteCAtegory {
    private db = new Databases();
    private category: any = req.body;
    private category_id: any;

    constructor(private request, private response) {
      this.category_id = this.request.params.id;
      this.category = request.body;
    }

  /**
   * Delete category by id from data base
   * @access private
   */
    private _deletecetegory(): Promise<any> {
      const data = {
        query: {
          status: 'N',
        },
        table: 'category',
        where: {
          id: this.category_id
        }
      };
      return new Promise((resolve, reject) => {
        this.db.Update(data, result => resolve(result), error => reject(error));
      });
    }

   /**
    * Delete category steping
    * @access public
    */
    public async deleteCategory() {
      try {
        const begin = await this.db.beginTransection();
        const result = await this._deletecetegory();
        const commit = await this.db.Commit();
        const end = await this.db.EndConnect();
        await this.response.status(200).json({
          status: true,
          data: result
        });
      } catch (error) {
        const rollback = await this.db.Rollback();
        const end = await this.db.EndConnect();
        await this.response.status(400).json({
          status: false,
          error: error
        });
      }
    }
  }

  const deleteCategory = new DeleteCAtegory(req, res);
  deleteCategory.deleteCategory();
 });


export { categoryRouter };
