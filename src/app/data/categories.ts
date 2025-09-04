export interface Category {
    name: string;
    icon: string;
}

export const categories: Category[] = [
    { name: 'Alimentation', icon: 'shopping_cart' },
    { name: 'Services publics', icon: 'flash_on' },
    { name: 'Transport', icon: 'directions_car' },
    { name: 'Santé', icon: 'local_hospital' },
    { name: 'Divertissement', icon: 'movie' },
    { name: 'Restauration', icon: 'restaurant' },
    { name: 'Éducation', icon: 'school' },
    { name: 'Soins personnels', icon: 'spa' },
    { name: 'Vêtements', icon: 'checkroom' },
    { name: 'Logement', icon: 'home' },
    {name: 'Autre', icon: 'more_horiz'}
];
