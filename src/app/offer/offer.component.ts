import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { UtilsService } from '../serviceutils/utils.service';
import { OfferService } from '../services/offer.service.';
import { Router } from '@angular/router';
import { AddOfferComponent } from './add-offer/add-offer.component';

@Component({
  selector: 'app-offer',
  standalone: true,
  imports: [NgFor, NgIf, MatFormFieldModule, MatInputModule, MatIconModule, MatPaginatorModule, MatTableModule, MatSortModule],
  templateUrl: './offer.component.html',
  styleUrl: './offer.component.css'
})
export class OfferComponent
{
  activities: any
  dataSource!: MatTableDataSource<any>
  displayedColumns = ['Tarif','Titre','Activité','Gestion']

  @ViewChild(MatPaginator) paginator!: MatPaginator

  constructor(
    private offerService: OfferService,
    private utilsService: UtilsService,
    private dialogRef: MatDialog,
    private router: Router
    ) {}

    
  ngOnInit()
  {
    this.getAllOffers()
  }

  addOrUpdateDialog(id?: number)
  {
    if (id)
    { 
      const popup = this.dialogRef.open(AddOfferComponent, {
        width: "40%",
        enterAnimationDuration: "1000ms",
        exitAnimationDuration: "1000ms",
        data: { offerId: id }
      })
      popup.afterClosed().subscribe(() =>{
        this.getAllOffers()
      })
    }
  }

  getAllOffers() 
  {
    this.offerService.getAllOffers().subscribe({
      next :(res) => {
        console.log(res)
        this.dataSource = new MatTableDataSource(res as any)
        this.dataSource.paginator = this.paginator
      },
        error: (err) => console.error(err)
      })
  }
  
  applyFilter(event: Event)
  {
    const filterValue = (event.target as HTMLInputElement).value
    this.dataSource.filter = filterValue.trim().toLowerCase()
    if (this.dataSource.paginator) { this.dataSource.paginator.firstPage() }
  }
}

