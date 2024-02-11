import { NgIf } from '@angular/common';
import { Component, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
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
  displayedColumns = ['Titre', 'Gestion']
  @ViewChild(MatPaginator) paginator!: MatPaginator
  option = new Option()
  
  constructor(private optionService: OptionService,private utilsService: UtilsService) {}

  ngOnInit()
  {
    this.optionService.getAllOptions().subscribe({
      next: (options) => {
        console.log(options)
        this.dataSource = new MatTableDataSource(options)
        this.dataSource.paginator = this.paginator
      },
      error: (err) => console.error(err)
    })

    document.addEventListener("keyup", function(event)
    {
      console.log(event)
    })
  }

  applyFilter() 
  {
    const filterValue = (document.getElementById('optionSearch') as HTMLInputElement).value
    this.dataSource.filter = filterValue.trim().toLowerCase()
    if (this.dataSource.paginator) { this.dataSource.paginator.firstPage() }
  }

  addOrUpdateDialog(arg0: any) 
  {
    
  }

  addOption()
  {
    this.option.optionName = (document.getElementById('optionSearch') as HTMLInputElement).value
    this.optionService.addOption(this.option).subscribe({
      next:() => {
        //this.dialogRef.close()
        this.utilsService.successDialog("Opération réussite", "Option ajoutée avec succès", true)
        this.ngOnInit()
      },
      error: (err)=> this.utilsService.successDialog("Opération échouée", err.message, false) 
    })

  }


}
