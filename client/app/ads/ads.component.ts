import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

import { AdService } from '../services/ad.service';
import { ToastComponent } from '../shared/toast/toast.component';

@Component({
  selector: 'app-Ads',
  templateUrl: './ads.component.html',
  styleUrls: ['./ads.component.scss']
})
export class AdsComponent implements OnInit {

  Ad = {};
  Ads = [];
  isLoading = true;
  isEditing = false;

  addAdForm: FormGroup;
  name = new FormControl('', Validators.required);
  age = new FormControl('', Validators.required);
  weight = new FormControl('', Validators.required);

  constructor(private AdService: AdService,
              private formBuilder: FormBuilder,
              private http: Http,
              public toast: ToastComponent) { }

  ngOnInit() {
    this.getAds();
    this.addAdForm = this.formBuilder.group({
      name: this.name,
      age: this.age,
      weight: this.weight
    });
  }

  getAds() {
    this.AdService.getAds().subscribe(
      data => this.Ads = data,
      error => console.log(error),
      () => this.isLoading = false
    );
  }

  addAd() {
    this.AdService.addAd(this.addAdForm.value).subscribe(
      res => {
        const newAd = res.json();
        this.Ads.push(newAd);
        this.addAdForm.reset();
        this.toast.setMessage('item added successfully.', 'success');
      },
      error => console.log(error)
    );
  }

  enableEditing(Ad) {
    this.isEditing = true;
    this.Ad = Ad;
  }

  cancelEditing() {
    this.isEditing = false;
    this.Ad = {};
    this.toast.setMessage('item editing cancelled.', 'warning');
    // reload the ads to reset the editing
    this.getAds();
  }

  editAd(Ad) {
    this.AdService.editAd(Ad).subscribe(
      res => {
        this.isEditing = false;
        this.Ad = Ad;
        this.toast.setMessage('item edited successfully.', 'success');
      },
      error => console.log(error)
    );
  }

  deleteAd(Ad) {
    if (window.confirm('Are you sure you want to permanently delete this item?')) {
      this.AdService.deleteAd(Ad).subscribe(
        res => {
          const pos = this.Ads.map(elem => elem._id).indexOf(Ad._id);
          this.Ads.splice(pos, 1);
          this.toast.setMessage('item deleted successfully.', 'success');
        },
        error => console.log(error)
      );
    }
  }

}
