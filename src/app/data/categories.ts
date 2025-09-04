export interface Category {
    name: string;
    icon: string;
}

export const categories: Category[] = [
    { name: 'Groceries', icon: 'shopping_cart' },
    { name: 'Utilities', icon: 'flash_on' },
    { name: 'Transportation', icon: 'directions_car' },
    { name: 'Healthcare', icon: 'local_hospital' },
    { name: 'Entertainment', icon: 'movie' },
    { name: 'Dining Out', icon: 'restaurant' },
    { name: 'Education', icon: 'school' },
    { name: 'Personal Care', icon: 'spa' },
    { name: 'Clothing', icon: 'checkroom' },
    { name: 'Housing', icon: 'home' }
];
