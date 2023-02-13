import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ListUsersVerifiCheckComponent } from './list-users-verifi-check.component';

describe('ListUsersVerifiCheckComponent', () => {
  let component: ListUsersVerifiCheckComponent;
  let fixture: ComponentFixture<ListUsersVerifiCheckComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListUsersVerifiCheckComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ListUsersVerifiCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
