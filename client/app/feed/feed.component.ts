import { Component, OnInit, Input }      from '@angular/core';
import { Http }      from '@angular/http';

@Component({
  selector: 'feed',
  templateUrl: './feed.component.html',
  styleUrls: [ './feed.component.css' ]
})

export class FeedComponent {
  @Input() url;

  data = false;
  isLoading = true;

  constructor(private http:Http) {
  }

  ngOnInit() {
    this.http.get('https://api.rss2json.com/v1/api.json?rss_url='+this.url)
      .map(res => res.json())
      .subscribe(res => {
        this.isLoading = false;
        this.data = res;
      });
  }
}