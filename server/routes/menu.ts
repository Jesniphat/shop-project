import * as express from 'express';

import * as promise from 'bluebird';
import { Config } from '../library/configs';
import { Permission } from '../library/permissions';
import { Databases } from '../library/databases';

const menuRouter: express.Router = express.Router();
const permission: any = new Permission();

menuRouter.use((req, res, next) => {
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

menuRouter.post('/ping', (req, res, next) => {
  res.json({
      status: true,
      data: '1'
    });
});

menuRouter.post('/menulist', (req, res, next) => {
  class MenuList {
    private db = new Databases();
    private param = req.body;
    private $scope;

    constructor(private request, private response) {
      this.param = this.request.body;
    }

    /**
     * Get menu list
     * @access private
     * @return Promise
     */
    private _menu_list(): Promise<any> {
      return new promise((resolve, reject) => {
        const gets = {
          fields: ' * ',
          table: 'menu',
          where: {
            page: this.param.page
          }
        };
        this.db.SelectAll(gets, (data) => {
            this.$scope = data;
            resolve(data);
        }, (error) => {
            reject(error);
        });
      });
    }

    public async menuList() {
      try {
        await this._menu_list();
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

  const menu = new MenuList(req, res);
  menu.menuList();
});

export { menuRouter };
