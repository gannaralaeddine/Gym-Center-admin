import { Category } from "../category/category"
import {FileHandleModule} from "../file-handle/file-handle.module";
import { User } from "../user/user";

export class Activity
{
    actId!: number
    actName!: string
    actDescription!: string
    actImage!: string
    category!: Category
    actImages!: FileHandleModule[]
    actCoaches!: User[]

    constructor (name:string, description: string, image: string,cat:Category, actImages: FileHandleModule[])
    {
        this.actName = name
        this.actDescription = description
        this.actImage = image
        this.category = cat
        this.actImages = actImages
    }
}
