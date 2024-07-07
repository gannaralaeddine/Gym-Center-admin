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
  minDate = new Date(new Date().getTime() + new Date(1209600000).getTime()).toISOString().split('T')[0]
  sessionPlaces = 2

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
      sessionDescription : ['',Validators.required],
      sessionImage : ['',Validators.required],
      sessionActivity : ['',Validators.required],
      sessionCoach: ['',Validators.required],
      sessionTotalPlaces: ['',Validators.required],
      sessionDeadline: ['',Validators.required]
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
      // retrieve activity object in add operation
      if (isNaN(this.sessionFormValue.value.sessionActivity) || this.sessionFormValue.value.sessionActivity <= 0) {
        console.log("error id isNAN !!!")
        return
      }
      this.activityService.getActivity(this.sessionFormValue.value.sessionActivity).subscribe({
        next: (activity) => this.sessionObject.sessionActivity = activity as Activity,
        error: (err) => console.log(err)
      })
    }
    else
    {
      // retrieve activity object in update operation
      if (isNaN(id) || id <= 0) {
        console.log("error id isNAN !!!")
        return
      }
      this.activityService.getActivity(id).subscribe({
        next: (activity) => this.sessionObject.sessionActivity = activity as Activity,
        error: (err) => console.log(err)
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
    this.userService.getAllCoaches().subscribe({
      next: (user) => this.coaches = user,
      error: (err) => console.error(err)
    })
  }

  getCoachById(id?: any)
  {
    if (id)
    {
      // retrieve coach in update operation
      this.userService.getUserById(id).subscribe({
        next: (user) => this.sessionObject.sessionCoach = user,
        error: (err) => console.error(err)
      })
    }
    else
    {
      // retrieve coach in update operation
      this.userService.getUserById(this.sessionFormValue.value.sessionCoach).subscribe({
        next: (user) => this.sessionObject.sessionCoach = user,
        error: (err) => console.error(err)
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

    if (this.sessionFormValue.controls['sessionTotalPlaces'].invalid && this.sessionFormValue.controls['sessionTotalPlaces'].touched)
    {
      document.getElementById('sessionTotalPlacesInput')!.className = "form-control border border-danger pl-2 round"
    }
    else
    {
      document.getElementById('sessionTotalPlacesInput')!.className = "form-control border border-dark pl-2 round"
    }

    if (this.sessionFormValue.controls['sessionDeadline'].invalid && this.sessionFormValue.controls['sessionDeadline'].touched)
    {
      document.getElementById('sessionDeadlineInput')!.className = "form-control border border-danger pl-2 round"
    }
    else
    {
      document.getElementById('sessionDeadlineInput')!.className = "form-control border border-dark pl-2 round"
    }

    if ((this.sessionFormValue.controls['sessionDescription'].invalid && this.sessionFormValue.controls['sessionDescription'].touched) || (this.sessionFormValue.controls['sessionDescription'].getRawValue().length > 510))
    {
      document.getElementById('sessionDescriptionInput')!.className = "form-control border border-danger pl-2 round"
    }
    else
    {
      document.getElementById('sessionDescriptionInput')!.className = "form-control border border-dark pl-2 round"
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
      if ((this.sessionFormValue.controls['sessionName'].invalid) || (this.sessionFormValue.controls['sessionDescription'].invalid) || (this.sessionFormValue.controls['sessionDescription'].getRawValue().length > 510) || (this.sessionFormValue.controls['sessionTotalPlaces'].invalid) || (this.sessionFormValue.controls['sessionDeadline'].invalid))
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
      if (this.sessionFormValue.controls['sessionImage'].invalid)
      {
        document.getElementById('sessionImageInput')!.className = "form-control border border-danger pl-2 round"
      }
      else
      {
        document.getElementById('sessionImageInput')!.className = "form-control border border-dark pl-2 round"
      }

      if (this.sessionFormValue.controls['sessionName'].valid && this.sessionFormValue.controls['sessionActivity'].valid && this.sessionFormValue.controls['sessionCoach'].valid && this.sessionObject.sessionImages.length > 0 && this.sessionFormValue.controls['sessionDescription'].valid && this.sessionFormValue.controls['sessionDescription'].getRawValue().length <= 510 && this.sessionFormValue.controls['sessionDeadline'].valid && this.sessionFormValue.controls['sessionTotalPlaces'].valid)
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
    this.sessionObject.sessionDescription = this.sessionFormValue.value.sessionDescription
    this.sessionObject.sessionTotalPlaces = this.sessionFormValue.value.sessionTotalPlaces
    this.sessionObject.sessionDeadline = this.sessionFormValue.value.sessionDeadline

    const sessionFormData = this.prepareFormData(this.sessionObject);

    this.sessionService.addSessionWithOneImage(sessionFormData).subscribe({
      next:()=> {
        this.dialogRef.close()
        this.utilsService.successDialog("Opération réussite", "Séance ajoutée avec succès", true)

      },
      error: (err)=> this.utilsService.successDialog("Opération échouée", err.message, false)
    })
  }

  updateSession()
  {
    if ((this.sessionObject.sessionImages) && (this.sessionObject.sessionImages.length > 0))
    {
      this.sessionObject.sessionName = this.sessionFormValue.value.sessionName
      this.sessionObject.sessionDescription = this.sessionFormValue.value.sessionDescription
      this.sessionObject.sessionTotalPlaces = this.sessionFormValue.value.sessionTotalPlaces
      this.sessionObject.sessionDeadline = this.sessionFormValue.value.sessionDeadline
      const formData = this.prepareFormData(this.sessionObject)


      this.sessionService.updateSessionWithImage(formData).subscribe({
        next:()=> {
          this.dialogRef.close()
          this.utilsService.successDialog("Opération réussite", "Séance mise à jour avec succès", true)

        },
        error: (err)=> this.utilsService.successDialog("Opération échouée", err.message, false)
      })
    }
    else
    {
      this.sessionObject.sessionName = this.sessionFormValue.value.sessionName
      this.sessionObject.sessionDescription = this.sessionFormValue.value.sessionDescription
      this.sessionObject.sessionTotalPlaces = this.sessionFormValue.value.sessionTotalPlaces
      this.sessionObject.sessionDeadline = this.sessionFormValue.value.sessionDeadline

      this.sessionService.updateSession(this.data.sessionId,this.sessionObject).subscribe({
        next:()=> {
          this.dialogRef.close()
          this.utilsService.successDialog("Opération réussite", "Séance mise à jour avec succès", true)

        },
        error: (err)=> this.utilsService.successDialog("Opération échouée", err.message, false)
      })
    }

  }

  getSessionById(sessionId: any)
  {
    if (isNaN(sessionId) || sessionId <= 0) {
      console.error('Invalid sessionId provided');
      return; // Or handle the error appropriately
    }
    this.sessionService.getSession(sessionId).subscribe({
      next: (session) => this.populateUpdateForm(session),
      error: (err)=> console.error(err)
    })
  }

  populateUpdateForm(session: any)
  {
    this.sessionObject.sessionId = session.sessionId
    this.sessionObject.sessionActivity = session.sessionActivity
    this.sessionObject.sessionCoach = session.sessionCoach
    if (session.sessionReservedPlaces) { this.sessionPlaces = session.sessionReservedPlaces + 1 }
    console.log(session.sessionReservedPlaces)

    this.sessionFormValue.controls['sessionName'].setValue(session.sessionName)
    this.sessionFormValue.controls['sessionDescription'].setValue(session.sessionDescription)
    this.sessionFormValue.controls['sessionTotalPlaces'].setValue(session.sessionTotalPlaces)
    this.sessionFormValue.controls['sessionDeadline'].setValue(new Date(session.sessionDeadline).toISOString().split('T')[0])
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
    optionTag.setAttribute("selected","")
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
    optionTag.setAttribute("selected","")
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

  prepareFormData(session: Session): FormData
  {
    const formData = new FormData()

    formData.append("session", new Blob([JSON.stringify(session)], {type: "application/json"}))

    for ( let i = 0 ; i < session.sessionImages.length ; i++ )
    {
      formData.append("imageFile", session.sessionImages[i].file, session.sessionImages[i].file.name)
    }

    return formData
  }

  getSessionImage(imageName: string): string
  {
    if (imageName)
    {
      return this.utilsService.getImage(imageName)
    }
    else
    {
      return "../assets/img/icons/ic_activity.png"
    }
  }
}
