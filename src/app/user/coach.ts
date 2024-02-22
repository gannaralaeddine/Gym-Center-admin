import {User} from "./user";
import {Activity} from "../activity/activity";

export class Coach extends User
{
  coachSpecialities!: Activity[]
}
