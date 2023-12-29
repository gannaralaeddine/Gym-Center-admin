import { Component, Inject } from '@angular/core';
import { NgIf } from "@angular/common";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-alert-success',
  standalone: true,
    imports: [
        NgIf
    ],
  templateUrl: './alert-success.component.html',
  styleUrl: './alert-success.component.css'
})
export class AlertSuccessComponent
{
    title: string = ""
    message: string = ""
    operationStatus!: Boolean

    constructor( @Inject(MAT_DIALOG_DATA) public data: any,
                private dialogRef: MatDialogRef<AlertSuccessComponent> ) {
      this.title = data.title
      this.message = data.message
      this.operationStatus = data.operationStatus
    }

  closeDialog()
  {
    this.dialogRef.close()
  }
}
