import { NgIf } from '@angular/common';
import { Component, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { OptionService } from '../services/option.service';
import { Option } from './option';
import { UtilsService } from '../serviceutils/utils.service';

@Component({
  selector: 'app-option',
  standalone: true,
  imports: [NgIf, MatInputModule, MatIconModule, MatPaginatorModule, MatTableModule],
  templateUrl: './option.component.html',
  styleUrl: './option.component.css'
})

export class OptionComponent implements OnInit
{

  dataSource!: MatTableDataSource<any>
  dataSourceBackUp!: MatTableDataSource<any>
  displayedColumns = ['Titre', 'Gestion']
  @ViewChild(MatPaginator) paginator!: MatPaginator
  option = new Option()
  isValid = true
  
  constructor(private optionService: OptionService,private utilsService: UtilsService) {}

  ngOnInit()
  {
    this.optionService.getAllOptions().subscribe({
      next: (options) => {
        this.dataSource = new MatTableDataSource(options)
        this.dataSource.paginator = this.paginator
        this.dataSourceBackUp = this.dataSource
      },
      error: (err) => console.error(err)
    })
  }

  applyFilter() 
  {
    const filterValue = (document.getElementById('optionSearch') as HTMLInputElement).value
    this.dataSource.filter = filterValue.trim().toLowerCase()
    if (this.dataSource.paginator) { this.dataSource.paginator.firstPage() }
    this.filterByName(this.dataSourceBackUp, filterValue.trim().toLowerCase())
    this.dataSource.paginator = this.paginator
  }

  addOrUpdateDialog(arg0: any) 
  {
    
  }

  addOption()
  {
    if (this.isValid)
    {
      this.option.optionName = (document.getElementById('optionSearch') as HTMLInputElement).value;
      (document.getElementById('optionSearch') as HTMLInputElement).value = ''
      this.optionService.addOption(this.option).subscribe({
        next:() => {
          this.utilsService.successDialog("Opération réussite", "Option ajoutée avec succès", true)
          this.ngOnInit()
        },
        error: (err)=> this.utilsService.successDialog("Opération échouée", err.message, false) 
      })
    }
  }

  isValidName()
  {
    
      if ((document.getElementById('optionSearch') as HTMLInputElement).value.length === 0)
      {
        this.isValid = false
        document.getElementById("addButton")?.setAttribute("disabled","")
      }
      else
      {
        this.isValid = true
        document.getElementById("addButton")?.removeAttribute("disabled")
      }
  }

  filterByName(matTableDataSource: MatTableDataSource<any>, filter: string)
  {
    let filteredData = []

    for (let i = 0; i < matTableDataSource.data.length; i++) 
    {
      if (matTableDataSource.data[i].optionName.trim().toLowerCase().indexOf(filter.trim().toLowerCase()) != -1)
      {
        filteredData.push(matTableDataSource.data[i])
      }
    }

    return filteredData
  }
}
