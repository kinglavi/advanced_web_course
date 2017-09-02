import { Component, Input } from '@angular/core';
 
import { TemplateComponent } from './template.component';
 
@Component({
  styleUrls:["./Template2.css"],
  template: `
    <div style="background-color: #212121;width: 100%;height:100vh">
    <div id="banners">
      <img src={{data.imageLink[0]}} id="image1"/>
      <img src={{data.imageLink[1]}} id="image2"/>
      <img src={{data.imageLink[2]}} id="image3"/>
    </div>
  
    <h1 id="text1">{{data.adText[0]}}</h1>
    <br>
    <p id="text2">{{data.adText[1]}}</p>
    </div>

  `
})
export class Template2Component implements TemplateComponent {
  @Input() data: any;
    setData(data){
   this.data = data;
   setTimeout(function() {
    document.querySelector("#image1").classList  .toggle("fade1");
   document.querySelector("#image2").classList.toggle("fade2");
   document.querySelector("#image3").classList.toggle("fade3");   
   
  }, 1000);
   
 }
 
}