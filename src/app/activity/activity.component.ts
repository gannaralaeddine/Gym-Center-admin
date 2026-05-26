import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivityService } from '../services/activity.service';
import { MatDialog } from '@angular/material/dialog';
import { AddActivityComponent } from './add-activity/add-activity.component';
import { Activity } from './activity';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {UtilsService} from "../serviceutils/utils.service";

@Component({
  selector: 'app-activity',
  standalone: true,
  imports: [NgFor, NgIf, MatFormFieldModule, MatInputModule, MatIconModule, MatPaginatorModule, MatTableModule, MatSortModule],
  templateUrl: './activity.component.html',
  styleUrl: './activity.component.css'
})

export class ActivityComponent implements OnInit
{
  activities: any
  dataSource!: MatTableDataSource<any>
  dataSourceBackUp!: MatTableDataSource<any>
  displayedColumns = ['Image','Titre','Catégorie','Gestion']

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private activityService: ActivityService,
    private utilsService: UtilsService,
    private dialogRef: MatDialog,
    private router: Router) {}

  ngOnInit() { this.getAllActivities() }

  getAllActivities()
  {
    this.activityService.getAllActivities().subscribe({
      next :(res) => {
        this.dataSource = new MatTableDataSource(res as any)
        this.dataSource.sort = this.sort
        this.dataSource.paginator = this.paginator
        this.dataSourceBackUp = this.dataSource
      },
      error: (err) => console.error(err)
    })
  }

  deleteActivity(id:any)
  {
    this.utilsService.deletePopup("Supprimer Activité", "En supprimant cette activité, ses sessions associées ainsi que les abonnements seront également supprimés.\nÊtes-vous sûr de vouloir continuer ?", "deleteOperation")
        .afterClosed().subscribe(isYesOperation => {
        if (isYesOperation) {
          this.activityService.deleteActivity(id).subscribe({
            complete: () => {
              this.utilsService.successDialog("Opération réussite", "Cette activité à été supprimée avec succès", true)
              this.getAllActivities()
            },
            error:(err) => this.utilsService.successDialog("Opération échouée", err.message, false)
          })
        }
      })

  }

  addOrUpdateDialog(activityId: number)
  {
    const popup = this.dialogRef.open(AddActivityComponent, {
      width: "40%",
      height: "70%",
      enterAnimationDuration: "1000ms",
      exitAnimationDuration: "1000ms",
      data: { activityId: activityId }
    })
    popup.afterClosed().subscribe(() =>{
      this.getAllActivities()
    })
  }

  goToActivityDetails(activity: Activity)
  {
    const params = { actId: activity.actId }
    void this.router.navigate(["activity-details"], { queryParams: params  }).then()
  }

  getActivityImage(imageName: string): string
  {
    if (imageName)
    {
      return this.utilsService.getImage(imageName)
    }
    else
    {
      return "../assets/img/icons/ic_activity.png"
    }
  }

  applyFilter(event: Event)
  {
    const filterValue = (event.target as HTMLInputElement).value
    this.dataSource.filter = filterValue.trim().toLowerCase()
    if (this.dataSource.paginator) { this.dataSource.paginator.firstPage() }
    this.dataSource = new MatTableDataSource(this.filterByName(this.dataSourceBackUp, filterValue.trim().toLowerCase()))
    this.dataSource.paginator = this.paginator
  }

  filterByName(matTableDataSource: MatTableDataSource<any>, filter: string)
  {
    let filteredData = []

    for (let i = 0; i < matTableDataSource.data.length; i++)
    {
      if (matTableDataSource.data[i].actName.trim().toLowerCase().indexOf(filter.trim().toLowerCase()) != -1)
      {
        filteredData.push(matTableDataSource.data[i])
      }
    }

    return filteredData
  }
}
