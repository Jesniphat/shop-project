import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class AlertsService {
  // Observable navItem source
  // public data:any;
  public alerts$: Observable<any>;

  private _alerts: any;

  constructor() {
    this.alerts$ = new Observable(observer => this._alerts = observer);
  }

  public success(messages: any) {
    this._alerts.next({type: 'success', message: messages});
  }

  public info(messages: any) {
    this._alerts.next({type: 'info', message: messages});
  }

  public warning(messages: any) {
    this._alerts.next({type: 'warning', message: messages});
  }

  public danger(messages: any) {
    this._alerts.next({type: 'danger', message: messages});
  }

}
