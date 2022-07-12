import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MixedBarChartComponent } from './mixed-bar-chart.component';

describe('MixedBarChartComponent', () => {
  let component: MixedBarChartComponent;
  let fixture: ComponentFixture<MixedBarChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MixedBarChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MixedBarChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
