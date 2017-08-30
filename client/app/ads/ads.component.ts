import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

import { AdService } from '../services/ad.service';
import { ToastComponent } from '../shared/toast/toast.component';
import {IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts} from 'angular-2-dropdown-multiselect';
import {IMyDateModel, IMyDpOptions, IMySelector} from 'mydatepicker';
import { NKDatetimeModule } from 'ng2-datetime/ng2-datetime';
import * as $ from 'jquery';

@Component({
  selector: 'app-ads',
  templateUrl: './ads.component.html',
  styleUrls: ['./ads.component.scss']
})
export class AdsComponent implements OnInit {
  startDatePlaceHolder = 'Start date';
  endDatePlaceHolder = 'End date';
  datePickerOptions: IMyDpOptions = {
    // other options...
    todayBtnTxt: 'Today',
    dateFormat: 'yyyy-mm-dd',
    firstDayOfWeek: 'su',
    satHighlight: true,
    // allowDeselectDate: true,
    // inline: true
  };
  // model: Object = { date: { year: 2018, month: 10, day: 9 } };
  selector: IMySelector = {
    open: false
  };
  startDate: Object = '';
  endDate: Object;
  ad = {};
  ads = [];
  startTime;
  isLoading = true;
  isEditing = false;
  screenOption: number[];
  imageOption: number[];
  templateOption: number[];
  dayOption: number[];
  imageOptions: IMultiSelectOption[];
  screenOptions: IMultiSelectOption[];
  templateOptions: IMultiSelectOption[];
  dayOptions: IMultiSelectOption[];

  screenIds = [];
  imageIds: number[];
  days = [];
  templateIds = [];

  addAdForm: FormGroup;
  name = new FormControl('', Validators.required);
  age = new FormControl('', Validators.required);
  weight = new FormControl('', Validators.required);
  myGroup= new FormGroup({
    firstName: new FormControl()
  });
  // Settings configuration
  dropDownSettings: IMultiSelectSettings = {
    // enableSearch: true,
    // checkedStyle: 'fontawesome',
    // buttonClasses: 'btn btn-default btn-block',
    // dynamicTitleMaxItems: 3,
    // displayAllSelectedText: true
  };
  // Text configuration
  dropDownListText: IMultiSelectTexts = {
    checkAll: 'Select all',
    uncheckAll: 'Unselect all',
    checked: 'item selected',
    checkedPlural: 'items selected',
    searchPlaceholder: 'Find',
    defaultTitle: 'Select',
    allSelected: 'All selected',
  };

  constructor(private adService: AdService,
              private formBuilder: FormBuilder,
              private http: Http,
              public toast: ToastComponent) { }

  ngOnInit() {
    this.screenOptions = [
      { id: 1, name: 'Screen 1' },
      { id: 2, name: 'Screen 2' },
    ];
    this.imageOptions = [
      { id: 1, name: 'Cat image' },
      { id: 2, name: 'Dog image' },
    ];
    this.templateOptions = [
      { id: 1, name: 'Template 1' },
      { id: 2, name: 'Template 2' },
    ];

    this.dayOptions = [
      { id: 1, name: 'Sunday' },
      { id: 2, name: 'Monday' },
      { id: 3, name: 'Tuesday' },
      { id: 4, name: 'Wednesday' },
      { id: 5, name: 'Thursday' },
      { id: 6, name: 'Friday' },
      { id: 7, name: 'Saturday' }
    ];

    this.getAds();
    this.addAdForm = this.formBuilder.group({
      name: this.name,
      age: this.age,
      weight: this.weight,
    });
  }

  changeStartTime(val) {

  }

  onDateChanged(event: IMyDateModel) {
    this.closeSelector();
  }

  closeSelector() {
    this.selector = {
      open: false
    };
  }

  onChangeScreen() {
    console.log(this.screenOption);
    this.screenIds = this.screenOption;
  }

  onChangeImage() {
    this.imageIds = this.imageOption;
  }

  onChangeTemplate() {
    this.templateIds = this.templateOption;
  }

  onChangeDay() {
    this.days = this.imageOption;
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
