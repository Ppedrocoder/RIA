import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArteView } from './arte-view';

describe('ArteView', () => {
  let component: ArteView;
  let fixture: ComponentFixture<ArteView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArteView],
    }).compileComponents();

    fixture = TestBed.createComponent(ArteView);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
