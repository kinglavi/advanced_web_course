import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

import { AdService } from '../services/ad.service';
import { ToastComponent } from '../shared/toast/toast.component';
import { IMultiSelectOption } from 'angular-2-dropdown-multiselect';

@Component({
  selector: 'app-ads',
  templateUrl: './ads.component.html',
  styleUrls: ['./ads.component.scss']
})
export class AdsComponent implements OnInit {

  ad = {};
  ads = [];
  isLoading = true;
  isEditing = false;
  optionsModel: number[];
  myOptions: IMultiSelectOption[];
  screenIds = [];

  addAdForm: FormGroup;
  name = new FormControl('', Validators.required);
  age = new FormControl('', Validators.required);
  weight = new FormControl('', Validators.required);
  myGroup= new FormGroup({
    firstName: new FormControl()
  });

  constructor(private adService: AdService,
              private formBuilder: FormBuilder,
              private http: Http,
              public toast: ToastComponent) { }

  ngOnInit() {
    this.myOptions = [
      { id: 1, name: 'Screen 1' },
      { id: 2, name: 'Screen 2' },
    ];

    this.getAds();
    this.addAdForm = this.formBuilder.group({
      name: this.name,
      age: this.age,
      weight: this.weight,
    });
  }

  onChange() {
    console.log(this.optionsModel);
    this.screenIds = this.optionsModel;
  }

  getAds() {
    this.adService.getAds().subscribe(
      data => this.ads = data,
      error => console.log(error),
      () => this.isLoading = false
    );
  }

  addAd() {
    this.adService.addAd(this.addAdForm.value).subscribe(
      res => {
        const newAd = res.json();
        this.ads.push(newAd);
        this.addAdForm.reset();
        this.toast.setMessage('item added successfully.', 'success');
      },
      error => console.log(error)
    );
  }

  enableEditing(ad) {
    this.isEditing = true;
    this.ad = ad;
  }

  cancelEditing() {
    this.isEditing = false;
    this.ad = {};
    this.toast.setMessage('item editing cancelled.', 'warning');
    // reload the ads to reset the editing
    this.getAds();
  }

  editAd(ad) {
    this.adService.editAd(ad).subscribe(
      res => {
        this.isEditing = false;
        this.ad = ad;
        this.toast.setMessage('item edited successfully.', 'success');
      },
      error => console.log(error)
    );
  }

  deleteAd(ad) {
    if (window.confirm('Are you sure you want to permanently delete this item?')) {
      this.adService.deleteAd(ad).subscribe(
        res => {
          const pos = this.ads.map(elem => elem._id).indexOf(ad._id);
          this.ads.splice(pos, 1);
          this.toast.setMessage('item deleted successfully.', 'success');
        },
        error => console.log(error)
      );
    }
  }

}
