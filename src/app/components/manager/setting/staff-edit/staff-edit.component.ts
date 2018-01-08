import { Component, OnInit, Input, ElementRef, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '../../../../service/api.service';
import { RootscopeService } from '../../../../service/rootscope.service';
import { AlertsService } from '../../../../service/alerts.service';

import { Uploader } from 'angular2-http-file-upload';
import { MyUploadItem } from '../../../../upload-item';
declare var $: any;

@Component({
  selector: 'app-staff-edit',
  templateUrl: './staff-edit.component.html',
  styleUrls: ['./staff-edit.component.scss']
})
export class StaffEditComponent implements OnInit {
  public storage: any;
  public uploadedFiles: any;
  public uploadUrl: any = '/api/upload/staff';
  public imgLink: any = '';
  public staff: any = {
    staffId: '',
    password: '',
    staffName: '',
    staffLastName: '',
    staffUserName: '',
    staffPic: 'public/images/empty-image.png',
    img: ''
  };
  public staffData: any;
  public error: any;
  public msgs: any;

  constructor(
    @Inject(PLATFORM_ID) private platformId: object, // Get platform is cliend and server
    public apiService: ApiService,
    public $rootScope: RootscopeService,
    public _elRef: ElementRef,
    public alerts: AlertsService,
    public uploaderService: Uploader,
  ) { }

  ngOnInit() {
    // console.log('staff_setting.component');
    if (isPlatformBrowser(this.platformId)) {
      this.storage = localStorage;
      this.getStaffFromStorage();
    }
    this.imgLink = this.apiService.img;
  }

  /**
   * Get staff data from local storage
   * @access public
   */
  public getStaffFromStorage() {
    if (isPlatformBrowser(this.platformId)) {
      if (this.storage.getItem('logindata')) {
        const logindata = JSON.parse(this.storage.getItem('logindata'));
        this.staffData = logindata;

        this.staff.staffName = this.staffData.display_name;
        this.staff.staffLastName = this.staffData.last_name;
        this.staff.staffUserName = this.staffData.login_name;
        this.staff.staffId = this.staffData.id;
        this.staff.password = this.staffData.password;
        this.staff.staffPic = this.staffData.pic || 'public/images/empty-image.png';
      }
    }
  }

  /**
   * Update staff data
   * @access public
   */
  public updateStaff() {
    const param = {
      name: this.staff.staffName,
      lastName: this.staff.staffLastName,
      user: this.staff.staffUserName,
      id: this.staff.staffId,
      password: this.staff.password,
      pic: this.staff.staffPic
    };
    this.apiService
      .put('/api/staff', param)
      .subscribe(
      res => this.updateStaffDoneAction(res),
      error => this.updateStaffErrorAction(error)
      );
  }

  /**
   * Update date done.
   * @param res
   * @access private
   */
  private updateStaffDoneAction(res: any) {
    if (isPlatformBrowser(this.platformId)) {
      if (res.status === true) {
        const loginData = JSON.stringify(res.data);
        this.storage.setItem('logindata', loginData);
        // this.$rootScope.loginShow({ hiddenLogin: false, class10: true });
        this.alerts.success('บันทึกข้อมูลสำเร็จ');
      } else {
        if (isPlatformBrowser(this.platformId)) {
          console.log('can\'t change');
        }
      }
    }
  }

  /**
   * Update staff error
   * @param error
   * @access private
   */
  private updateStaffErrorAction(error: any) {
    this.error = error.message;
    if (isPlatformBrowser(this.platformId)) {
      console.log('error = ', this.error);
    }
    this.alerts.warning('บันทึกข้อมูลไม่สำเร็จกรุณาลองใหม่อีกครั้ง');
  }

  /**
   * Upload staff img
   * @param data
   * @access public
   */
  public uploadStaffPic(data) {
    if (isPlatformBrowser(this.platformId)) {
      if (!data.target.files[0]) {
        return;
      }
      // console.log('file = ', data.target.files[0]);
      this.$rootScope.setBlock(true, 'Uploading...');
      const uploadFile = data.target.files[0];
      const myUploadItem = new MyUploadItem(uploadFile, this.uploadUrl);
      myUploadItem.formData = { FormDataKey: 'Form Data Value' };  // (optional) form data can be sent with file
      this.uploaderService.onSuccessUpload = (item, response, status, headers) => {
        let pic_name: any;
        if (typeof response === 'string') {
            pic_name = JSON.parse(response);
        } else {
            pic_name = response;
        }
        console.log(pic_name);
        if (pic_name.status === true) {
          this.staff.staffPic = pic_name.data.pic_path;
          this.uploadedFiles = pic_name.data;
          console.log('upload seccess');
        } else {
          console.log('error = ', pic_name.error);
          this.alerts.warning('บันทึกรูปภาพไม่สำเร็จกรุณาลองใหม่อีกครั้ง');
        }
        this.$rootScope.setBlock(false);
      };
      this.uploaderService.onErrorUpload = (item, response, status, headers) => {
        console.log('onErrorUpload = ', response);
        this.$rootScope.setBlock(false);
      };
      this.uploaderService.upload(myUploadItem);
    }
  }

}
