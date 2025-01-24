import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LibraryCategoriesComponent } from './library-categories.component';
import { MusicCategory } from '../../../../core/models/track.model';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import * as TrackActions from '../../../store/track/track.actions';
import { selectSelectedCategory } from '../../../store/track/track.selectors';

interface AppState {
  track: {
    selectedCategory: MusicCategory | null;
  };
}

describe('LibraryCategoriesComponent', () => {
  let component: LibraryCategoriesComponent;
  let fixture: ComponentFixture<LibraryCategoriesComponent>;
  let mockStore: jasmine.SpyObj<Store<AppState>>;

  beforeEach(async () => {
    mockStore = jasmine.createSpyObj<Store<AppState>>('Store', ['select', 'dispatch']);
    mockStore.select.and.returnValue(of(null));

    await TestBed.configureTestingModule({
      imports: [LibraryCategoriesComponent],
      providers: [{ provide: Store, useValue: mockStore }]
    }).compileComponents();

    fixture = TestBed.createComponent(LibraryCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('selectedCategory$', () => {
    it('should initialize selectedCategory$ observable', (done) => {
      const mockCategory = MusicCategory.ROCK;
      mockStore.select.and.returnValue(of(mockCategory));
      component.selectedCategory$ = mockStore.select(selectSelectedCategory);

      component.selectedCategory$.subscribe((category) => {
        expect(category).toEqual(mockCategory);
        done();
      });
    });
  });

  describe('filterByCategory', () => {
    it('should dispatch setSelectedCategory action with a category', () => {
      const category = MusicCategory.POP;
      component.filterByCategory(category);

      expect(mockStore.dispatch).toHaveBeenCalledWith(
        TrackActions.setSelectedCategory({ category })
      );
    });

    it('should dispatch setSelectedCategory action with null when no category is passed', () => {
      component.filterByCategory(null);

      expect(mockStore.dispatch).toHaveBeenCalledWith(
        TrackActions.setSelectedCategory({ category: null })
      );
    });
  });

  describe('isSelectedCategory', () => {
    it('should return true when category matches selected category', (done) => {
      const category = MusicCategory.ROCK;
      mockStore.select.and.returnValue(of(category));
      component.selectedCategory$ = mockStore.select(selectSelectedCategory);

      let isSelected = false;
      component.selectedCategory$.subscribe((selected) => {
        isSelected = selected === category;
        expect(isSelected).toBeTrue();
        done();
      });
    });

    it('should return false when category does not match selected category', (done) => {
      const selectedCategory = MusicCategory.ROCK;
      const differentCategory = MusicCategory.CHAABI;
      mockStore.select.and.returnValue(of(selectedCategory));
      component.selectedCategory$ = mockStore.select(selectSelectedCategory);

      let isSelected = true;
      component.selectedCategory$.subscribe((selected) => {
        isSelected = selected === differentCategory;
        expect(isSelected).toBeFalse();
        done();
      });
    });

    it('should return false when no category is selected', (done) => {
      mockStore.select.and.returnValue(of(null));
      component.selectedCategory$ = mockStore.select(selectSelectedCategory);

      let isSelected = true;
      component.selectedCategory$.subscribe((selected) => {
        isSelected = selected === MusicCategory.ROCK;
        expect(isSelected).toBeFalse();
        done();
      });
    });
  });
});
