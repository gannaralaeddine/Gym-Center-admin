import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCoachSpecialitiesComponent } from './add-coach-specialities.component';

describe('AddCoachSpecialitiesComponent', () => {
  let component: AddCoachSpecialitiesComponent;
  let fixture: ComponentFixture<AddCoachSpecialitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddCoachSpecialitiesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddCoachSpecialitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
