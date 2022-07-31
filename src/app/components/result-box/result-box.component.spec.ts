import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultBoxComponent } from './result-box.component';

describe('ResultBoxComponent', () => {
  let component: ResultBoxComponent;
  let fixture: ComponentFixture<ResultBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResultBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
