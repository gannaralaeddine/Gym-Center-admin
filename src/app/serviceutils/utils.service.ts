import { Injectable } from '@angular/core';
import { AlertSuccessComponent } from "../alert-success/alert-success.component";
import { MatDialog } from '@angular/material/dialog';
import {AlertDeleteComponent} from "../alert-delete/alert-delete.component";
import {ImagesPopupComponent} from "../images-popup/images-popup.component";

@Injectable({
  providedIn: 'root'
})
export class UtilsService
{

  public API_GYM_CENTER = "http://localhost:8089/gym-center"

  constructor( private matDialog: MatDialog ) { }

  public getImage(imageName: string): string { return this.API_GYM_CENTER + "/image/get-image/" + imageName }


  successDialog(title: string, message: string, operationStatus: boolean){
    this.matDialog.open(AlertSuccessComponent, {
      width: "40%",
      enterAnimationDuration: "1000ms",
      exitAnimationDuration: "1000ms",
      data: { title:  title, message: message, operationStatus: operationStatus }
    })
  }


  deletePopup(title?: string, message?: string, operationType?: string)
  {
    if (title && message && operationType)
    {
      return  this.matDialog.open(AlertDeleteComponent, {
        width: "40%",
        enterAnimationDuration: "1000ms",
        exitAnimationDuration: "500ms",
        data: { title: title, message: message, operationType: operationType }
      })
    }
    return  this.matDialog.open(AlertDeleteComponent, {
      width: "40%",
      enterAnimationDuration: "1000ms",
      exitAnimationDuration: "500ms",
      data: { title:  "Supprimer image", message: "Voulez-vous vraiment supprimer cette image ?", operationType: "deleteOperation" }
    })
  }

  public deleteItemFromArray(array: any, imageName: any)
  {
      return array.filter((element: any) => {
        return element.imageName !== imageName;
      });
  }


  displayImages(images: any, isOneImage: boolean)
  {
    return this.matDialog.open(ImagesPopupComponent, {
      width: "60%",
      height: "80%",
      enterAnimationDuration: "1000ms",
      exitAnimationDuration: "1000ms",
      data: { images: images,  isOneImage: isOneImage}
    })
  }
}
