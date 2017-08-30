import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class ChartsService {

  constructor(private http: Http) { }

  getStatsTime = function() {            //get data for average time
    return this.http.get('/api/stats/time')
      .map((resp:Response)=>resp.json());
  };

  getStatsByDay = function() {         //get data for pie chart
    return this.http.get('/api/stats/day')
      .map((resp:Response)=>resp.json());
  };

  getStatsByHours = function(id) {     //get data for histogram
    return this.http.get(`/api/stats/day/${id}`)
      .map((resp:Response)=>resp.json());
  };



}