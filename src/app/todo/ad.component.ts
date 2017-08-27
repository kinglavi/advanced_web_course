import {Component} from '@angular/core';

import {TodoService} from './ad.service';

// We `import` `http` into our `TodoService` but we can only
// specify providers within our component
import {HTTP_PROVIDERS} from '@angular/http';

// Import NgFor directive
import {NgFor} from '@angular/common';

// Create metadata with the `@Component` decorator
@Component({
    // HTML tag for specifying this component
    selector: 'ad',
    // Let Angular 2 know about `Http` and `TodoService`
    providers: [...HTTP_PROVIDERS, TodoService],
    template: require('./ad.html')
})
export class Ad {

  // Initialize our `adData.text` to an empty `string`
  adData = {
    text: '',
    name: ''
  };

  private ads: Array<Ad> = [];

  constructor(public todoService: TodoService) {
    console.log('Ad constructor go!');

      // this.ads = [];
      todoService.getAll()
        // `Rxjs`; we subscribe to the response
        .subscribe((res) => {
          console.log('lalalal');
            console.log(res);
            // Populate our `todo` array with the `response` data
            this.ads = res;
            // Reset `todo` input
            this.adData.text = '';
        });
  }

  createAd() {

      this.todoService.createAd(this.adData)
        .subscribe((res) => {
            console.log('aaaaa' );
            console.log(this.adData);
            // Populate our `todo` array with the `response` data
            this.ads = res;
            // Reset `todo` input
            this.adData.text = '';
        });
  }

  deleteAd(id) {

    this.todoService.deleteAd(id)
      .subscribe((res) => {

          // Populate our `todo` array with the `response` data
          this.ads = res;
      });
  }
}
