export class Category 
{
    catId!:number
    catName!: string
    catDescription!: string
    catImage!: string

    constructor(name:string, description: string, image: string)
    {
        this.catName = name
        this.catDescription = description
        this.catImage = image
    }

}
