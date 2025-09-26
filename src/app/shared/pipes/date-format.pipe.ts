import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateFormat',
  standalone: true
})
export class DateFormatPipe implements PipeTransform {
  transform(value: string | Date, format = 'short'): string {
    if (!value) return '';

    const date = new Date(value);

    switch (format) {
      case 'short':
        return date.toLocaleDateString('fr-FR');
      case 'long':
        return date.toLocaleDateString('fr-FR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      case 'datetime':
        return date.toLocaleString('fr-FR', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      default:
        return date.toLocaleDateString('fr-FR');
    }
  }
}
