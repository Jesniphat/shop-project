import { Component, OnInit, Input, ElementRef, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ApiService } from '../../../../service/api.service';
import { RootscopeService } from '../../../../service/rootscope.service';
import { AlertsService } from '../../../../service/alerts.service';

import { Uploader } from 'angular2-http-file-upload';
import { MyUploadItem } from '../../../../upload-item';

@Component({
  selector: 'app-staff-create',
  templateUrl: './staff-create.component.html',
  styleUrls: ['./staff-create.component.scss']
})
export class StaffCreateComponent implements OnInit {
  public msgs: any;
  public error: any;
  public uploadUrl: any = '/api/upload/staff';
  public uploadedFiles: any;
  public imgLink: any = '';
  public staff: any = {
    staffName: '',
    staffUserName: '',
    staffLastName: '',
    staffPassword: '',
    staffPic: 'public/images/empty-image.png',
    img: ''
  };

  constructor(
    @Inject(PLATFORM_ID) private platformId: object, // Get platform is cliend and server
    public apiService: ApiService,
    public $rootScope: RootscopeService,
    public _elRef: ElementRef,
    public alerts: AlertsService,
    public uploaderService: Uploader,
  ) { }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => this.reset(), 1000);
    }
    this.imgLink = this.apiService.img;
  }

  /**
   * Save staff
   * @access public
   */
  public saveStaff() {
    // console.log(this.staff);
    this.apiService
      .post('/api/staff', this.staff)
      .subscribe(
        res => this.saveStaffDoneAction(res),
        error => this.saveStaffErrorAction(error)
      );
  }

  /**
   * Save staff done
   * @param res
   * @access private
   */
  private saveStaffDoneAction(res: any) {
    if (res.status) {
      this.alerts.success('บันทึกข้อมูลสำเร็จ');
      this.reset();
    } else {
      if (isPlatformBrowser(this.platformId)) {
        console.log(res.error);
      }
      this.alerts.warning('บันทึกไม่สำเร็จกรุณาลองใหม่อีกครั้ง');
    }
  }

  /**
   * Save staff error
   * @param error
   * @access private
   */
  private saveStaffErrorAction(error: any) {
    if (isPlatformBrowser(this.platformId)) {
      this.error = error.message;
      console.log('error = ', this.error);
      setTimeout(() => this.error = null, 4000);
    }
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

  /**
   * Reset data
   * @access public
   */
  public reset() {
    this.msgs = [];
    this.error = '';
    this.staff = {
      staffName: '',
      staffUserName: '',
      staffLastName: '',
      staffPassword: '',
      staffPic: 'public/images/empty-image.png',
      img: ''
    };
  }

}
