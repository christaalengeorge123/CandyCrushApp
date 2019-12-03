import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialoglooseComponent } from './dialogloose.component';

describe('DialoglooseComponent', () => {
  let component: DialoglooseComponent;
  let fixture: ComponentFixture<DialoglooseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialoglooseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialoglooseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
