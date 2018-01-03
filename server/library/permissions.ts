import * as promise from 'bluebird';
// import { Config } from './config'; // * as conn
import * as jwt from 'jwt-simple';

export class Permission {
  public secret     = 'xxx';
  public cookieName = 'user';
  // public token: any;

  constructor() {
    // console.log('start');
  }
///////////// read tokem method  ///////////////////////////////////////////////
  public readToken(req) {
    let token = req.cookies[this.cookieName];
    // console.log("Before decode : ", token);
    if (token === undefined) {
      token = {id: 0};
    }else {
      token = jwt.decode(token, this.secret, true, '');
    }
    // console.log("permission readToken = ", token);
    return token;
  }

///////////// write tokem method  //////////////////////////////////////////////
  public writeToken(res, id) {
    let token: any = {id: id};
    token = jwt.encode(token, this.secret, '', '');
    res.cookie(this.cookieName, token);
  }

///////////// clear tokem method  //////////////////////////////////////////////
  public clearToken(res) {
    this.writeToken(res, 0);
  }

///////////// islogin tokem method  ////////////////////////////////////////////
  public isLogin(req) {
    const token = this.readToken(req);
    // console.log("token is : ", token);
    if (token.id !== 0) {
      return true;
    }else {
      return false;
    }
  }

///////////// getid tokem method  //////////////////////////////////////////////
  public getID(req) {
    const token = this.readToken(req);
    return token.id;
  }
}
