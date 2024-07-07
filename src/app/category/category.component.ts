import { Component, OnInit, ViewChild } from '@angular/core';
import { CategoryService } from '../services/category.service';
import { NgFor, NgIf } from '@angular/common';
import { AddCategoryComponent } from "./add-category/add-category.component";
import { Category } from './category';
import { MatDialog } from '@angular/material/dialog';
import {Router, RouterLink} from "@angular/router";
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {UtilsService} from "../serviceutils/utils.service";


@Component({
    selector: 'app-category',
    standalone: true,
    templateUrl: './category.component.html',
    styleUrl: './category.component.css',
  imports: [NgFor, AddCategoryComponent, NgIf, RouterLink, MatFormFieldModule, MatInputModule, MatIconModule, MatPaginatorModule, MatTableModule, MatSortModule]
})
export class CategoryComponent implements OnInit
{
  categories: any
  isCategoryUpdated!: Boolean
  category!: Category
  dataSource!: MatTableDataSource<any>;
  dataSourceBackUp!: MatTableDataSource<any>;
  displayedColumns = ['Image','Titre','Gestion']
  @ViewChild(MatPaginator) paginator!: MatPaginator
  @ViewChild(MatSort) sort!: MatSort

  public constructor(
    private categoryService: CategoryService,
    private utilsService: UtilsService,
    private dialogRef: MatDialog,
    private router: Router)
  {
    this.isCategoryUpdated = false
  }


  ngOnInit() { this.getAllCategories() }

  getAllCategories()
  {
    this.categoryService.getAllCategories().subscribe({
      next :(res) => {
        this.dataSource = new MatTableDataSource(res as any)
        this.dataSource.sort = this.sort
        this.dataSource.paginator = this.paginator
        this.dataSourceBackUp = this.dataSource
      },
      error: (err) => console.error(err)
    })
  }

  deleteCategory(id:any)
  {
      this.utilsService.deletePopup("Supprimer Catégorie", "En supprimant cette catégorie, ses activités et les sessions associées ainsi que les abonnements seront également supprimés.\nÊtes-vous sûr de vouloir continuer ?", "deleteOperation")
      .afterClosed().subscribe(isYesOperation => {
      if (isYesOperation) {
        this.categoryService.deleteCategory(id).subscribe({
          complete: () => this.getAllCategories(),
          error:(err)=> console.error(err)
        })
      }
    })
  }


  getCategoryImage(imageName: string): string
  {
    if (imageName)
    {
      return this.utilsService.getImage(imageName)
    }
    else
    {
      return "../assets/img/icons/ic_category.png"
    }

  }


  addOrUpdateDialog(categoryId: number)
  {

    const popup = this.dialogRef.open(AddCategoryComponent, {
      width: "40%",
      enterAnimationDuration: "1000ms",
      exitAnimationDuration: "1000ms",
      data: { categoryId: categoryId }
    })
    popup.afterClosed().subscribe(() =>{
      this.getAllCategories()
    })
  }

  goToCategoryDetails(category: Category)
  {
    const params = { catId: category.catId }

    this.router.navigate(["category-details"], { queryParams: params  })
  }

  applyFilter(event: Event)
  {
    const filterValue = (event.target as HTMLInputElement).value
    this.dataSource.filter = filterValue.trim().toLowerCase()
    if (this.dataSource.paginator) { this.dataSource.paginator.firstPage() }
    this.dataSource = new MatTableDataSource(this.filterByName(this.dataSourceBackUp,filterValue.trim().toLowerCase()))
    this.dataSource.paginator = this.paginator
  }

  filterByName(matTableDataSource: MatTableDataSource<any>, filter: string)
  {
    let filteredData = []

    for (let i = 0; i < matTableDataSource.data.length; i++) 
    {
      if (matTableDataSource.data[i].catName.trim().toLowerCase().indexOf(filter.trim().toLowerCase()) != -1)
      {
        filteredData.push(matTableDataSource.data[i])
      }
    }

    return filteredData
  }

  showDeletePopup()
  {
    
  }
}
