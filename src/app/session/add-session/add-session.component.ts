import { NgFor, NgIf } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SessionService } from '../../services/session.service';
import { Activity } from '../../activity/activity';
import { ActivityService } from '../../services/activity.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Session } from '../session';
import { UserService } from '../../services/user.service';
import { User } from '../../user/user';
import { Category } from '../../category/category';
import {FileHandleModule} from "../../file-handle/file-handle.module";
import { UtilsService } from '../../serviceutils/utils.service';

@Component({
  selector: 'app-add-session',
  standalone: true,
  imports: [NgFor, NgIf, ReactiveFormsModule],
  templateUrl: './add-session.component.html',
  styleUrl: './add-session.component.css'
})

export class AddSessionComponent implements OnInit
{
  sessionFormValue !: FormGroup
  sessions: any
  activities: any
  coaches: any
  isAddOperation = true
  sessionObject = new Session()
  /*sessionObject = new Session("",
  new Activity("", "", "", new Category("","","",[]), []),
    new User(),
    "",
    []
  )*/

  activityObject!: Activity
  userObject!: User

  
  
  constructor(private dialogRef: MatDialogRef<AddSessionComponent>,
    private sessionFormBuilder: FormBuilder,
    private sessionService: SessionService,
    private activityService: ActivityService,
    private userService: UserService,
    private utilsService: UtilsService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private sanitizer: DomSanitizer){}

  ngOnInit()
  {
  

    if (this.data.sessionId)
    {
      this.isAddOperation = false
      this.getSessionById(this.data.sessionId)
    }
    this.sessionFormValue = this.sessionFormBuilder.group({
      sessionName : ['',Validators.required],
      sessionImage : ['',Validators.required],
      sessionActivity : ['',Validators.required],
      sessionCoach:['',Validators.required]
    })

    this.getAllActivities()
    this.getAllCoaches()
  }

  closeDialog()
  {
    this.dialogRef.close()
  }

  getActivityById(id?: any)
  {
    if (!id)
    {
      // retrieve activity in add operation
      this.activityService.getActivity(this.sessionFormValue.value.sessionActivity).subscribe({
        next: (activity) => this.activityObject = activity as Activity,
        error: (err) => console.log(err),
        complete:()=> console.log(this.activityObject)
      })
    }
    else
    {
      // retrieve activity in update operation
      this.activityService.getActivity(id).subscribe({
        next: (activity) => this.activityObject = activity as Activity,
        error: (err) => console.log(err),
        complete: ()=> console.log(this.activityObject)
      })
    }
    
  }

  getAllActivities()
  {
    this.activityService.getAllActivities().subscribe({
      next: (activity) => this.activities = activity as Activity,
      error: (err) => console.error(err)
    })
  }

  getAllCoaches()
  {
    this.userService.getAllUsers().subscribe({
      next: (user) => this.coaches = user,
      error: (err) => console.error(err),
      complete: () => {

        let coachesArray = []

        for (let i = 0; i < this.coaches.length; i++) 
        {
          if ((this.coaches[i].roles.length !== 0) && (this.coaches[i].roles[0].roleName === "COACH"))
          {
            coachesArray.push(this.coaches[i])
          }
        }

        this.coaches = coachesArray

      }
    })
  }

  getCoachById(id?: any) 
  {
    if (id)
    {
      // retrieve coach in update operation
      this.userService.getUserById(id).subscribe({
        next: (user) => this.userObject = user,
        error: (err) => console.error(err),
        complete: ()=> console.log(this.userObject)
      })
    }
    else
    {
      // retrieve coach in update operation
      this.userService.getUserById(this.sessionFormValue.value.sessionCoach).subscribe({
        next: (user) => this.userObject = user,
        error: (err) => console.error(err),
        complete: ()=> console.log(this.userObject)
      })
    }
  }

  onFileSelected(event: any)
  {
    this.sessionObject.sessionImages = []

    if (event.target.files)
    {
      for (let i= 0 ; i < event.target.files.length ; i++)
      {
        this.sessionObject.sessionImages.push({
          file:event.target.files[i], 
          url: this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(event.target.files[i]))
        })

        this.checkValidityForm()
        this.onTouched()
      }
    }
  }

  checkValidityForm() 
  {
    if (this.sessionFormValue.controls['sessionName'].invalid && this.sessionFormValue.controls['sessionName'].touched)
    {
      document.getElementById('sessionNameInput')!.className = "form-control border border-danger pl-2 round"
    }
    else
    {
      document.getElementById('sessionNameInput')!.className = "form-control border border-dark pl-2 round"
    }
    
    // check activity description and change borer color based on validity of input
    if (this.sessionFormValue.controls['sessionActivity'].invalid && this.sessionFormValue.controls['sessionActivity'].touched)
    {
      document.getElementById('activitySelectList')!.className = "form-control border border-danger pl-2 round"
    }
    else
    {
      document.getElementById('activitySelectList')!.className = "form-control border border-dark pl-2 round"
    }

    // check activity category and change borer color based on validity of selected option
    if (this.sessionFormValue.controls['sessionCoach'].invalid && this.sessionFormValue.controls['sessionCoach'].touched)
    {
      document.getElementById('coachSelectList')!.className = "form-control border border-danger pl-2 round"
    }
    else
    {
      document.getElementById('coachSelectList')!.className = "form-control border border-dark pl-2 round"
    }

    if (this.data.sessionId) // enable or disable the update button
    {
      if (this.sessionFormValue.controls['sessionName'].invalid)
      {
        document.getElementById("updateButton")?.setAttribute("disabled","")
      }
      else
      {
        document.getElementById("updateButton")?.removeAttribute("disabled")
      }
    }
    else
    {
      if (this.sessionFormValue.controls['sessionName'].valid && this.sessionFormValue.controls['sessionActivity'].valid && this.sessionFormValue.controls['sessionCoach'].valid && this.sessionObject.sessionImages.length > 0)
      {
        document.getElementById("addButton")?.removeAttribute("disabled")
      }
      else
      {
        document.getElementById("addButton")?.setAttribute("disabled","")
      }
    }
  }

  addSessionWithOneImage() 
  {
    this.sessionObject.sessionName = this.sessionFormValue.value.sessionName
    this.sessionObject.sessionActivity = this.activityObject
    //this.sessionObject.sessionCoach = this.userObject

    const sessionFormData = this.prepareFormData(this.sessionObject);

    this.sessionService.addSessionWithOneImage(sessionFormData).subscribe({
      next:()=> {
        this.dialogRef.close()
        this.utilsService.openDialog("Opération réussite", "Séance ajoutée avec succès", true)

      },
      error: (err)=> this.utilsService.openDialog("Opération échouée", err.message, false)
    })
  }
      
  updateSession(arg0: any) 
  {
      
  }

  getSessionById(sessionId: any) 
  {
    this.sessionService.getSession(sessionId).subscribe({
      next: (session) => this.populateUpdateForm(session),
      error: (err)=> console.error(err)
    })
  }

  populateUpdateForm(session: any)
  {
    /*this.sessionObject.sessionActivity = session.sessionActivity
    this.sessionObject.sessionCoach = session.sessionCoach*/

    this.sessionFormValue.controls['sessionName'].setValue(session.sessionName)
    this.populateActivitySelectList(session)
    this.populateCoachSelectList(session)
  }

  populateActivitySelectList(session: any)
  {
    let optionTag!: HTMLOptionElement
    let selectTag!: HTMLSelectElement

    // get the div tag containing select list of categories
    let formGroupActivitySelectList = document.getElementById("activitySelectList")?.parentElement

    // get the reference of div tag containing select list of categories generated by Angular (example: _ngcontent-ng-c1135787114)
    let referenceActivity = document.getElementById("activitySelectList")?.parentElement?.attributes.item(0)?.name
    
    //remove actual select HTML tag
    document.getElementById("activitySelectList")?.remove()

    // create new select HTML tag for replace the removed one
    selectTag = document.createElement("select")
    selectTag.setAttribute(referenceActivity!,"")
    selectTag.setAttribute("formcontrolname","sessionActivity")
    selectTag.setAttribute("class","form-control border border-dark pl-2 round ng-pristine ng-valid ng-touched")
    selectTag.setAttribute("id","activitySelectList")
    selectTag.addEventListener('change',()=>{
      this.getActivityById(selectTag[selectTag.selectedIndex].getAttribute("value"))
    })
    formGroupActivitySelectList?.appendChild(selectTag)

    //add option HTML tag to select tag that will be selected by default
    let activitySelectList = document.getElementById("activitySelectList")
    optionTag = document.createElement("option") //<option _ngcontent-ng-c1135787114="" value="4" ng-reflect-value="4">ala</option>
    optionTag.setAttribute(referenceActivity!,"")
    optionTag.setAttribute("value",session.sessionActivity.actId.toString())
    optionTag.textContent = session.sessionActivity.actName
    activitySelectList?.appendChild(optionTag)

    //add other options under the first element in the list
    this.activityService.getAllActivities().subscribe({
      next:(activity)=>{
      for (let i = 0; i < activity.length; i++) 
      {
        if (activity[i].actId != session.sessionActivity.actId)
        {
          // add the other options for categories
          optionTag = document.createElement("option")
          optionTag.setAttribute(referenceActivity!,"")
          optionTag.setAttribute("value",activity[i].actId.toString())
          optionTag.setAttribute("ng-reflect-value",activity[i].actId.toString())
          optionTag.textContent = activity[i].actName
          activitySelectList?.appendChild(optionTag)
        }
      }
    },
      error: (err)=>console.error(err)
    })
  }

  populateCoachSelectList(session: any)
  {
    let optionTag!: HTMLOptionElement
    let selectTag!: HTMLSelectElement

    // get the div tag containing select list of categories
    let formGroupCoachSelectList = document.getElementById("coachSelectList")?.parentElement

    // get the reference of div tag containing select list of categories generated by Angular (example: _ngcontent-ng-c1135787114)
    let referenceCoach = document.getElementById("coachSelectList")?.parentElement?.attributes.item(0)?.name
    
    //remove actual select HTML tag
    document.getElementById("coachSelectList")?.remove()

    // create new select HTML tag for replace the removed one
    selectTag = document.createElement("select")
    selectTag.setAttribute(referenceCoach!,"")
    selectTag.setAttribute("formcontrolname","sessionCoach")
    selectTag.setAttribute("class","form-control border border-dark pl-2 round ng-pristine ng-valid ng-touched")
    selectTag.setAttribute("id","coachSelectList")
    selectTag.addEventListener('change',()=>{
      this.getCoachById(selectTag[selectTag.selectedIndex].getAttribute("value"))
    })
    formGroupCoachSelectList?.appendChild(selectTag)

    //add option HTML tag to select tag that will be selected by default
    let coachSelectList = document.getElementById("coachSelectList")
    optionTag = document.createElement("option") //<option _ngcontent-ng-c1135787114="" value="4" ng-reflect-value="4">ala</option>
    optionTag.setAttribute(referenceCoach!,"")
    optionTag.setAttribute("value",session.sessionCoach.userId.toString())
    optionTag.textContent = session.sessionCoach.userFirstName + " " + session.sessionCoach.userLastName
    coachSelectList?.appendChild(optionTag)

    //add other options under the first element in the list
    this.userService.getAllUsers().subscribe({
      next:(user)=>{
      for (let i = 0; i < user.length; i++) 
      {
        if ((user[i].roles.length !== 0) && (user[i].roles[0].roleName === "COACH"))
        {
          if (user[i].userId != session.sessionCoach.userId)
          {
            // add the other options for categories
            optionTag = document.createElement("option")
            optionTag.setAttribute(referenceCoach!,"")
            optionTag.setAttribute("value",user[i].userId.toString())
            optionTag.setAttribute("ng-reflect-value",user[i].userId.toString())
            optionTag.textContent = user[i].userFirstName + " " + user[i].userLastName
            coachSelectList?.appendChild(optionTag)
          }
        }
      }
    },
      error: (err)=>console.error(err)
    })
  }

  onTouched()
  {
    if (this.sessionObject.sessionImages.length == 0)
    {
      document.getElementById("categoryImageInput")!.className = "form-control border border-danger pl-2 round"
    }
    else
    {
      document.getElementById("categoryImageInput")!.className = "form-control border border-dark pl-2 round"
    }
  }

  /*prepareFormData(session: Session): FormData
  {
    const formData = new FormData()

    formData.append("session", new Blob([JSON.stringify(session)],{type : "application/json"}))

    for ( let i = 0 ; i < session.sessionImages.length ; i++ )
    {
      formData.append("imageFile", session.sessionImages[i].file)
    }

    return formData
  }*/
  prepareFormData(session: Session): FormData
  {
    const formData = new FormData()

    formData.append(
      "session", new Blob( [ JSON.stringify(session) ], { type: "application/json" } )
    )
    console.log("imageFile: "  + session.sessionImages.length)
    for ( let i = 0 ; i < session.sessionImages.length ; i++ )
    {
      formData.append(
        "imageFile",
        session.sessionImages[i].file,
        session.sessionImages[i].file.name
      )
    }
    return formData
  }
  
}
