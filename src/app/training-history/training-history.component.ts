import { trigger, state, style, transition, animate } from '@angular/animations';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { TrainingHistoryService } from '../services/training-history.service';
import { UtilsService } from '../serviceutils/utils.service';
import { Router } from '@angular/router';
import { HistoryObject } from './history-object';
import { DatePipe } from '@angular/common';


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
  imports: [MatTableModule, MatButtonModule, MatIconModule, DatePipe]
})


export class TrainingHistoryComponent  
{

  dataSource!: any
  columnsToDisplay = ['image', 'full name', 'management']
  trainingHistoryColumns: string[] = ['date', 'checkin time', 'checkout time']
  trainingHistoryDataSource: HistoryObject[] = []
  userTrainingHistories!: HistoryObject[]
  columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand']
  expandedElement?: HistoryObject | null

  constructor(
    private trainingHistoryService: TrainingHistoryService, 
    private utilsService: UtilsService, 
    private router: Router) 
  {
    this.trainingHistoryService.getAllTrainingHistories().subscribe({
      next: (element: any) => {
        this.dataSource = element
        element.forEach((trainingHistory: any) => {
          // let historyObject = new HistoryObject(trainingHistory.checkInTime.split("T")[0], trainingHistory.checkInTime.split("T")[1].substring(0,5), trainingHistory.checkOutTime.split("T")[1].substring(0,5))
          this.trainingHistoryDataSource.push(trainingHistory)
        })
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

  goToUserProfile(email:any)
  {
    const params = { userEmail: email }
    this.router.navigate(["profile"], {queryParams: params}).then()
  }

  showUserTrainingHistories(userId: any)
  {
    this.userTrainingHistories = []

    this.trainingHistoryDataSource.forEach((element: any) => {
      if (element.user.userId === userId)
      {
        this.userTrainingHistories.push(element)
      }
    })
  
    console.log(this.userTrainingHistories)
  }
}
