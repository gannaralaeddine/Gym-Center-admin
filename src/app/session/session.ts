import { Activity } from "../activity/activity"
import { User } from "../user/user"

export class Session 
{
    sessionId!: number
    sessionName!:string
    sessionActivity!: Activity
    sessionCoach!: User
    sessionImage!: string

    constructor(name:string, activity: Activity, coach: User)
    {
        this.sessionName = name
        this.sessionActivity = activity
        this.sessionCoach = coach
    }
}
