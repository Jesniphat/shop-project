import * as express from 'express';
import * as uuidv1 from 'uuid/v1';
import * as md5 from 'md5';

import { Permission } from '../library/permissions';
import { Config } from '../library/configs';
import { Databases } from '../library/databases';

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
    private _user: any = req.body;

    constructor(private _req, private _res) {
      this._user = this._req.body;
    }

    private _insertStaff = function(): Promise<any> {
      return new Promise((resolve, reject) => {
        const insertData = {
          table: 'user',
          query: {
            name: this._user.staffName,
            lastname: this._user.staffLastName,
            user: this._user.staffUserName,
            password: md5(this._staff.staffPassword),
            pic: this._user.staffPic,
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
    private _user: any = req.body;

    constructor (private _req, private _res) {
      this._user = this._req.body;
    }

    private _updataUser(): Promise<any> {
      return new Promise((resolve, reject) => {
        const updataUserdata = {
          table: 'user',
          query: {
            name: this._user.name,
            lastname: this._user.lastName,
            user: this._user.user,
            pic: this._user.pic
          },
          where: { id: this._user.id }
        };
        const update = this.db.Update(updataUserdata, success => resolve(success), error => reject(error));
      });
    }

    public async updateData() {
      try {
        await this.db.beginTransection();
        await this._updataUser();
        await this.db.Commit();
        await this.db.EndConnect();

        await this._res.json({
          status: true,
            data: {
              id: this._user.id,
              display_name: this._user.name,
              last_name: this._user.lastName,
              login_name: this._user.user,
              password: this._user.password,
              pic: this._user.pic
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
