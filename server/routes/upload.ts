import * as express from 'express';
import * as uuidv1 from 'uuid/v1';
import * as promise from 'bluebird';

import { Permission } from '../library/permissions';
import { Config } from '../library/configs';
import { Databases } from '../library/databases';

const uploadRouter: express.Router = express.Router();

const permission: any = new Permission();

import * as fs from 'fs';
import * as moment from 'moment';
import * as multer from 'multer';

const dir = './dist/server/tmp/';
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

const uploadFile = multer({ dest: './dist/server/tmp/' });

/* GET users listing. */
uploadRouter.post('/product', uploadFile.single('file'), function (req, res, next) {
  class PicProduct {
    private $scope: any = {};
    private db = new Databases();

    constructor(private request, private response) {}

    private _save_file(): Promise<any> {
      return new Promise((resolve, reject) => {
        const newName = moment().format('YYYY-MM-DD_hh-mm-ss') + '_' + req.file.originalname;

        const dirImg = './dist/public/images/product-img/';
        if (!fs.existsSync(dirImg)) {
          fs.mkdirSync(dirImg);
        }
        const filename = dirImg + newName;
        const src = fs.createReadStream(this.request.file.path);
        src.pipe(fs.createWriteStream(filename));
        src.on('end', () => {
          this.$scope.newName = newName;
          resolve('Save file success');
        });
        src.on('error', (err) => {
          reject(err);
        });
      });
    }


    private _insert_file_data(): Promise<any> {
      return new Promise((resolve, reject) => {
        const pic = this.request.file;
        const data = {
          table: 'product_pic',
          query: {
            productpic_name: this.$scope.newName,
            productpic_type: pic.mimetype,
            productpic_size: pic.size,
            productpic_path: 'public/images/product-img/' + this.$scope.newName,
            uuid: uuidv1()
          }
        };

      this. db.Insert(data, (results) => {
          this.$scope.pic_id = results.insert_id;
          resolve('Insert pic data success');
        }, (errors) => {
          console.log('error = ', errors);
          reject(errors);
        });
      });
    }

    private _get_pic(): Promise<any> {
      return new Promise((resolve, reject) => {
        const query = {
          table: 'product_pic',
          where: {
            id: this.$scope.pic_id
          }
        };
        this.db.SelectRow(query, (results) => {
          this.$scope = {};
          this.$scope = results;
          resolve('Can get data');
        }, (errors) => {
          console.log('Can\'t get data = ', errors);
          reject(errors);
        });
      });
    }

    public async saveProductPic() {
      try {
        await this._save_file();
        await this._insert_file_data();
        await this._get_pic();
        await this.db.EndConnect();

        await this.response.json({
          status: true,
          data: this.$scope
        });
      } catch (error) {
        await this.db.EndConnect();
        await this.response.json({
          status: false,
          error: error
        });
      }
    }
  }

  const updatePic = new PicProduct(req, res);
  updatePic.saveProductPic();
});


uploadRouter.post('/category', uploadFile.single('file'), function (req, res, next) {
  class PicCategory {
    private $scope: any = {};
    private db = new Databases(); private _newName: any;

    constructor(private request, private response) {}

    private _save_file(): Promise<any> {
      return new Promise ((resolve, reject) => {
        this._newName = moment().format('YYYY-MM-DD_hh-mm-ss') + '_' + this.request.file.originalname;
        const dirImg = './dist/public/images/category-img/';
        if (!fs.existsSync(dirImg)) {
          fs.mkdirSync(dirImg);
        }
        const filename = dirImg + this._newName;
        const src = fs.createReadStream(this.request.file.path);
        src.pipe(fs.createWriteStream(filename));
        src.on('end', () => {
          this.$scope.newName = this._newName;
          resolve('Save file success');
        });
        src.on('error', (err) => {
          reject(err);
        });
      });
    }

    public async saveCatePic() {
      try {
        await this._save_file();
        await this.db.EndConnect();
        await this.response.json({
          status: true,
          data: {
            pic_name: this.$scope.newName,
            pic_path: 'public/images/category-img/'  + this.$scope.newName
          }
        });
      } catch (error) {
        await this.db.EndConnect();
        await this.response.json({
          status: false,
          error: error
        });
      }
    }
  }

  const picCategory = new PicCategory(req, res);
  picCategory.saveCatePic();
});


uploadRouter.post('/staff', uploadFile.single('file'), function (req, res, next) {
  class StaffPic {
    private $scope: any = {};
    private db = new Databases();

    constructor(private request, private response) {}

    private _save_file(): Promise<any> {
      return new Promise((resolve, reject) => {
        const newName = moment().format('YYYY-MM-DD_hh-mm-ss') + '_' + this.request.file.originalname;
        const dirImg = './dist/public/images/staff-img/';
        if (!fs.existsSync(dirImg)) {
          fs.mkdirSync(dirImg);
        }
        const filename = dirImg + newName;
        const src = fs.createReadStream(this.request.file.path);
        src.pipe(fs.createWriteStream(filename));
        src.on('end', () => {
          this.$scope.newName = newName;
          resolve('Save file success');
        });
        src.on('error', (err) => {
          reject(err);
        });
      });
    }

    public async picStaff() {
      try {
        await this._save_file();
        await this.db.EndConnect();
        await this.response.json({
          status: true,
          data: {
            pic_name: this.$scope.newName,
            pic_path: 'public/images/staff-img/'  + this.$scope.newName
          }
        });
      } catch (error) {
        await this.db.EndConnect();
        this.response.json({
          status: false,
          error: error
        });
      }
    }
  }

  const picStaff = new StaffPic(req, res);
  picStaff.picStaff();
});

export { uploadRouter };
