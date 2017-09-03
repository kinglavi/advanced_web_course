import { Pipe, PipeTransform, Injectable } from '@angular/core';

@Pipe({
  name: 'filter'
})

@Injectable()
export class FilterPipe implements PipeTransform {
  transform(items: any[], field: string, value: string): any[] {
    if (!items) {
      return [];
    }
    if (!field || !value) {
      return items;
    }

    const result = [];
    items.forEach(item => {
      let lower_item_value = '';
      if (item[field] !== undefined) {
        lower_item_value = item[field].toLowerCase();
      }

      if (lower_item_value.includes(value)) {
        result.push(item);
      }
    });
    return result;
  }
}


