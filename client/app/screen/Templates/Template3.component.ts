import { Component, Input } from '@angular/core';
 
import { TemplateComponent } from './template.component';
 
@Component({
  styleUrls:["./Template3.css"],
  template: `
    <div style="background-color: #f5f5f5;width: 100%;height:100vh">
    <h1 id="text1">{{data.adText[0]}}</h1>
    <br>
    <video width="100%" autoplay>
      <source src="{{data.imageLink[0]}}" type="video/mp4">
    </video>
    </div>

  `
})
export class Template3Component implements TemplateComponent {
  @Input() data: any;
  setData(data){
   this.data = data;
 }
}