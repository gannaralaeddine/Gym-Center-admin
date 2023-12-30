import { Category } from "../category/category"

export class Activity 
{
    actId!: number
    actName!: string
    actDescription!: string
    actImage!: string
    category!: Category

    constructor (name:string, description: string, image: string)
    {
        this.actName = name
        this.actDescription = description
        this.actImage = image
    }
}
