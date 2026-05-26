import { NgIf } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
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
  imports: [ NgIf, MatFormFieldModule, MatInputModule, MatIconModule, MatPaginatorModule, MatTableModule, MatSortModule],
  templateUrl: './offer.component.html',
  styleUrl: './offer.component.css'
})

export class OfferComponent
{
  dataSource!: MatTableDataSource<any>
  dataSourceBackUp!: MatTableDataSource<any>
  displayedColumns = ['Image','Titre','Activité','Tarif','Gestion']
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
      const popup = this.dialogRef.open(AddOfferComponent, {
        width: "40%",
        height: "90%",
        enterAnimationDuration: "1000ms",
        exitAnimationDuration: "1000ms",
        data: { offerId: id }
      })
      popup.afterClosed().subscribe(() =>{
        this.getAllOffers()
      })

  }

  getAllOffers()
  {
    this.offerService.getAllOffers().subscribe({
      next :(res) => {
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
    this.dataSource = new MatTableDataSource(this.filterByName(this.dataSourceBackUp,filterValue.trim().toLowerCase()))
    this.dataSource.paginator = this.paginator
  }

  goToOfferDetails(offer: any)
  {
    const params = { offerId: offer.offerId }
    void this.router.navigate(["offer-details"], { queryParams: params  })
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

  filterByName(matTableDataSource: MatTableDataSource<any>, filter: string)
  {
    let filteredData = []

    for (let i = 0; i < matTableDataSource.data.length; i++)
    {
      if (matTableDataSource.data[i].offerTitle.trim().toLowerCase().indexOf(filter.trim().toLowerCase()) != -1)
      {
        filteredData.push(matTableDataSource.data[i])
      }
    }

    return filteredData
  }

  deleteOffer(id:any)
  {
      this.utilsService.deletePopup("Supprimer Offre", "En supprimant cette offre, les options associées seront également supprimés.\nÊtes-vous sûr de vouloir continuer ?", "deleteOperation")
      .afterClosed().subscribe(isYesOperation => {
      if (isYesOperation) {
        this.offerService.deleteOffer(id).subscribe({
          complete: () => {
            this.utilsService.successDialog("Opération réussite", "Cette offre à été supprimée avec succès", true)
            this.getAllOffers()
          },
          error:(err) => this.utilsService.successDialog("Opération échouée", err.message, false)
        })
      }
    })
  }
}
