import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BarMarkerChartComponent } from './bar-marker-chart.component';

describe('BarMarkerChartComponent', () => {
  let component: BarMarkerChartComponent;
  let fixture: ComponentFixture<BarMarkerChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BarMarkerChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BarMarkerChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
