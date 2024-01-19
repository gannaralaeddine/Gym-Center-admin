import {Component, EventEmitter, Input, Output} from '@angular/core';
import {animate, state, style, transition, trigger} from "@angular/animations";
import {ActivityService} from "../services/activity.service";
import {NgIf, NgOptimizedImage} from "@angular/common";
import {MatDialog} from "@angular/material/dialog";
import {UtilsService} from "../serviceutils/utils.service";
import {UserService} from "../services/user.service";
import {SessionService} from "../services/session.service";

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
  @Input()classToDelete: any
  @Output() onDataChange = new EventEmitter<boolean>();

  flip: string = 'inactive';

  constructor(private activityService: ActivityService, private userService: UserService, private sessionService: SessionService,
              private matDialog: MatDialog, private utilsService: UtilsService) {  }


  toggleFlip() {
    this.flip = (this.flip == 'inactive') ? 'active' : 'inactive';
  }


  getActivityImage(imageName: string)
  {
    return this.utilsService.getImage(imageName)
  }


  deleteImage()
  {
      this.utilsService.deletePopup()
        .afterClosed().subscribe(isDeleteOperation =>{
        if (isDeleteOperation)
        {
            switch (this.classToDelete)
            {
              case "deleteActivityImage":
                  { this.deleteActivityImage(); break }
              case "deleteProfileImage":
                  { this.deleteProfileImage(); break }
              case "deleteSessionImage":
                  { this.deleteSessionImage(); break }
              default:
                  console.log("nothing to delete switch default case")
            }
        }
      })
  }


  deleteActivityImage()
  {
    this.activityService.deleteActivityImage(this.classId, this.imageName).subscribe({
      next: () => this.onDataChange.emit(true) ,
      error: (err) => console.log("Error deleting activity image" + err)
    })
  }

  deleteSessionImage()
  {
    this.sessionService.deleteSessionImage(this.classId, this.imageName).subscribe({
      next: () => this.onDataChange.emit(true) ,
      error: (err) => console.log("Error deleting activity image" + err)
    })
  }

  deleteProfileImage()
  {
    // this.userService.del(this.classId, this.imageName).subscribe({
    //   next: () => this.onDataChange.emit(true) ,
    //   error: (err) => console.log("Error deleting activity image" + err)
    // })
  }
}
