import { Category } from "../../../data/categories"
export interface Transaction {
    id : string
    category : Category
    amount : number
    currency : string
    date : Date
    description : string
    type : 'income' | 'expense'
    frequency : 'once' | 'monthly' | 'yearly' | 'weekly' | 'none'
    userId : number
    createdAt : Date
    updatedAt : Date
    recurringDate? : Date
    recurringDay? : number
    recurringMonth? : number
    recurringYear? : number
}