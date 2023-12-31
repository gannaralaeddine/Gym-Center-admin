import { Component } from '@angular/core';

@Component({
  selector: 'app-details-category',
  standalone: true,
  imports: [],
  templateUrl: './details-category.component.html',
  styleUrl: './details-category.component.css'
})
export class DetailsCategoryComponent
{

    categoryTitle = "Titre de catégorie"
    categoryDescription = "Hi, I’m Alec Thompson, Decisions: If you can’t decide, the answer is no. If two equally difficult paths, choose the one more painful in the short term (pain avoidance is creating an illusion of equality)."

}
