import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LibraryPageComponent } from './library-page.component';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import {ActivatedRoute} from "@angular/router";

describe('LibraryPageComponent', () => {
  let component: LibraryPageComponent;
  let fixture: ComponentFixture<LibraryPageComponent>;
  let mockStore: jasmine.SpyObj<Store>;
  let mockActiveRoute: Partial<ActivatedRoute>

  beforeEach(async () => {

    mockStore = jasmine.createSpyObj('Store', ['select', 'dispatch']);
    mockStore.select.and.returnValue(of(null));

    mockActiveRoute = {
      params : of({id: '123'}),
      queryParams: of({ sort : 'asc'})

    }

    await TestBed.configureTestingModule({
      imports: [LibraryPageComponent],
      providers: [
        { provide: Store, useValue: mockStore },
        { provide: ActivatedRoute, useValue: mockActiveRoute },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LibraryPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
