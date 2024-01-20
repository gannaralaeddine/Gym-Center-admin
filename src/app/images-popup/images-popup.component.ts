import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {UtilsService} from "../serviceutils/utils.service";

@Component({
  selector: 'app-images-popup',
  standalone: true,
  imports: [],
  templateUrl: './images-popup.component.html',
  styleUrl: './images-popup.component.css'
})
export class ImagesPopupComponent
{
  actualImage: any
  images: any
  imageIndex = 0
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private utilsService: UtilsService)
  {
      this.images = data.images
      this.actualImage = this.images[this.imageIndex].imageName
  }

  btnNext()
  {
      if (this.imageIndex + 1 < this.images.length)
      {
          this.actualImage = this.images[this.imageIndex + 1].imageName
          this.imageIndex++
      }
      else
      {
          this.actualImage = this.images[0].imageName
          this.imageIndex = 0
      }
  }

  btnPrevious()
  {
      if (this.imageIndex - 1 >= 0)
      {
          this.actualImage = this.images[this.imageIndex - 1].imageName
          this.imageIndex--
      }
      else
      {
          this.actualImage = this.images[this.images.length - 1].imageName
          this.imageIndex = this.images.length-1
      }
  }

  getImage(imageName: any)
  {
      return this.utilsService.getImage(imageName)
  }
}
