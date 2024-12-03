import { trigger, state, style, transition, animate } from '@angular/animations';
import { Component, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { TrainingHistoryService } from '../services/training-history.service';
import { UtilsService } from '../serviceutils/utils.service';
import { Router } from '@angular/router';
import { HistoryObject } from './history-object';
import { DatePipe, NgIf } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';


@Component({
  selector: 'app-training-history',
  templateUrl: './training-history.component.html',
  styleUrl: './training-history.component.css',
  animations: [
    trigger('detailExpand', [
      state('collapsed,void', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
  standalone: true,
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    DatePipe,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatPaginatorModule,
    MatTableModule,
    MatSortModule,
    NgIf,
    ReactiveFormsModule
  ]
})


export class TrainingHistoryComponent
{
  usersDataSource!: MatTableDataSource<any>
  usersDataSourceBackUp!: MatTableDataSource<any>

  allTrainingHistoriesTable: HistoryObject[] = []

  userTrainingHistoriesTable!: HistoryObject[]
  userTrainingHistoriesTableBackUp!: HistoryObject[]

  columnsToDisplay = ['image', 'full name', 'management']
  trainingHistoryColumns: string[] = ['date', 'checkin time', 'checkout time']
  columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand']
  expandedElement?: HistoryObject | null
  @ViewChild(MatPaginator) paginator!: MatPaginator
  dateFilterFormValue !: FormGroup
  
  constructor(
    private trainingHistoryService: TrainingHistoryService,
    private utilsService: UtilsService,
    private dateFilterFormBuilder: FormBuilder,
    private router: Router)
  {
    this.trainingHistoryService.getAllTrainingHistories().subscribe({
      next: (element: any) => {
        element.forEach((trainingHistory: any) => {
          this.allTrainingHistoriesTable.push(trainingHistory)
        })
      },
      error: (err) => console.error(err)
    })

    this.trainingHistoryService.getAllDistinctUsers().subscribe({
      next: (element: any) => {
        this.usersDataSource = new MatTableDataSource(element)
        this.usersDataSourceBackUp = this.usersDataSource
      },
      error: (err) => console.error(err)
    })

    this.dateFilterFormValue = this.dateFilterFormBuilder.group({
      dateFilterValue : ['']
    })
  }

  applyFilter(event: Event)
  {
    const filterValue = (event.target as HTMLInputElement).value
    this.usersDataSource = new MatTableDataSource(this.filterByName(this.usersDataSourceBackUp,filterValue.trim().toLowerCase()))
    this.usersDataSource.paginator = this.paginator
  }

  filterByName(matTableDataSource: MatTableDataSource<any>, filter: string)
  {
    let filteredData = []

    for (let i = 0; i < matTableDataSource.data.length; i++)
    {
      let userFullName = (matTableDataSource.data[i].userLastName + " " + matTableDataSource.data[i].userFirstName).trim().toLowerCase()

      if (userFullName.indexOf(filter.trim().toLowerCase()) != -1)
      {
        filteredData.push(matTableDataSource.data[i])
      }
    }

    return filteredData
  }

  
  filterByDate()
  {
    let filteredData = []

    for (let i = 0; i < this.userTrainingHistoriesTableBackUp.length; i++)
    {
      let date = new Date(this.userTrainingHistoriesTableBackUp[i].checkInTime).toISOString().split('T')[0]
      
      if (date.indexOf(this.dateFilterFormValue.value.dateFilterValue) != -1)
      {
        filteredData.push(this.userTrainingHistoriesTableBackUp[i])
      }
    }

    this.userTrainingHistoriesTable = filteredData
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

  goToUserProfile(email:any)
  {
    const params = { userEmail: email }
    this.router.navigate(["profile"], {queryParams: params}).then()
  }

  showUserTrainingHistories(userId: any)
  {
    this.dateFilterFormValue.controls['dateFilterValue'].setValue("")
    this.userTrainingHistoriesTable = []

    this.allTrainingHistoriesTable.forEach((element: any) => {
      if (element.user.userId == userId)
      {
        this.userTrainingHistoriesTable.push(element)
      }
    })

    this.userTrainingHistoriesTableBackUp = this.userTrainingHistoriesTable
  }
}
