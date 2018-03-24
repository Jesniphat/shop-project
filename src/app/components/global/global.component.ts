import { Component, OnInit } from '@angular/core';

import { ApiService } from '../../service/api.service';
import { AlertsService } from '../../service/alerts.service';
import { AccessService } from '../../service/access.service';
import { RootscopeService } from '../../service/rootscope.service';

@Component({
  selector: 'app-global',
  templateUrl: './global.component.html',
  styleUrls: ['./global.component.scss']
})
export class GlobalComponent implements OnInit {

  public access = {create: 0, edit: 0, delete: 0};
  public ucaccess;

  constructor(
  	private apiService: ApiService, 
  	private alertsService: AlertsService, 
  	private rootscopeService: RootscopeService,
  	private accessService: AccessService
  ) { }

  public ngOnInit() {
  	this.ucaccess = this.rootscopeService.access$.subscribe(data => this.access = data);
  	this.accessService.access();
  }

  public ngOnDestroy() {
  	this.ucaccess.unsubscribe();
  }

}
