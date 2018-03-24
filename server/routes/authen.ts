import * as express from 'express';
import * as md5 from 'md5';
import { Permission } from '../library/permissions';
import { Databases } from '../library/databases';

const authenRouter: express.Router = express.Router();
const permission: any = new Permission();

authenRouter.get('/', function(req, res, next){
  class CheckLogin {
    private _isLogin: any;

    constructor (private request, private response) {
      this._isLogin = permission.isLogin(this.request);
    }

    public responseData() {
      this.response.json({
        status: true,
        data: this._isLogin
      });
    }
  }

  const checkLogin = new CheckLogin(req, res);
  checkLogin.responseData();
});

authenRouter.get('/access', function(req, res, next){
  class GetAccess {
    private _accesee: any;

    constructor (private request, private response) {
      this._accesee = permission.getAccess(this.request);
    }

    public responseData() {
      this.response.json({
        status: true,
        data: this._accesee
      });
    }
  }

  const getAccess = new GetAccess(req, res);
  getAccess.responseData();
});

authenRouter.post('/checklogin', function(req, res, next){
  class CheckLogin {
    private _isLogin: any;

    constructor (private request, private response) {
      this._isLogin = permission.isLogin(this.request);
    }

    public responseData() {
      this.response.json({
        status: true,
        data: this._isLogin
      });
    }
  }

  const checkLogin = new CheckLogin(req, res);
  checkLogin.responseData();
});

authenRouter.post('/clearlogin', function(req, res, next) {
  class ClearLogin {
    constructor (private request, private response) {
      permission.clearToken(this.response);
    }

    public responseData() {
      this.response.json({
        status: true,
        data: 'set0'
      });
    }
  }

  const clearLogin = new ClearLogin(req, res);
  clearLogin.responseData();
});

authenRouter.post('/login', function(req, res, next) {
  class Login {
    private db = new Databases();
    private _login: any;
    private $scope;

    constructor(private request, private response) {
      this._login = request.body;
    }

    private _login_data() {
      return new Promise((resolve, reject) => {
        const where = {
          user: this._login.user,
          password: md5(this._login.password)
        };
        const gets = {
          fields: '*',
          table:  'staff',
          where:  where
        };
        this.db.SelectRow(gets,
        (data) => {
          if (data.id === undefined) {
            reject('Can\'t login');
          }

          const id = data.id;
          if (id !== 0 || id !== '0') {
            permission.writeToken(res, id, data.can_create, data.can_edit, data.can_delete);
            this.$scope = data;
            resolve(data);
          } else {
            reject('Can\'t login');
          }
        }, (error) => {
          console.log('Error is ', error);
          reject(error);
        });
      });
    }

    public async login_data() {
      try {
        await this._login_data();
        await this.db.EndConnect();
        await this.response.json({
          status: true,
          data: {
            id: this.$scope.id,
            display_name: this.$scope.name,
            last_name: this.$scope.lastname,
            login_name: this.$scope.user,
            password: this.$scope.password,
            type: this.$scope.type,
            pic: this.$scope.pic
          }
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

  const login = new Login(req, res);
  login.login_data();
});

export { authenRouter} ;
