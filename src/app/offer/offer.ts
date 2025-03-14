import { Activity } from "../activity/activity"

import { Option } from "../option/option"
export class Offer
{
    offerId!: number
    offerTitle!: string
    offerPeriod!: number
    offerPrice!: number
    offerActivity!: Activity
    offerOption!: Option[]
}
