import * as promise from 'bluebird';
import * as jwt from 'jwt-simple';

export class Permission {
  public secret     = 'xxx';
  public cookieName = '_ucsj';

  constructor() { }
/**
 * Read token
 * @param req
 * @access public
 * @return json token
 */
  public readToken(req) {
    let token = req.cookies[this.cookieName];
    if (token === undefined) {
      token = {id: 0, create: 0, edit: 0, delete: 0};
    }else {
      token = jwt.decode(token, this.secret, true, '');
    }
    return token;
  }

/**
 * Write token to cookie
 * @param res
 * @param id
 * @access public
 * @return resposnt cookie
 */
  public writeToken(res, id, canCreate, canEdit, canDelete) {
    let token: any = {
      id: id,
      create: canCreate,
      edit: canEdit,
      delete: canDelete
    };

    token = jwt.encode(token, this.secret, '', '');
    res.cookie(this.cookieName, token);
  }

/**
 * Clear token when logout
 * @param res
 * @access public
 */
  public clearToken(res) {
    this.writeToken(res, 0, 0, 0, 0);
  }

/**
 * Check login
 * @param req
 * @access public
 * @return boolean
 */
  public isLogin(req): boolean {
    const token = this.readToken(req);
    if (token.id !== 0) {
      return true;
    }else {
      return false;
    }
  }

/**
 * Get id
 * @param req
 * @access public
 * @return number
 */
  public getID(req) {
    const token = this.readToken(req);
    return token.id;
  }

/**
 * Get access
 * @param req
 * @access public
 * @return number
 */
  public getAccess(req) {
    const token = this.readToken(req);
    return token;
  }



/**
 * Check can access
 * @param request req
 * @param response res
 * @param next
 * @access public
 * @returns boolean
 */
  public canAccess(req: any, res: any): boolean {
    if (this.isLogin(req)) {
      return true;
    } else {
      res.status(401).json({
        status: false,
        error: 'Access Denied'
      });
      return false;
    }
  }
}
