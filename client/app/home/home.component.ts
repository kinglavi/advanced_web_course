import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.css']
})
export class HomeComponent {

  constructor(private router: Router) { }

  navigate(screenNum){
    this.router.navigate(['/screen', screenNum]);
  }

}
