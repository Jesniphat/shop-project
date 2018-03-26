import { Component, OnInit } from '@angular/core';

import { AccessService } from '../../../service/access.service';
import { AlertsService } from '../../../service/alerts.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {
	/** var */
  public accesses = { create: 0, edit: 0, delete: 0 };
  public ucaccess;

  constructor(
  	private _alertsService: AlertsService,
  	private _access: AccessService
  ) { }

  ngOnInit() {
  	this.ucaccess = this._access.accessIndex$.subscribe(accesses => this.accesses = accesses);
  }

/**
 * ng on destroy for destroy subscribe
 * @access public
 */
  public ngOnDestroy() {
  	this.ucaccess.unsubscribe();
  }

}