import * as express from 'express';
import { Permission } from '../library/permissions';

const usersRouter: express.Router = express.Router();

/* GET users listing. */
usersRouter.get('/', function(req, res, next) {
  class GetUser extends Permission {
    public loginId: any = 0;
    public data: any;

    constructor (private request, private response) {
      super();
    }

    private _getUserData(): Promise<any> {
      return new Promise((resolve, reject) => {
        if (super.isLogin) {
          this.loginId = super.getID(this.request);
          resolve(this.loginId);
        } else {
          reject(false);
        }
      });
    }

    public async getUserDate() {
      let check: any = false;

      try {
        check = await this._getUserData();
        await this.response.json({
          status: true,
          data: {
            status: check,
            date: []
          }
        });
      } catch ($e) {
        await this.response.json({
          status: false,
          error: $e
        });
      }
    }
  }

  const getUser = new GetUser(req, res);
  getUser.getUserDate();
});

export { usersRouter };
