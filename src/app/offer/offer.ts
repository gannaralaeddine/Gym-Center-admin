import { Activity } from "../activity/activity"

import { Option } from "../option/option"
import {Member} from "../user/Member";
export class Offer
{
    offerId!: number
    offerTitle!: string
    offerPeriod!: number
    offerPrice!: number
    offerActivity!: Activity
    offerOption!: Option[]
    members!: Member[]
}
