import { Category } from "../../../data/categories"
export interface Transaction {
    id : string
    category : Category
    amount : number
    date : Date
    name : string
    type : 'income' | 'expense'
    userId : number
    createdAt : Date
    updatedAt : Date
}