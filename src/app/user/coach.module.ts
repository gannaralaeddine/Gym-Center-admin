import {User} from "./user";
import {Activity} from "../activity/activity";


export class CoachModule extends User
{
    coachSpecialities?: Array<Activity>

  // coachSessions?: Array<Session>
}
