import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminBuyCreditComponent } from './admin-buy-credit.component';

describe('AdminBuyCreditComponent', () => {
  let component: AdminBuyCreditComponent;
  let fixture: ComponentFixture<AdminBuyCreditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminBuyCreditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminBuyCreditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
