import {Component, Inject} from '@angular/core';
import {NgIf} from "@angular/common";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-alert-delete',
  standalone: true,
    imports: [
        NgIf
    ],
  templateUrl: './alert-delete.component.html',
  styleUrl: './alert-delete.component.css'
})
export class AlertDeleteComponent {

  title: string = ""
  message: string = ""

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<AlertDeleteComponent>) {
    this.title = data.title
    this.message = data.message
  }

  closeDialog(isDeleteOperation: boolean)
  {
    this.dialogRef.close(isDeleteOperation)
  }
}
