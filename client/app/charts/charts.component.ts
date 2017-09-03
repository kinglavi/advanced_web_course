import { Component, OnInit }      from '@angular/core';
import { ChartsService } from '../services/charts.service';

import * as d3 from 'd3';

@Component({
  selector: 'charts',
  templateUrl: './charts.component.html',
  styleUrls: [ './charts.component.css' ]
})

export class ChartsComponent {

/*
 Data for charts in json format: {“data”: […]} – where […] is array with number values of ads in day or hour respectively.
 So array will contain 7 number values for pie chart and 24 for histogram.
 Data for average time in json format:   {“data”:  time }

 Urls (see ‘services/charts.service’):
 For pie chart: ‘/api/stats/day’
 For histogram:  /‘api/stats/day/:id’, where id is number of day (Mon = 0, Sun = 6)
 For average time: ‘/api/stats/time’
 I leave the functions in ‘server/routes’ file with sample data that I used for testing, so look at this.
 I've added feed component for Google News rss.

 */

  avgShowTime: number = 0;

  pieChart: any = {
    container: '#pie-container',
    isLoading: false,
    svg: '',
    width: 300,                                                   //sizes of chart, you can change it if needed
    height: 300,
    labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], //labels of section
    colors: ["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]   //colors of sections
  };
  histogram: any = {
    container: '#histogram',
    isLoading: false,
    svg: '',
    width: 400,
    height: 250,
    colors: ['#b0eef3', '#b0cdf3', '#b5b0f3','#d6b0f3', '#f3b0ee','#f3b0cd',
             '#cdf3b0', '#f3b5b0', '#d6b0f3', '#94BDCE', '#95d8f1','#95f1ca',
             '#ec9e4f', '#ebec4f', '#9dec4f', '#4fec4f', '#4fec9e', '#4febec',
             '#fac0f6', '#fac0d9', '#fac4c0', '#fae1c0',  '#f6fac0', '#d9fac0' ]
  };

  constructor(private chartsService: ChartsService) {}

  ngOnInit() {

    this.pieChart.isLoading = true;

    this.chartsService.getStatsByDay().subscribe((json) => {
      this.pieChart.isLoading = false;
      this.drawPieChart(json.data);
    });

    this.chartsService.getStatsTime().subscribe((json) => {
      this.avgShowTime = json.data;
    });


    ['pieChart', 'histogram'].forEach((name) =>{
      this[name].svg = d3.select(this[name].container)
        .append('svg')
        .attr('width', this[name].width)
        .attr('height', this[name].height)
    });

    this.histogram.svg.append('text')
      .text('Select a day to see statistics per hour')
      .attr("transform",`translate(${this.histogram.width/2}, ${this.histogram.height/2})`)
      .attr('text-anchor', 'middle')
      .style('font-size', '16px')
      .style('fill', 'white');

  }



  drawPieChart(data) {

    let radius = Math.min(this.pieChart.width, this.pieChart.height-30)*0.5;

    this.pieChart.svg.append('text')
      .attr("transform",`translate(${this.pieChart.width/2}, 20)`)
      .text('Avg. advertisments in day');

    let g = this.pieChart.svg.append('g')
      .attr('transform', `translate(${this.pieChart.width/2}, ${(this.pieChart.height+30)/2})`)
      .style('stroke', 'white');

    g.append('circle')
      .attr('r', radius)
      .attr('cx', 0)
      .attr('cy', 0)
      .style('fill', 'transparent')
      .style('stroke-width', 2);

    let pie = d3.pie()
      .sort(null);

    let path = d3.arc()
      .innerRadius(0)
      .outerRadius(radius);

    let arc: any = g.selectAll('.arc')
      .data(pie(data))
      .enter()
      .append('g')
      .classed('arc', true)
      .style('cursor', 'pointer');

    arc.append('path')
      .attr('d', path)
      .style('fill', (d, i) => { return this.pieChart.colors[i]; })
      .style('stroke-width', 1);

    path.outerRadius(radius*1.4);

    arc.append('text')
      .attr("transform",(d) => { return `translate(${path.centroid(d)})`; })
      .attr("dy", ".35em")
      .text((d, i) => { return this.pieChart.labels[i].toUpperCase(); });

    this.pieChart.svg.selectAll('text')
      .attr('text-anchor', 'middle')
      .style('fill', 'white');

    arc.on('click', (ev, i) => {

      this.histogram.isLoading = true;

      this.chartsService.getStatsByHours(i).subscribe((json) => {
        this.histogram.isLoading = false;
        this.drawHistogram(i, json.data);
      });
    });

  }

  drawHistogram(index, data) {

    this.histogram.svg.selectAll('*')
      .remove();

    this.histogram.svg.append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', this.histogram.width)
      .attr('height', this.histogram.height-20)
      .attr('rx', 10)
      .attr('ry', 10)
      .style('fill', '#081620')
      .style('stroke', 'white')
      .style('stroke-width', 2);

    this.histogram.svg.append('text')
      .attr("transform",`translate(${this.histogram.width/2}, 30)`)
      .text(`Popular hours on ${this.pieChart.labels[index]}`);

    let g = this.histogram.svg.append('g');

    this.addAxes(g, data);

    let gRect = g.selectAll('.h')
      .data(data)
      .enter()
      .append('g')
      .classed('h', true)
      .attr('transform', (d, i) => {
        return `translate(${this.histogram.xScale(i) + 22},${this.histogram.yScale(d) + 59})`;
      });

      gRect.append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', (this.histogram.width - 70) / 24 )
      .attr('height', (d, i) => { return this.histogram.height - 100 - this.histogram.yScale(d); })
      .style('fill', (d, i) => { return this.histogram.colors[i]; })
      .style('stroke', (d, i) => { return this.histogram.colors[i]; })
      .style('stroke-width', 2);

      gRect.append('text')
        .text((d,i) => {return i < 10 ? '0' + i : i;})
        .attr('x', (this.histogram.width - 60) / 48)
        .attr('y', (d, i) => { return this.histogram.height - 120 - this.histogram.yScale(d) ; })
        .attr('font-size', '10px')
        .style('stroke', 'white');

    this.histogram.svg.selectAll('text')
      .attr('text-anchor', 'middle')
      .style('fill', 'white');

  }


  addAxes(g, data) {
    this.histogram.xScale = d3.scaleLinear()
      .domain([0, 23])
      .range([0, this.histogram.width - 50]);
    this.histogram.yScale = d3.scaleLinear()
      .domain([0, d3.max(data)])
      .range([this.histogram.height - 100, 0]);

    let xAxis = d3.axisBottom()
      .scale(this.histogram.xScale)
      .ticks(24);

    let yAxis = d3.axisLeft()
      .scale(this.histogram.yScale);

    g.append('g')
      .classed('xAxis', true)
      .attr('fill', 'white')
      .attr('transform', `translate(20, ${this.histogram.height - 40})`);

    g.append('g')
      .classed('yAxis', true)
      .attr('fill', 'white')
      .attr('transform', `translate(20, ${60})`);

    g.select('.xAxis')
      .call(xAxis);

    g.select('.yAxis')
      .call(yAxis);

    g.selectAll('.xAxis .domain, .xAxis .tick line, .yAxis .domain, .yAxis .tick line')
      .attr('stroke', 'white');

    g.selectAll('.xAxis .tick *')
      .attr('transform', `translate(${(this.histogram.width - 60) / 48},0)`)
  }




}
