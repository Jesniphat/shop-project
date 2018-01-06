import { Injectable, Inject, PLATFORM_ID, Optional } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { APP_BASE_HREF } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

import { environment } from '../../environments/environment';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';

import { ResponseData } from './constructor-variable';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class ApiService {
    private prod = false;
    public api = '';
    public upl = '';
    public img = '';
    // public img = 'http://localhost:8800/';
    // public img = 'http://13.59.164.106:8800/' environment.production;

  constructor(
    @Inject(PLATFORM_ID) private platformId: object, // Get platform is cliend and server
    private http: HttpClient,
    private router: Router
  ) {
    this.setImgUrl();
  }

  /**
   * SET IMG Url
   * @access private
   */
  private setImgUrl() {
    if (isPlatformBrowser(this.platformId)) {
      this.img = window.location.protocol + '//' +  window.location.hostname;
      if (window.location.port) {
        if (!environment.production) {
          this.img += ':' + '8800';
        } else {
          this.img += ':' + window.location.port;
        }
      }
      this.img += '/';
    }
  }

  /**
   * GET data from the server
   * @param url: string
   * @access public
   */
  public get(url: string): Observable<ResponseData> {
    return this.http
      .get<ResponseData>( this.api + url, httpOptions)
      .pipe(
        tap((res: ResponseData) => this.access(res)),
        catchError(this.handleError<ResponseData>('GetApi'))
      );
    }


  //////// Save methods //////////

  /**
   * POST: Add a new hero to the server
   * @param url: string
   * @param param: any
   * @access public
   */
  public post(url: string, param: any): Observable<ResponseData> {
    return this.http
    .post<ResponseData>(this.api + url, JSON.stringify(param), httpOptions)
    .pipe(
      tap((res: ResponseData) => this.access(res)),
      catchError(this.handleError<ResponseData>('PostApi'))
    );
  }

  /**
   * PUT: Update some record
   * @param url: string
   * @param param: any
   * @access public
   */
  public put(url: string, param: any): Observable<ResponseData> {
    return this.http
    .put<ResponseData>(this.api + url, JSON.stringify(param), httpOptions)
    .pipe(
      tap((res: ResponseData) => this.access(res)),
      catchError(this.handleError<ResponseData>('PostApi'))
    );
  }

  /**
   * If data not error we need to check permistion or something
   * @param res
   * @access private
   */
  private access(res: any) {
      if (res.nologin) {
        // console.log('go to new login.');
        this.router.navigate(['/system-login']);
        return res || { };
      }else {
        // console.log('body = ', body);
        return res || { };
      }
  }

  /**
	 * Handle Http operation that failed.
   * Let the app continue.
	 * @param operation
	 * @param result
   * @access private
	 */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      // console.error(error); // log to console instead
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

}
