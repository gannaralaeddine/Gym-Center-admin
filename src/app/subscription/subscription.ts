import { Activity } from "../activity/activity"
import { Offer } from "../offer/offer"
import { User } from "../user/user"
import {Member} from "../user/Member";

export class Subscription
{
    subscriptionId!: number
    subscriptionPrice!: number
    subscriptionStartDate!: string
    subscriptionEndDate!: string
    subscriptionActivity!: Activity
    member!: Member
    subscriptionOffer!: Offer
}
