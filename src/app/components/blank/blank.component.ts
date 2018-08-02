import { Component, ElementRef, Inject, OnInit, AfterViewInit, OnDestroy, Input, ViewChild, Injectable } from '@angular/core';
import { WindowService } from '../../services/window.service';
import { Routes, RouterModule, Router, ActivatedRoute, NavigationExtras } from '@angular/router';

declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-blank',
  templateUrl: './blank.component.html',
  styleUrls: ['./blank.component.css']
})
export class BlankComponent {
  // isLoading: boolean = false;

  constructor() { }

  // ngOnInit() {
  // }

}
