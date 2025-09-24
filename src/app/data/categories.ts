export interface Category {
    name: string;
    icon: string;
}

export const categories: Category[] = [
    { name: 'Food', icon: 'shopping_cart' },
    { name: 'Public services', icon: 'flash_on' },
    { name: 'Transport', icon: 'directions_car' },
    { name: 'Health', icon: 'local_hospital' },
    { name: 'Entertainment', icon: 'movie' },
    { name: 'Restaurant', icon: 'restaurant' },
    { name: 'Education', icon: 'school' },
    { name: 'Personal care', icon: 'spa' },
    { name: 'Clothing', icon: 'checkroom' },
    { name: 'Housing', icon: 'home' },
    {name: 'Other', icon: 'more_horiz'}
];
