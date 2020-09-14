import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LobbyPlayersComponent } from './lobby-players.component';

describe('LobbyPlayersComponent', () => {
  let component: LobbyPlayersComponent;
  let fixture: ComponentFixture<LobbyPlayersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LobbyPlayersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LobbyPlayersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
