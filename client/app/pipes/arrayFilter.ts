import { Pipe, PipeTransform, Injectable } from '@angular/core';

@Pipe({
  name: 'filterArray'
})


@Injectable()
export class ArrayFilterPipe implements PipeTransform {
  transform(items: any[], field: string, value: string): any[] {
    if (!items) {
      return [];
    }
    if (!field || !value) {
      return items;
    }

    const result = [];
    items.forEach(item => {
      let isValid = false;
      if (item[field] !== undefined) {
        item[field].forEach(subItem => {
          let lower_item_value = '';
          if (subItem !== undefined) {
            subItem = String(subItem);
            lower_item_value = subItem.toLowerCase();
          }

          if (lower_item_value.includes(value)) {
            isValid = true;
          }
        });
        if (isValid) {
          result.push(item);
        }
      }
    });
    return result;
  }
}
