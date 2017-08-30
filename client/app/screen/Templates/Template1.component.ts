import { Component, Input } from '@angular/core';
 
import { TemplateComponent } from './template.component';
 
@Component({
  template: `
    <div style="background-color: #f5f5f5;width: 100%;height: 100%">
    <img id="image1"/>
    <img id="image2"/>
    <img id="image3"/>
    <img id="image4"/>
    <img id="image5"/>
    <p id="text1"></p>
    <br>
    <p id="text2"></p>
    <br>
    <p id="text3"></p>
    <br>
    <p id="text4"></p>
    <br>
    <p id="text5"></p>
    <br>
    <p id="text6"></p>
    <br>
    <p id="text7"></p>
    <br>
    <p id="text8"></p>
    <br>
    <p id="text9"></p>
    <br>
    <p id="text10"></p>
    </div>

  `
})
export class Template1Component implements TemplateComponent {
  @Input() data: any;
 
}