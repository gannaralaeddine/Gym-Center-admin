import { Directive, HostBinding, HostListener, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { EventEmitter } from '@angular/core';
import { FileHandleModule } from './file-handle/file-handle.module';

@Directive({
  selector: '[appDrag]'
})
export class DragDirective {

  @Output() files: EventEmitter<FileHandleModule> = new EventEmitter()

  @HostBinding("style.background")
  private background = "#eee"

  constructor(private sanitizer: DomSanitizer) { }

  @HostListener("dragover", ["$event"])
  public onDragOver(event: DragEvent)
  {
    console.log("dragover")
      event.preventDefault()
      event.stopPropagation()
      this.background = "#999"
  }


  @HostListener("dragleave", ["$event"])
  public onDragLeave(event: DragEvent)
  {
    console.log("onDragLeave")
      event.preventDefault()
      event.stopPropagation()
      this.background = "#eee"
  }


  @HostListener("drop", ["$event"])
  public onDrop(event: DragEvent)
  {
      event.preventDefault()
      event.stopPropagation()
      this.background = "#eee"

      if(event.dataTransfer != null){
        const file = event.dataTransfer.files[0]
        const url = this.sanitizer.bypassSecurityTrustHtml(window.URL.createObjectURL(file))

        let fileHandle = { file, url }

        this.files.emit(fileHandle)
      }
      else
      {
        console.log("event.dataTransfer is null")
      }
      

      
  }
}
