import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReapprovComponent } from './reapprov.component';

describe('ReapprovComponent', () => {
  let component: ReapprovComponent;
  let fixture: ComponentFixture<ReapprovComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReapprovComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReapprovComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
