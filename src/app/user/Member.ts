import {User} from "./user";
import {Offer} from "../offer/offer";

export class Member extends User
{
  offers!: Offer[]
}
