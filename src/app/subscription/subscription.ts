import { Activity } from "../activity/activity"
import { User } from "../user/user"

export class Subscription 
{
    subscriptionId!: number
    subscriptionPrice!: number
    subscriptionStartDate!: string
    subscriptionEndDate!: string
    subscriptionActivity!: Activity
    subscriptionMembers!: User
}
