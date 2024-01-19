import {Component, OnInit, ViewChild} from '@angular/core';
import {UserService} from "../services/user.service";
import {AddCategoryComponent} from "../category/add-category/add-category.component";
import {NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {User} from "./user";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    AddCategoryComponent,
    NgForOf,
    NgOptimizedImage,
    NgIf,
    MatFormFieldModule, 
    MatInputModule, 
    MatIconModule, 
    MatPaginatorModule, 
    MatTableModule
  ],
  providers: [UserService],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent implements OnInit
{
    user = new User()
    member = new User();
    usersList: any
    dataSource!: MatTableDataSource<any>;
    displayedColumns = ['Image','Type de compte', 'E-mail', 'Nom & Prénom','Gestion']

    @ViewChild(MatPaginator) paginator!: MatPaginator
    @ViewChild(MatSort) sort!: MatSort
    
    public constructor(private userService: UserService) {
        this.getAllUsers()
    }

    ngOnInit()
    {

    }

    // getAllUsers()
    // {
    //     this.userService.getAllUsers().subscribe({
    //       next :(val)=> this.usersList = val,
    //       error: (err) => console.error(err)
    //     })
    // }

    getAllUsers()
    {
      this.userService.getAllUsers().subscribe({
        next :(res) => {
          this.dataSource = new MatTableDataSource(res as any)
          this.dataSource.sort = this.sort
          this.dataSource.paginator = this.paginator
        },
        error: (err) => console.error(err)
      })
    }

    getUserImage(imageName: string): string
    {
        if (imageName)
        {
            return this.userService.getImage(imageName)
        }
        else
        {
            return "../assets/img/icons/ic_user_tie.svg"
        }
    }

    applyFilter(event: Event) 
    {
      const filterValue = (event.target as HTMLInputElement).value
      this.dataSource.filter = filterValue.trim().toLowerCase()
      if (this.dataSource.paginator) { this.dataSource.paginator.firstPage() }
    }

}
