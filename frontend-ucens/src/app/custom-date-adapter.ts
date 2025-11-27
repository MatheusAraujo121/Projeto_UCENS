import { NativeDateAdapter } from '@angular/material/core';
import { Injectable } from '@angular/core';

@Injectable()
export class CustomDateAdapter extends NativeDateAdapter {
  
  
  override parse(value: any): Date | null {
    if ((typeof value === 'string') && (value.indexOf('/') > -1)) {
      const str = value.split('/');
      
      
      const day = Number(str[0]); 
      const month = Number(str[1]) - 1; 
      const year = Number(str[2]);

      if (day && month >= 0 && year) {
        const date = new Date(year, month, day);

        
        if (date.getFullYear() === year && date.getMonth() === month && date.getDate() === day) {
          return date;
        }
      }
      return null;
    }
    
    
    return super.parse(value);
  }

  
  override format(date: Date, displayFormat: Object): string {
    if (displayFormat === 'input') {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }
    return super.format(date, displayFormat);
  }
}