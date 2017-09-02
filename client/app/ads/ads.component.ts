import {Component, OnInit, Pipe, PipeTransform} from '@angular/core';
import { Http } from '@angular/http';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

import { AdService } from '../services/ad.service';
import { ToastComponent } from '../shared/toast/toast.component';
import {IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts} from 'angular-2-dropdown-multiselect';
import {IMyDateModel, IMyDpOptions, IMySelector} from 'mydatepicker';

@Pipe({ name: 'keys',  pure: false })
export class KeysPipe implements PipeTransform {
  transform(value: any, args: any[] = null): any {
    return Object.keys(value); // .map(key => value[key]);
  }
}

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
    dateFormat: 'dd/mm/yyyy',
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
  endDate: Object = '';
  ad = {
    name: '',
    adText: [],
    screens: [],
    imageLink: [],
    templateLink: '',
    ttl: 0,
    timeFrames: {
      startDate: new Date(),
      endDate: new Date(),
      days: [],
      startTime: '',
      endTime: ''
    }
  };
  startTimeHour;
  startTimeMinute;
  endTimeHour;
  endTimeMinute;
  currentText = '';

  ads = [];
  isLoading = true;
  isEditing = false;
  screenOption: number[];
  imageOption: number[];
  dayOption: number[];
  imageOptions: IMultiSelectOption[];
  screenOptions: IMultiSelectOption[];

  dayOptions: IMultiSelectOption[];
  screenIds = [];
  imageIds: number[];
  days = [];
  templateOptions = ['Template 1', 'Template 2'];
  addAdForm: FormGroup;
  name = new FormControl('', Validators.required);
  selectedText = '';
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
      { id: 1, name: 'Cat image', params: 'https://static.pexels.com/photos/104827/cat-pet-animal-domestic-104827.jpeg' },
      { id: 2, name: 'Dog image', params: 'https://static.pexels.com/photos/356378/pexels-photo-356378.jpeg' },
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
      text: this.ad.adText,
      // screen: this.ad.screenIds,
      ttl: this.ad.ttl
    });
  }

  changeStartTime($event) {
    this.ad.timeFrames.startTime = '';
    if (this.startTimeHour < 10) {
      this.ad.timeFrames.startTime = '0';
    }
    this.ad.timeFrames.startTime += this.startTimeHour;

    this.ad.timeFrames.startTime += ':';

    if (this.startTimeMinute < 10) {
      this.ad.timeFrames.startTime += '0';
    }
    this.ad.timeFrames.startTime += this.startTimeMinute;
  }

  addTextToArray() {
    if (this.currentText !== '') {
      this.ad.adText.push(this.currentText);
    }
    this.currentText = '';
  }

  removeTextFromArray() {
    const index = this.ad.adText.indexOf(this.selectedText);
    if (index > -1) {
      this.ad.adText.splice(index, 1);
    }

  }

  changeEndTime($event) {
    this.ad.timeFrames.endTime = '';
    if (this.endTimeHour < 10) {
      this.ad.timeFrames.endTime = '0';
    }
    this.ad.timeFrames.endTime += this.endTimeHour;

    this.ad.timeFrames.endTime += ':';

    if (this.endTimeMinute < 10) {
      this.ad.timeFrames.endTime += '0';
    }
    this.ad.timeFrames.endTime += this.endTimeMinute;
  }

  onStartDateChanged(date: IMyDateModel) {
    this.ad.timeFrames.startDate = new Date(date.formatted);
    this.closeSelector();
  }

  onEndDateChanged(date: IMyDateModel) {
    this.ad.timeFrames.endDate = new Date(date.formatted);
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
    this.ad.screens = this.screenIds;
  }

  onChangeImage() {
    this.imageIds = this.imageOption;
    this.ad.imageLink = [];
    this.imageOptions.forEach(image => {
      if ((image.id - 1) in this.imageOption) {
        this.ad.imageLink.push(image.params);
      }
    });
  }

  onChangeTemplate(option) {
    console.log(option);
    this.ad.templateLink = this.templateOptions[option.selectedIndex];
    console.log(this.ad.templateLink);
  }

  onChangeDay(days) {
    console.log(this.dayOption);
    this.days = this.dayOption;
    this.ad.timeFrames.days = [];
    this.dayOptions.forEach(day => {
      if ((day.id - 1) in this.dayOption) {
        this.ad.timeFrames.days.push(day.name);
      }
    });
  }

  getAds() {
    this.adService.getAds().subscribe(
      data => this.ads = data,
      error => console.log(error),
      () => this.isLoading = false
    );
  }

  addAd() {
    this.adService.addAd(this.ad).subscribe(
      res => {
        const newAd = res.json();
        console.log(newAd);
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
    this.ad = {
      name: '',
      adText: [''],
      screens: [],
      imageLink: [],
      templateLink: '',
      ttl: 0,
      timeFrames: {
        startDate: new Date(),
        endDate: new Date(),
        days: [],
        startTime: '',
        endTime: ''
      }
    };
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
