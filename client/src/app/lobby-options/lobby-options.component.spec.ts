import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LobbyOptionsComponent } from './lobby-options.component';

describe('LobbyOptionsComponent', () => {
  let component: LobbyOptionsComponent;
  let fixture: ComponentFixture<LobbyOptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LobbyOptionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LobbyOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
