import { Component } from '@angular/core';
import {UserService} from "../services/user.service";
import {AddCategoryComponent} from "../category/add-category/add-category.component";
import {NgForOf, NgOptimizedImage} from "@angular/common";

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    AddCategoryComponent,
    NgForOf,
    NgOptimizedImage
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent
{

    usersList: any
    public constructor(private userService: UserService) {
        this.getAllUsers()
    }


    getAllUsers()
    {
        this.userService.getAllUsers().subscribe({
          next :(val)=> this.usersList = val,
          error: (err) => console.error(err)
        })
    }


}
