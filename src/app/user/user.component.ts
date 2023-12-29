import {Component, OnInit} from '@angular/core';
import {UserService} from "../services/user.service";
import {AddCategoryComponent} from "../category/add-category/add-category.component";
import {NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {User} from "./user";

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    AddCategoryComponent,
    NgForOf,
    NgOptimizedImage,
    NgIf
  ],
  providers: [UserService],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent implements OnInit
{
    member = new User();
    usersList: any

    public constructor(private userService: UserService) {
        this.getAllUsers()
    }

    ngOnInit()
    {

    }

    getAllUsers()
    {
        this.userService.getAllUsers().subscribe({
          next :(val)=> this.usersList = val,
          error: (err) => console.error(err)
        })
    }



}
