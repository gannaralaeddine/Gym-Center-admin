import { Injectable } from '@angular/core';
import { AlertSuccessComponent } from "../alert-success/alert-success.component";
import { MatDialog } from '@angular/material/dialog';
import {AlertDeleteComponent} from "../alert-delete/alert-delete.component";

@Injectable({
  providedIn: 'root'
})
export class UtilsService
{

  public API_GYM_CENTER = "http://localhost:8089/gym-center"

  constructor( private matDialog: MatDialog ) { }

  successDialog(title: string, message: string, operationStatus: boolean){
    this.matDialog.open(AlertSuccessComponent, {
      width: "40%",
      enterAnimationDuration: "1000ms",
      exitAnimationDuration: "1000ms",
      data: { title:  title, message: message, operationStatus: operationStatus }
    })
  }


  deletePopup(){
    return  this.matDialog.open(AlertDeleteComponent, {
      width: "40%",
      enterAnimationDuration: "1000ms",
      exitAnimationDuration: "500ms",
      data: { title:  "Supprimer image", message: "Voulez-vous vraiment supprimer cette image ?" }
    })
  }


}
