import { Injectable } from '@angular/core';
import { AlertSuccessComponent } from "../alert-success/alert-success.component";
import { MatDialog } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export class UtilsService
{

  public API_GYM_CENTER = "http://localhost:8089/gym-center"

  constructor( private matDialog: MatDialog ) { }

  openDialog(title: string, message: string, operationStatus: boolean){
    const popup = this.matDialog.open(AlertSuccessComponent, {
      width: "40%",
      enterAnimationDuration: "1000ms",
      exitAnimationDuration: "1000ms",
      data: { title:  title, message: message, operationStatus: operationStatus }
    })
    popup.afterClosed().subscribe(item =>{
      // console.log("Popup has been closed !")
    })
  }


}
