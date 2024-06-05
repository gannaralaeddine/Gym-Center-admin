import { NgIf } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserService } from '../../services/user.service';
import { Console } from 'console';
import { UtilsService } from '../../serviceutils/utils.service';

@Component({
  selector: 'app-update-private-sessions-number',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './update-private-sessions-number.component.html',
  styleUrl: './update-private-sessions-number.component.css'
})
export class UpdatePrivateSessionsNumberComponent implements OnInit
{
  email!: string
  updatePrivateSessionsNumberFormValue!: FormGroup

  constructor(
    private updatePrivateSessionsNumberFormBuilder: FormBuilder,
    private userService: UserService,
    private utilsService: UtilsService,
    private dialogRef: MatDialogRef<UpdatePrivateSessionsNumberComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  )
  {
    this.email = data.memberEmail
  }

  ngOnInit()
  {
    this.updatePrivateSessionsNumberFormValue = this.updatePrivateSessionsNumberFormBuilder.group({
      privateSessionsNumber : ['',Validators.required]
    })
  }

  closeDialog()
  {
    this.dialogRef.close()
  }

  updatePrivateSessionsNumber() 
  {
    this.userService.updatePrivateSessionsNumber(this.email,this.updatePrivateSessionsNumberFormValue.controls['privateSessionsNumber'].getRawValue()).subscribe({
      next: () => {
        this.dialogRef.close()
        this.utilsService.successDialog("Opération réussite", "Séance ajoutée avec succès", true)
      },
      error: (err) => this.utilsService.successDialog("Opération échouée", err.message, false)
    })
  }
}
