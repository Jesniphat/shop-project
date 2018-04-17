import * as express from 'express';
import * as uuidv1 from 'uuid/v1';

import { Permission } from '../library/permissions';
import { Config } from '../library/configs';
import { Gencode } from '../library/gencodes';
import { Databases } from '../library/databases';
import * as jwt from 'jwt-simple';

const orderRouter: express.Router = express.Router();

const permission = new Permission();

class Cart {
  private _secret = '_cartDatas';
  private _cookieName = '_cart';

  constructor(private _req: any, private _res) {
  }

  public writeCartList(cartList): Promise<any> {
    return new Promise((resolve, reject) => {
      const token = jwt.encode(cartList, this._secret, '', '');
      if (this._res.cookie(this._cookieName, token)) {
        resolve(true);
      } else {
        reject('can not set cart');
      }
    });
  }

  public cartList(): Promise<any> {
    return new Promise((resolve, reject) => {
      let token = this._req.cookies[this._cookieName];
      if (token === undefined) {
        token = [];
        resolve(token);
      } else {
        token = jwt.decode(token, this._secret, true, '');
        resolve(token);
      }
    });
  }
}

orderRouter.post('/addcart', (req, res, next) => {
  class AddTocart {
    public cartList: any[] = [];
    private _product: any;
    private _cart: any;

    constructor(private _req: any, private _res) {
      this._product = _req.body;
      this._cart = new Cart(_req, _res);
    }

    private _calCart(cartList: any): Promise<any> {
      let isCart = false;
      return new Promise((resolve, reject) => {
        if (cartList.length > 0) {
          for (let i = 0; i < cartList.length; i++) {
            if (cartList[i].id === this._product.id) {
              isCart = true;
              cartList[i].price += this._product.price;
              cartList[i].qty += 1;
            }
          }
          this.cartList = cartList;
        }

        if (!isCart) {
          this._product.qty = 1;
          this.cartList.push(this._product);
        }

        resolve(this.cartList);
      });
    }

    public async addCart() {
      try {
        this.cartList = await this._cart.cartList();
        this.cartList = await this._calCart(this.cartList);
        await this._cart.writeCartList(this.cartList);
        await this._res.json({
          status: true,
          data: {
            cart: this.cartList
          }
        });
      } catch ($e) {
        await this._res.json({
          status: false,
          error: $e
        });
      }
    }
  }

  const addTocart = new AddTocart(req, res);
  addTocart.addCart();
});

orderRouter.get('/cart', (req, res, next) => {
  class GetClassList {
    public cartList: any;
    private _cart: any;

    constructor(private _req: any, private _res: any) {
      this._cart = new Cart(_req, _res);
    }

    public async getCart() {
      try {
        this.cartList = await this._cart.cartList();
        await this._res.json({
          status: true,
          data: {
            cart: this.cartList
          }
        });
      } catch ($e) {
        await this._res.json({
          status: false,
          error: $e
        });
      }
    }
  }

  const getCartList = new GetClassList(req, res);
  getCartList.getCart();
});

export { orderRouter };
