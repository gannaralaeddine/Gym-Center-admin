import { Activity } from "../activity/activity"
import { FileHandleModule } from "../file-handle/file-handle.module"
import { User } from "../user/user"

export class Session
{
    sessionId!: number
    sessionName!: string
    sessionDescription!: string
    sessionActivity!: Activity
    sessionCoach!: User
    sessionImage!: string
    sessionImages!: FileHandleModule[]
}
