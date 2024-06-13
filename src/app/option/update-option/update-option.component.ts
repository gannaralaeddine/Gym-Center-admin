import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgIf } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { OptionService } from '../../services/option.service';
import { Option } from '../option';
import { UtilsService } from '../../serviceutils/utils.service';

@Component({
  selector: 'app-update-option',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './update-option.component.html',
  styleUrl: './update-option.component.css'
})
export class UpdateOptionComponent implements OnInit
{
  optionFormValue!: FormGroup
  option = new Option()

  constructor(private dialogRef: MatDialogRef<UpdateOptionComponent>,
    private optionFormBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private optionService:OptionService,
    private utilsService: UtilsService){}
  ngOnInit()
  {
    this.optionFormValue = this.optionFormBuilder.group({
      optionTitle : ['',Validators.required]
    })

    this.optionService.getOption(this.data.optionId).subscribe({
      next: (option: Option) => this.optionFormValue.controls['optionTitle'].setValue(option.optionName),
      error: (err) => console.error(err)
    })
  }
  closeDialog()
  {
    this.dialogRef.close()
  }

  checkValidityForm() 
  {
    if (this.optionFormValue.controls['optionTitle'].invalid && this.optionFormValue.controls['optionTitle'].touched)
    {
      document.getElementById('optionTitleInput')!.className = "form-control border border-danger pl-2 round"
    }
    else
    {
      document.getElementById('optionTitleInput')!.className = "form-control border border-dark pl-2 round"
    }

    if (this.optionFormValue.controls['optionTitle'].invalid)
    {
      document.getElementById("updateButton")?.setAttribute("disabled","")
    }
    else
    {
      document.getElementById("updateButton")?.removeAttribute("disabled")
    }
  }

  updateOffer() 
  {
    this.option.optionName = this.optionFormValue.controls['optionTitle'].getRawValue()

    this.optionService.updateOption(this.data.optionId, this.option).subscribe({
      next:() => {
        this.closeDialog()
        this.utilsService.successDialog("Opération réussite", "Option éditée avec succès", true)
      },
      error: (err)=> this.utilsService.successDialog("Opération échouée", err.message, false)
    })
  }
}
