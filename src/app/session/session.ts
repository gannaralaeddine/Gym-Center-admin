import { Activity } from "../activity/activity"
import { FileHandleModule } from "../file-handle/file-handle.module"
import { User } from "../user/user"

export class Session 
{
    sessionId!: number
    sessionName!: string
    sessionActivity!: Activity
    sessionCoach!: User
    sessionImage!: string
    sessionImages!: FileHandleModule[]

    /*constructor(name:string, activity: Activity, coach: User, image: string, images: FileHandleModule[])
    {
        this.sessionName = name
        this.sessionActivity = activity
        this.sessionCoach = coach
        this.sessionImage = image
        this.sessionImages = images
    }*/
}
