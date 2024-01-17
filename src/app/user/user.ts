import {Role} from "./role";
import {FileHandleModule} from "../file-handle/file-handle.module";

export class User
{
  userId?: number
  userEmail?: string
  userFirstName!: string
  userLastName!: string
  userBirthDate? : Date
  userPhoneNumber? : string
  userDescription?: string
  userGender? : string
  userHeight? : string
  userWeight? : string
  userPicture? : string
  userCountry? : string
  userState? : string
  userCity? : string
  userZipCode? : string
  userPassword? : string
  roles?: Array<Role>
  userImages!: FileHandleModule[]
}
