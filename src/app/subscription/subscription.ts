import { Activity } from "../activity/activity"
import { Offer } from "../offer/offer"
import { User } from "../user/user"

export class Subscription
{
    subscriptionId!: number
    subscriptionPrice!: number
    subscriptionStartDate!: string
    subscriptionEndDate!: string
    subscriptionActivity!: Activity
    subscriptionMember!: User
    subscriptionOffer!: Offer
}
