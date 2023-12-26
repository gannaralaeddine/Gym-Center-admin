import { Component } from '@angular/core';
import {UserService} from "../services/user.service";

@Component({
  selector: 'app-dashbord',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent
{

    numberOfUsers : any

    public constructor(private userService: UserService) {
      this.getNumberOfUsers()
    }

    getNumberOfUsers()
    {
        this.userService.getNumberOfUsers().subscribe({
          next :(val)=> this.numberOfUsers = val,
          error: (err) => console.error(err)
        })

    }
}
