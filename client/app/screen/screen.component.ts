import {Component, OnInit, OnDestroy,ComponentFactoryResolver,ViewContainerRef ,AfterViewInit } from '@angular/core';

import { AdService } from '../services/ad.service';

import { TemplateComponent } from './Templates/template.component';

import { Template1Component } from './Templates/Template1.component';
import { Template2Component } from './Templates/Template2.component';
import { Template3Component } from './Templates/Template3.component';

import { Router,ActivatedRoute } from '@angular/router';
// Import NgFor directive
import {NgFor} from '@angular/common';

// Create metadata with the `@Component` decorator
@Component({
    // HTML tag for specifying this component
    selector: 'ads',
    template:''
})
export class ScreenComponent implements OnInit, OnDestroy, AfterViewInit {
  ads = [];
  connection;
  message;
  weekday = new Array(7);
  currAdIndex = 0;
  numSeconds = 0;
  templates= new Map();
  
  constructor(private router: ActivatedRoute,private adService:AdService,private componentFactoryResolver: ComponentFactoryResolver,private element:ViewContainerRef ) {
    this.weekday[0] =  "Sunday";
    this.weekday[1] = "Monday";
    this.weekday[2] = "Tuesday";
    this.weekday[3] = "Wednesday";
    this.weekday[4] = "Thursday";
    this.weekday[5] = "Friday";
    this.weekday[6] = "Saturday";
    this.templates.set("./Template1.html",Template1Component);
    this.templates.set("./Template2.html",Template2Component);
    this.templates.set("./Template3.html",Template3Component);
  }

  ngOnInit() {
    this.router.params.subscribe(this.setScreenSocket.bind(this));
  }

  ngAfterViewInit() {
      setInterval(() => {
      this.showAds(this.ads);
     },1000); 
  }

  setScreenSocket(params){
    var screenNum = '' + params['id'];
     this.connection = this.adService.connectScreenSocket(screenNum).subscribe(ad => {
      this.ads.push(ad);
    })
  }
  
  showAds(json){
    if(this.numSeconds == 0){
      this.findNextAd(this.ads);
    }
    else{
      if(this.numSeconds > this.ads[this.currAdIndex].ttl){
         this.numSeconds = 0;
         this.findNextAd(this.ads);
      }
      else{
        this.numSeconds++; 
      }
    }
  }

  findNextAd(ads){
    var searchIndex = (this.currAdIndex + 1)%ads.length;
    var stop = false;
    while(!stop){
      var i =0;
      for(i=0;i<ads[searchIndex].timeFrames.length;i++){
        if(this.isFrameLive(ads[searchIndex].timeFrames[i])){
            this.currAdIndex = searchIndex;
            
            this.displayAd(ads[searchIndex]);
            break;
        }
      }        

      if(searchIndex == this.currAdIndex){
        stop = true;
      }
      else{
        searchIndex=(searchIndex+1)%ads.length;
      }
    }

  }

  displayAd(ad){
   let componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.templates.get(ad.templateLink));

    let viewContainerRef = this.element;
    viewContainerRef.clear();

    let componentRef = viewContainerRef.createComponent(componentFactory);
    (<TemplateComponent>componentRef.instance).data = ad;
  this.numSeconds++;
}

  isFrameLive(timeFrame){

  // check date range
  var currDate = new Date();
  var startSplit = timeFrame.startDate.split("/");
  var endSplit = timeFrame.endDate.split("/");
  var startDate = new Date(startSplit[2],startSplit[1]-1,startSplit[0]);
  var endDate = new Date(endSplit[2],endSplit[1]-1,endSplit[0]);
  
  if(currDate >= startDate && currDate <= endDate){
    //check day
    var day = this.weekday[currDate.getDay()];
    if(timeFrame.days.includes(day)){

      //check time
      var timeMin = currDate.getHours()*60+currDate.getMinutes();
      var startTimeSplit = timeFrame.startTime.split(":");
      var endTimeSplit = timeFrame.endTime.split(":");
      var startTime = parseInt(startTimeSplit[0])*60+parseInt(startTimeSplit[1]);
      var endTime = parseInt(endTimeSplit[0])*60+parseInt(endTimeSplit[1]);

      if(timeMin>=startTime && timeMin<=endTime){
        return true;
      }
    }
  }
  return false;

}

  ngOnDestroy() {
    this.connection.unsubscribe();
  }
}
