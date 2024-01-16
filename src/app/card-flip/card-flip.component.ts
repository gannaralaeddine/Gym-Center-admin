import {Component, EventEmitter, Input, Output} from '@angular/core';
import {animate, state, style, transition, trigger} from "@angular/animations";
import {ActivityService} from "../services/activity.service";
import {NgIf, NgOptimizedImage} from "@angular/common";
import {MatDialog} from "@angular/material/dialog";
import {UtilsService} from "../serviceutils/utils.service";

@Component({
  imports: [
    NgOptimizedImage,
    NgIf
  ],
    selector: 'app-card-flip',
    standalone: true,
    styleUrl: './card-flip.component.css',
    templateUrl: './card-flip.component.html',
    animations: [
      trigger('flipState', [
        state('active', style({
          transform: 'rotateY(179deg)'
        })),
        state('inactive', style({
          transform: 'rotateY(0)'
        })),
        transition('active => inactive', animate('500ms ease-out')),
        transition('inactive => active', animate('500ms ease-in'))
      ])
    ]
})
export class CardFlipComponent
{
  @Input()imageName: any
  @Input()classId: any
  @Output() onDataChange = new EventEmitter<boolean>();

  flip: string = 'inactive';

  constructor(private activityService: ActivityService, private matDialog: MatDialog, private utilsService: UtilsService) { }


  toggleFlip() {
    this.flip = (this.flip == 'inactive') ? 'active' : 'inactive';
  }


  getActivityImage(imageName: string)
  {
    return this.activityService.getActivityImage(imageName)
  }


  deleteActivityImage()
  {
      this.utilsService.deletePopup()
        .afterClosed().subscribe(isDeleteOperation =>{
        if (isDeleteOperation)
        {
          this.activityService.deleteActivityImage(this.classId, this.imageName).subscribe({
            next: () => this.onDataChange.emit(true) ,
            error: (err) => console.log("Error deleting activity image" + err)
          })
        }
      })
  }


}
