import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BetboardComponent } from './betboard.component';

describe('BetboardComponent', () => {
  let component: BetboardComponent;
  let fixture: ComponentFixture<BetboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BetboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BetboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
