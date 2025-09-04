import { Category } from "../../../data/categories"
export interface Transaction {
    id : string
    category : Category
    amount : number
    date : Date
    name : string
    type : 'income' | 'expense'
    frequency : 'once' | 'monthly' | 'yearly' | 'weekly' | 'none'
    userId : number
    createdAt : Date
    updatedAt : Date
}