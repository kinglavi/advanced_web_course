import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class AdService {

  private headers = new Headers({ 'Content-Type': 'application/json', 'charset': 'UTF-8' });
  private options = new RequestOptions({ headers: this.headers });
  private url = 'http://localhost:3000';  
  private socket;

  constructor(private http: Http) { }

  getAds(): Observable<any> {
    return this.http.get('/api/ads').map(res => res.json());
  }

  countAds(): Observable<any> {
    return this.http.get('/api/ads/count').map(res => res.json());
  }

  addAd(Ad): Observable<any> {
    return this.http.post('/api/ads', JSON.stringify(Ad), this.options);
  }

  getAd(Ad): Observable<any> {
    return this.http.get(`/api/ads/${Ad._id}`).map(res => res.json());
  }

  editAd(Ad): Observable<any> {
    return this.http.put(`/api/ads/${Ad._id}`, JSON.stringify(Ad), this.options);
  }

  deleteAd(Ad): Observable<any> {
    return this.http.delete(`/api/ads/${Ad._id}`, this.options);
  }

  
  connectScreenSocket(id: String) {
    let observable = new Observable(observer => {
      this.socket = io(this.url,{query:"screenid="+id});
      this.socket.on('screen'+id, (data) => {
        if(Array.isArray(data)){
          data.forEach((ad)=>{
            observer.next(ad);
          })
        }
        else{
          observer.next(data);    
        }
      });
      return () => {
        this.socket.disconnect();
      };  
    })     
    return observable;
  }  

}
