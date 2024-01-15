import { Component, Inject } from '@angular/core';
import { FileHandleModule } from '../file-handle/file-handle.module';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivityService } from '../services/activity.service';
import { UtilsService } from '../serviceutils/utils.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatGridListModule } from '@angular/material/grid-list';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-add-images',
  standalone: true,
  imports: [MatGridListModule, NgFor],
  templateUrl: './add-images.component.html',
  styleUrl: './add-images.component.css'
})
export class AddImagesComponent
{
    activityId: number
    images!: FileHandleModule[]

    constructor(private activityService: ActivityService, private utilsService: UtilsService,
       private sanitizer: DomSanitizer, private dialogRef: MatDialogRef<AddImagesComponent>,
       @Inject(MAT_DIALOG_DATA) public data: any)
    {
        this.activityId = data.id
        console.log("this.activityId: " + this.activityId)
    }

    addImages(id: number)
    {
      if(this.images && this.images.length > 0)
      {
        const activityFormData =  this.prepareFormData( id )
  
        this.activityService.addImagesToActivity(activityFormData).subscribe({
          next:(val)=> {
            console.log("Opération réussite: " + val)
            this.dialogRef.close()
            this.utilsService.openDialog("Opération réussite", "Images ajoutée avec succès", true)
    
          },
          error: (err)=> this.utilsService.openDialog("Opération échouée", err.message, false)
        })
      }
      else
      {
        console.log("images not selected")
      }
    }


    prepareFormData(id: number): FormData
    {
      const formData = new FormData()

      formData.append(
        "id", new Blob( [ JSON.stringify( id )  ], { type: "application/json" } )
      )

      for ( let i = 0 ; i < this.images.length ; i++ )
      {
        formData.append(
          "imageFile",
          this.images[i].file,
          this.images[i].file.name
        )
      }
      return formData
    }

    onFileSelected(event: any)
    {
      this.images = []

      if (event.target.files)
      {
        for (let i= 0 ; i < event.target.files.length ; i++)
        {
          const file = event.target.files[i]
          const fileHandle: FileHandleModule = {
            file: file,
            url: this.sanitizer.bypassSecurityTrustUrl(
              window.URL.createObjectURL(file)
            )
          }
          this.images.push(fileHandle)

        }
      }
    }

    removeImage(index: number)
    {
        this.images.splice(index, 1)
    }

    fileDropped(fileHandle: any)
    {
        this.images.push(fileHandle)
    }

  public onDragLeave(event: DragEvent)
  {
    console.log("onDragLeave")
      event.preventDefault()
      event.stopPropagation()
  }


  public onDragOver(event: DragEvent)
  {
    console.log("dragover")
      event.preventDefault()
      event.stopPropagation()

  }
}


