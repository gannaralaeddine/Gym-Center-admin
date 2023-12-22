import {Component, OnInit} from '@angular/core';
import { CategoryService } from '../services/category.service';
import { HttpClientModule } from "@angular/common/http";

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [ HttpClientModule  ],
  providers: [ CategoryService ],
  templateUrl: './category.component.html',
  styleUrl: './category.component.css'
})
export class CategoryComponent implements OnInit
{


  public constructor(private categoryService: CategoryService) {}

  ngOnInit() { this.getAllCategories() }


  getAllCategories()
  {
    this.categoryService.getAllCategories().subscribe({
      next :(val)=> console.log(val),
      error: (err) => console.log(err)
    })

  }
}
