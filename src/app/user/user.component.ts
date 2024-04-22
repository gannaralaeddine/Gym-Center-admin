import { Component, OnInit, ViewChild } from '@angular/core';
import  {UserService } from "../services/user.service";
import { AddCategoryComponent } from "../category/add-category/add-category.component";
import { NgForOf, NgIf, NgOptimizedImage } from "@angular/common";
import { User } from "./user";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import {MatSort, MatSortModule} from '@angular/material/sort';
import { UtilsService } from "../serviceutils/utils.service";
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { EditProfileComponent } from '../profile/edit-profile/edit-profile.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

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
    MatTableModule,
    MatSortModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [UserService],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent implements OnInit
{
    allUsers: any
    user = new User()
    member = new User();
    dataSource!: MatTableDataSource<any>;
    displayedColumns = ['Image','Type de compte', 'E-mail', 'Nom & Prénom','Gestion', 'État']

    @ViewChild(MatPaginator) paginator!: MatPaginator
    @ViewChild(MatSort) sort!: MatSort

    public constructor(
      private userService: UserService,
      private utilsService: UtilsService,
      private router: Router,
      private dialogRef: MatDialog) {
        this.getAllUsersFromApi()
    }

    ngOnInit()
    {

    }

    getAllUsersFromApi()
    {
      this.userService.getAllUsers().subscribe({
        next :(res) => {
          this.allUsers = res
          this.dataSource = new MatTableDataSource(this.allUsers as any)
          this.dataSource.sort = this.sort
          this.dataSource.paginator = this.paginator
          console.log("all users type: " + typeof this.allUsers)
        },
        error: (err) => console.error(err)
      })
    }


    getUserImage(imageName: string): string
    {
        if (imageName)
        {
            return this.utilsService.getImage(imageName)
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

    goToUserProfile(user: User)
    {
      const params = { userEmail: user.userEmail }
      this.router.navigate(["profile"], { queryParams: params  })
    }

    editProfile(user: any)
    {
        const popup = this.dialogRef.open(EditProfileComponent, {
          width: "60%",
          enterAnimationDuration: "1000ms",
          exitAnimationDuration: "1000ms",
          data: { userEmail: user.userEmail }
        })
        popup.afterClosed().subscribe(() =>{
          this.getAllUsersFromApi()
        })
    }

    filterByRole()
    {
        const rolesSelect = document.getElementById("userRoleSelect") as HTMLSelectElement


        switch (rolesSelect.options.selectedIndex)
        {
            case 0:
              { this.getAllUsers(); break }
            case 1:
              { this.getMembers(); break }
            case 2:
              { this.getCoaches(); break }
            case 3:
              { this.getAdmins(); break }
            default:
              { console.log(rolesSelect.options.selectedIndex); break }
        }
    }

    getAllUsers()
    {
        this.dataSource = new MatTableDataSource(this.allUsers as any)
        this.dataSource.sort = this.sort
        this.dataSource.paginator = this.paginator
    }

    getAdmins()
    {
        let admins = []
        for (let i = 0 ; i < this.allUsers.length ; i++)
        {
          if ( this.allUsers[i].roles[0].roleName == "ADMIN" )
          {
            admins.push(this.allUsers[i])
          }
        }
        this.dataSource = new MatTableDataSource(admins as any)
        this.dataSource.sort = this.sort
        this.dataSource.paginator = this.paginator
    }

    getMembers()
    {
        let members = []
        for (let i = 0 ; i < this.allUsers.length ; i++)
        {
            if ( this.allUsers[i].roles[0].roleName == "MEMBER" )
            {
              members.push(this.allUsers[i])
            }
        }
        this.dataSource = new MatTableDataSource(members as any)
        this.dataSource.sort = this.sort
        this.dataSource.paginator = this.paginator
    }

    getCoaches()
    {
        let coaches = []
        for (let i = 0 ; i < this.allUsers.length ; i++)
        {
          if ( this.allUsers[i].roles[0].roleName == "COACH" )
          {
            coaches.push(this.allUsers[i])
          }
        }
        this.dataSource = new MatTableDataSource(coaches as any)
        this.dataSource.sort = this.sort
        this.dataSource.paginator = this.paginator
    }
}
