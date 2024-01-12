import {FileHandleModule} from "../file-handle/file-handle.module";

export class Category
{
    catId!:number
    catName!: string
    catDescription!: string
    catImage!: string
    catImages!: FileHandleModule[]

    // constructor(catName: string, catDescription: string, catImage: string, catImages: FileHandleModule[])
    // {
    //     this.catName = catName
    //     this.catDescription = catDescription
    //     this.catImage = catImage
    //     this.catImages = catImages
    // }

}
