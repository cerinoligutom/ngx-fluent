import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxFluentComponent } from './ngx-fluent.component';

describe('NgxFluentComponent', () => {
  let component: NgxFluentComponent;
  let fixture: ComponentFixture<NgxFluentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NgxFluentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NgxFluentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
