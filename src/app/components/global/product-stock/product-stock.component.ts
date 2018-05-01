import { Component, OnInit, OnDestroy, ViewChild, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { AddEditProductComponent } from '../add-edit-product/add-edit-product.component';
import { TableElementComponent } from '../../../element/table-element/table-element.component';
import { AutocompleteComponent } from '../../../element/autocomplete/autocomplete.component';

import { ApiService } from '../../../service/api.service';
import { RootscopeService } from '../../../service/rootscope.service';

declare let $: any;
declare var toastr: any;

@Component({
  selector: 'app-product-stock',
  templateUrl: './product-stock.component.html',
  styleUrls: ['./product-stock.component.scss']
})
export class ProductStockComponent implements OnInit, OnDestroy {
  /** Connect to child */
  @ViewChild(TableElementComponent) private tableElementComponent: TableElementComponent;
  @ViewChild(AddEditProductComponent) public addEditProductComponent: AddEditProductComponent;
  @ViewChild(AutocompleteComponent) private autocompleteComponent: AutocompleteComponent;

  /**
   * Product id.
   */
  public productId: any = 'create';

  /**
   * Send data to autocomplete child.
   */
  public autoCompleteData: any = {
    api: '/api/product/name',
    column: 'product_name'
  };

  /**
   * Create var.
   */
  public storage: any;
  public searchData: any;

  public stockInProduct: any = {
    id: '',
    code: '',
    name: '',
    qty:  '',
    staffid: 0
  };

  /**
   * Data table var
   */
  public stockList: any[] = [];

  /**
   * Unsubscribe var
   */
  public unsubProductList: any;

  /**
   * constructor of class
   *
   * @param storages
   * @access public
   */
  public constructor (
    @Inject(PLATFORM_ID) private platformId: object, // Get platform is cliend and server
    public apiService: ApiService,
    public $rootScope: RootscopeService,
  ) { }


  /**
   * start function
   *
   * @access public
   */
  public ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.$rootScope.setBlock(false);
      this.storage = localStorage;
      if (this.storage.getItem('logindata')) {
        const logindata = JSON.parse(this.storage.getItem('logindata'));
        this.stockInProduct.staffid = logindata.id;
      }
    }
  }

  public clickSearch() {
    this.searchData = this.autocompleteComponent.autocompleteText;
    this.searchProduct();
  }


  /**
   * Submit function  getproductbyid
   *
   * @access public
   */
  public searchProduct() {
    if (isPlatformBrowser(this.platformId)) {
      this.$rootScope.setBlock(true);
      const param = {
        product_name: this.searchData
      };
      this.apiService
      .get('/api/productstore/productname/' + param.product_name)
      .subscribe(
        res => this.getProductByNameDoneAction(res),
        error => this.getProductByNameErrorAction(error)
      );
    }
  }


  /**
   * When get product complete
   * @param res
   * @access public
   * @return void
   */
  public getProductByNameDoneAction(res: any) {
    this.stockInProduct.id = res.data.id;
    this.stockInProduct.code = res.data.code;
    this.stockInProduct.name = res.data.product_name;

    this.getStockList(res.data.id);

    this.$rootScope.setBlock(false);
  }


  /**
   * When get product not complete
   *
   * @param error
   * @access public
   * @return void
   */
  public getProductByNameErrorAction(error: any) {
    if (isPlatformBrowser(this.platformId)) {
      console.log(error);
      this.$rootScope.setBlock(false);
    }
  }


  /**
   * Save ot in data
   *
   * @param none
   * @access public
   * @return void
   */
  public saveLotIn() {
    if (isPlatformBrowser(this.platformId)) {
      console.log('save lot in');
      this.$rootScope.setBlock(true);
      const param = {
        product_id: this.stockInProduct.id,
        product_code: this.stockInProduct.code,
        product_qty: this.stockInProduct.qty,
        staff_id: this.stockInProduct.staffid
      };
      this.apiService
        .post('/api/productstore/saveStockIn', param)
        .subscribe(
          res => this.saveStockDoneAction(res),
          error => this.saveStockErrorAction(error)
      );
    }
  }

/**
 * Save stock done.
 * @param res
 * @access private
 */
  private saveStockDoneAction(res: any) {
    if (isPlatformBrowser(this.platformId)) {
      if (res.status === true) {
        this.reset();
        this.$rootScope.setBlock(false);
        this.searchProduct();
      } else {
        console.log('can\'t save ', res.error);
        this.$rootScope.setBlock(false);
      }
    }
  }


  /**
   * Save stock error
   * @param error
   * @access private
   */
  private saveStockErrorAction(error: any) {
    if (isPlatformBrowser(this.platformId)) {
      console.log('can\'t save ', error);
      this.$rootScope.setBlock(false);
    }
  }


  /**
   * Get stock list
   * @access private
   */
  private getStockList(id: any) {
    if (isPlatformBrowser(this.platformId)) {
      const param = {
        product_id: id
      };
      this.apiService
      .get('/api/productstore/getStockList/' + param.product_id)
      .subscribe(
        (res) => {
          this.stockList = res.data;
          const stockColumn = [
            {'name': 'Product code', 'column': 'code'},
            {'name': 'Product name', 'column': 'product_name'},
            {'name': 'Lot in', 'column': 'lot_in'},
            {'name': 'Product price', 'column': 'product_price'}
          ];
          const action = {
            search: false,
            status: false,
            edit: false,
            delete: false
          };
          this.tableElementComponent.getTableDataLists({list: res.data, column: stockColumn, action: action});
        },
        error => console.log(error)
      );
    }
  }

  /**
   * Reset every thing
   * @param none
   * @access public
   * @return void
   */
  public reset() {
    if (isPlatformBrowser(this.platformId)) {
      this.stockInProduct = {
        id: '',
        code: '',
        name: '',
        qty:  '',
        staffid: this.stockInProduct.staffid
      };
    }
  }

  public createProductResult(result) {
    if (result) {
      if (isPlatformBrowser(this.platformId)) {
        document.getElementById('addproductmodel').style.display = 'none';
      }
    } else {
      if (isPlatformBrowser(this.platformId)) {
        console.log('can\'t save');
      }
    }
  }

  /**
   * When component has destroy
   * @access public
   */
  public ngOnDestroy() {
    let destroy: any;
    destroy = this.unsubProductList != null ? this.unsubProductList.unsubscribe() : null;
  }

}
