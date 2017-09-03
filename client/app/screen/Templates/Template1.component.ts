import { Component, Input } from '@angular/core';
 
import { TemplateComponent } from './template.component';
 
@Component({
  styleUrls:['./Template1.css'],
  template: `
    <div style="background-color: #f5f5f5;width: 100%;height: 100%">
    <canvas id="ctx" style="width:100%;"></canvas>
    </div>

  `
})
export class Template1Component implements TemplateComponent {
  @Input() data: any;
  setData(data){
   this.data = data;
   let ctx = (<HTMLCanvasElement>document.querySelector("#ctx")).getContext('2d');
   ctx.font = "40px Comic Sans MS";
   ctx.fillStyle = "red";
   ctx.fillText(data.adText[0], 97, 100);
   ctx.fillStyle = "#000";
   ctx.fillText(data.adText[0], 100, 100);
   ctx.fillStyle = "cyan";
   ctx.fillText(data.adText[0], 103, 100);
 }
 
}