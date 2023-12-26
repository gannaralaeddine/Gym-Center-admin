export class User
{
  userId!:number
  userEmail!: string
  userFirstName!: string
  userLastName!: string
  userBirthDate! : string
  userPhoneNumber! : string
  userCity! : string
  userState! : string
  userCountry! : string
  userGender! : string
  userHeight! : string
  userWeight! : string
  userPicture! : string
  userZipCode! : string

  constructor(userEmail:string, userFirstName: string, userLastName: string, userBirthDate: string, userPhoneNumber : string, userCity : string, userState : string, userCountry : string, userGender : string,
  userHeight : string, userWeight : string, userPicture : string, userZipCode : string)
  {
    this.userEmail = userEmail
    this.userFirstName = userFirstName
    this.userLastName = userLastName
    this.userBirthDate = userBirthDate
    this.userPhoneNumber = userPhoneNumber
    this.userCity = userCity
    this.userState = userState
    this.userCountry = userCountry
    this.userGender = userGender
    this.userHeight = userHeight
    this.userWeight = userWeight
    this.userPicture = userPicture
    this.userZipCode = userZipCode

  }


}
