import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricDataComponent } from './historic-data.component';

describe('HistoricDataComponent', () => {
  let component: HistoricDataComponent;
  let fixture: ComponentFixture<HistoricDataComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HistoricDataComponent]
    });
    fixture = TestBed.createComponent(HistoricDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
