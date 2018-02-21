import * as express from 'express';
import * as uuidv1 from 'uuid/v1';
import * as md5 from 'md5';

import { Permission } from '../library/permissions';
import { Config } from '../library/configs';
import { Databases } from '../library/databases.1';

const staffRouter: express.Router = express.Router();
const permission = new Permission();
staffRouter.use(function (req, res, next) {
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

staffRouter.post('/', (req, res, next) => {
  class SaveStaff {
    private db = new Databases();
    private _staff: any = req.body;

    constructor(private _req, private _res) {
      this._staff = this._req.body;
    }

    private _insertStaff = function(): Promise<any> {
      return new Promise((resolve, reject) => {
        const insertData = {
          table: 'staff',
          query: {
            name: this._staff.staffName,
            lastname: this._staff.staffLastName,
            user: this._staff.staffUserName,
            password: md5(this._staff.staffPassword),
            pic: this._staff.staffPic,
            uuid: uuidv1()
          }
        };
        const insertThings = this.db.Insert(insertData, success => resolve(success), error => reject(error));
      });
    };

    public async saveStaff() {
      try {
        await this.db.beginTransection();
        const data = this._insertStaff();
        await this.db.Commit();
        await this.db.EndConnect();

        await this._res.json({
          status: true,
          data: data
        });
      } catch (error) {
        await this.db.EndConnect();
        this._res.json({
          status: false,
          error: error
        });
      }
    }
  }

  const saveStaff = new SaveStaff(req, res);
  saveStaff.saveStaff();
});


staffRouter.put('/', (req, res, next) => {
  class UpdateStaff {
    private db = new Databases();
    private _staff: any = req.body;

    constructor (private _req, private _res) {
      this._staff = this._req.body;
    }

    private _updataStaff(): Promise<any> {
      return new Promise((resolve, reject) => {
        const updataStaffdata = {
          table: 'staff',
          query: {
            name: this._staff.name,
            lastname: this._staff.lastName,
            user: this._staff.user,
            pic: this._staff.pic
          },
          where: { id: this._staff.id }
        };
        const update = this.db.Update(updataStaffdata, success => resolve(success), error => reject(error));
      });
    }

    public async updateData() {
      try {
        await this.db.beginTransection();
        await this._updataStaff();
        await this.db.Commit();
        await this.db.EndConnect();

        await this._res.json({
          status: true,
            data: {
              id: this._staff.id,
              display_name: this._staff.name,
              last_name: this._staff.lastName,
              login_name: this._staff.user,
              password: this._staff.password,
              pic: this._staff.pic
            }
        });
      } catch ($e) {
        await this.db.EndConnect();
        await this._res.json({
          status: false,
          data: $e
        });
      }
    }
  }

  const updateStaff = new UpdateStaff(req, res);
  updateStaff.updateData();

});

export { staffRouter };
