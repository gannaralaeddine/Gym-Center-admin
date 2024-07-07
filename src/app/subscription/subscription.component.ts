import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { SubscriptionService } from '../services/subscription.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UtilsService } from '../serviceutils/utils.service';
import { AddSubscriptionComponent } from './add-subscription/add-subscription.component';

@Component({
  selector: 'app-subscription',
  standalone: true,
  imports: [NgFor, NgIf, MatFormFieldModule, MatInputModule, MatIconModule, MatPaginatorModule, MatTableModule, MatSortModule],
  templateUrl: './subscription.component.html',
  styleUrl: './subscription.component.css'
})
export class SubscriptionComponent implements OnInit 
{
  activities: any
  dataSource!: MatTableDataSource<any>;
  displayedColumns = ['Image','Activité','Prix','Gestion']

  @ViewChild(MatPaginator) paginator!: MatPaginator
  
  constructor(private subscriptionService: SubscriptionService,
    private utilsService: UtilsService,
    private dialogRef: MatDialog,
    private router: Router){}

  ngOnInit()
  {
    this.getAllSubscriptions()
  }

  applyFilter(event: Event)
  {
    const filterValue = (event.target as HTMLInputElement).value
    this.dataSource.filter = filterValue.trim().toLowerCase()
    if (this.dataSource.paginator) { this.dataSource.paginator.firstPage() }
  }

  getAllSubscriptions()
  {
    this.subscriptionService.getAllSubscriptions().subscribe({
      next :(res) => {
        this.dataSource = new MatTableDataSource(res as any)
        this.dataSource.paginator = this.paginator
      },
      error: (err) => console.error(err)
    })
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
  
  addOrUpdateDialog(subscriptionId: any)
  {
    const popup = this.dialogRef.open(AddSubscriptionComponent, {
      width: "40%",
      enterAnimationDuration: "1000ms",
      exitAnimationDuration: "1000ms",
      data: { subscriptionId: subscriptionId }
    })
    popup.afterClosed().subscribe(() =>{
      this.getAllSubscriptions()
    })
  }
  goToSubscriptionDetails(subscription: any)
  {
    const params = { subscriptionId: subscription.subscriptionId }
    this.router.navigate(["subscription-details"], { queryParams: params  })
  }

  deleteSubscription(id: any) 
  {
    this.utilsService.deletePopup("Supprimer Abonnement", "Êtes-vous sûr de vouloir continuer ?", "deleteOperation")
    .afterClosed().subscribe(isYesOperation => {
      if (isYesOperation) {
        this.subscriptionService.deleteSubscription(id).subscribe({
          complete: () => this.ngOnInit(),
          error:(err)=> console.error(err)
        })
      }
    })
  }
}
