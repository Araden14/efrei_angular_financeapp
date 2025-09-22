import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'categoryIcon',
  standalone: true
})
export class CategoryIconPipe implements PipeTransform {
  private iconMap: { [key: string]: string } = {
    'shopping_cart': '🛒',
    'flash_on': '⚡',
    'directions_car': '🚗',
    'local_hospital': '🏥',
    'movie': '🎬',
    'restaurant': '🍽️',
    'school': '🎓',
    'spa': '💆',
    'checkroom': '👕',
    'home': '🏠',
    'more_horiz': '⋯'
  };

  transform(iconName: string): string {
    return this.iconMap[iconName] || '📁';
  }
}
