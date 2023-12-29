import {Role} from "./role";

export class User
{
  userId?: number
  userEmail?: string
  userFirstName?: string
  userLastName?: string
  userBirthDate? : string
  userPhoneNumber? : string
  userCity? : string
  userState? : string
  userCountry? : string
  userGender? : string
  userHeight? : string
  userWeight? : string
  userPicture? : string
  userZipCode? : string
  userPassword? : string
  roles?: Array<Role>
}
