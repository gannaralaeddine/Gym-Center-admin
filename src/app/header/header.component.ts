import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit
{
  @Output() buttonClicked = new EventEmitter<boolean>()
  buttonStatus!: boolean

  ngOnInit()
  {
    this.buttonStatus = true
    this.buttonClicked.emit(this.buttonStatus)
  }

  isClicked()
  {
    this.buttonStatus = !this.buttonStatus 
    this.buttonClicked.emit(this.buttonStatus)
  } 
}
