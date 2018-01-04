import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { AlertsService } from './alerts.service';

@Injectable()
export class SocketService {
  /**
   * Socket cliend
   */
  public socketUrl: any = 'http://localhost:8800'; // 'http://13.59.164.106:8800'
  public loginData: any;

  /**
   * Observable varable
   */
  public socketGetData$: Observable<any>;

  /**
   * Next Varable
   */
  private _socketGetData: any;

  constructor(
    @Inject(PLATFORM_ID) private platformId: object, // Get platform is cliend and server
    public alerts: AlertsService
  ) {
    // Build Observe data
    this.socketGetData$ = new Observable(observer => this._socketGetData = observer);
    this.startio();
  }

  /**
   * Start Socket io
   * @access public
   */
  public startio() {
    if (isPlatformBrowser(this.platformId)) {
      const io = require('socket.io-client');
      const socket =  io.connect(this.socketUrl , {reconnect: true});

      // Receive data from socket server
      // this.loginData = JSON.parse(localStorage.getItem('logindata'));
      this.loginData = JSON.parse(localStorage.getItem('logindata'));
      if (this.loginData !== null) {
        if (this.loginData.type === 'admin') {
          socket.on('admin', function (data) {
            if (data.loginData.display_name !== this.loginData.display_name) {
              this.alertsSocket(data.message);
            }
          }.bind(this));

          socket.on('staff', function (data) {
            // console.log('socker data', data);
            if (data.loginData.display_name !== this.loginData.display_name) {
              this.alertsSocket(data.message);
            }
          }.bind(this));

          socket.on('customer', function (data) {
            if (data.loginData.display_name !== this.loginData.display_name) {
              this.alertsSocket(data.message);
            }
          }.bind(this));
        } else if (this.loginData.type === 'staff') {
          socket.on('staff', function (data) {
            // console.log('socker data', data);
            if (data.loginData.display_name !== this.loginData.display_name) {
              this.alertsSocket(data.message);
            }
          }.bind(this));

          socket.on('customer', function (data) {
            if (data.loginData.display_name !== this.loginData.display_name) {
              this.alertsSocket(data.message);
            }
          }.bind(this));
        } else {
          socket.on('customer', function (data) {
            if (data.loginData.display_name !== this.loginData.display_name) {
              this.alertsSocket(data.message);
            }
          }.bind(this));
        }
      }
    }
  }

  /**
   * Alert message from socket server
   * @param message
   * @access public
   * @returns void
   */
  public alertsSocket(message: any) {
    // alerts messager in the page
    this.alerts.info(message);
    // Sent data for Observer
    // this.sentSocketData(message);
  }


  /**
   * Emit socket messager to server
   * @param data
   */
  public emitMessage(data: any) {
    if (isPlatformBrowser(this.platformId)) {
      const io = require('socket.io-client');
      const socket =  io.connect(this.socketUrl, {reconnect: true});
      socket.emit('save-message', data);
    }
  }

  /**
   * Set some data to Observer varable
   * @param data
   * @access public
   * @returns void
   */
  public sentSocketData(data: any) {
    // This thing need observer to receive.
    // this._socketGetData.next('something');
  }

}
