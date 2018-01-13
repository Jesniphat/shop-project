import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable } from 'rxjs/Observable';
import { ApiService } from './api.service';

@Injectable()
export class ProductStorageService {

  /**
   * Variable
   */
  public storage: any;
  public productList: any = [];
  public $scope: any;

  /**
   * Observable varaible
   */
  public $productList: Observable<any>;

  /**
   * Oberver data
   */
  public _producList: any;

/**
 * Construtor of class
 * @param apiService
 * @access public
 * @return void
 */
  public constructor(
    @Inject(PLATFORM_ID) private platformId: object, // Get platform is cliend and server
    public apiService: ApiService,
  ) {
    this.$productList = new Observable(observer => this._producList = observer);
  }


  /**
   * Get Data to aucompelte
   * @access public
   * @param call back
   * @return call back
   */
  public productListGetting() {
    const that = this;
    this.getMaxProductId(this.apiService, this.platformId)
    .then(this.getProductList)
    .then((data) => {
      that._producList.next(data);
      // resule(data);
    })
    .catch((error) => {
      // console.log(error);
      that._producList.next(error);
      // error(error);
    });
  }

  /**
   * Get Max id frm data base
   * @access public
   * @return promise
   */
  public getMaxProductId(apiService, platformId): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      apiService
      .get('/api/productstore/max', {})
      .subscribe(
          data => {
            const param = {
              apiService: apiService,
              max_update: data.data,
              platformId: platformId
            };
            return resolve(param);
          },
          error => {
            console.log(error);
            return reject(error);
          }
      );
    });
  }


  /**
   * Get productlist from server
   * @access public
   */
  public getProductList(param): Promise<any> {
  //  const storage = localStorage;
    let storage: any ;
    if (isPlatformBrowser(param.platformId)) {
      // Do something if want to use only cliend site.
      storage = localStorage;
    }
   let productList = [];
    // Get data from local storage
    if (storage.getItem('productlist')) {
      productList = JSON.parse(storage.getItem('productlist'));
    }

    return new Promise<any>((resolve, reject) => {
      const listData: any = '';
      if (productList.length !== 0) {
        if (productList[productList.length - 1].updated_date === param.max_update) {
          return resolve(productList);
        }else {
          // Select by last id
          let setMax = '2000-10-01';
          if (new Date(productList[productList.length - 1].updated_date) < new Date(param.max_update)) {
            setMax = productList[productList.length - 1].updated_date;
          } else {
            setMax = param.max_update;
          }

          param.apiService
          // .post('/api/productstore/getAllProductStore', {'max_update': setMax})
          .get('/api/productstore/getAllProductStore/' + setMax /*, {'max_update': setMax}*/)
          .subscribe(
              (resule) => {
                console.log(resule);
                if (!resule.status) {
                  return resolve(productList);
                } else {
                  resule.data.forEach(element => {
                    const newDate = productList.filter(function(el) {
                      return el.id !== element.id;
                    });
                    productList = newDate;
                    productList.push(element);
                  });
                  storage.setItem('productlist', JSON.stringify(productList));
                  return resolve(productList);
                }
              },
              (error) => {
                // console.log(error);
                return reject(error);
              }
          );
        }
      }else {
        // Select all first
        param.apiService
        // .post('/api/productstore/getAllProductStore', {'max_update': '2000-10-01'})
        .get('/api/productstore/max_update/' + '2000-10-01' /*, {'max_update': '2000-10-01'}*/)
        .subscribe(
          (result) => {
            console.log(result);
            storage.setItem('productlist', JSON.stringify(result.data));
            return resolve(result.data);
          },
          (error) => {
            // console.log(error);
            return reject(error);
          }
        );
      }
    });
  }


  /**
   * When Remove Product Out
   * @param product
   * @access public
   * @return productList
   */
  public deleteProductStore(product: any) {
    let storage: any;
    if (isPlatformBrowser(this.platformId)) {
      // Do something if want to use only cliend site.
      storage = localStorage;
    }
    let productList = [];
    // Get data from local storage
    if (storage.getItem('productlist')) {
      productList = JSON.parse(storage.getItem('productlist'));
    }

    const newDate = productList.filter(function(el) {
      return el.id !== product.id;
    });
    productList = newDate;
    storage.setItem('productlist', JSON.stringify(productList));
    this._producList.next(productList);
  }

}
