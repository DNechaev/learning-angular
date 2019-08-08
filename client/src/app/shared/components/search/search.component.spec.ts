import {async, ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import { SearchComponent } from './search.component';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SearchService } from '../../services/search.service';
import { By } from '@angular/platform-browser';

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;
  let searchService: SearchService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([]),
        HttpClientModule,
        ReactiveFormsModule
      ],
      declarations: [ SearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    searchService = fixture.debugElement.injector.get(SearchService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('value send to SearchService', fakeAsync(() => {
    const input = fixture.debugElement.query(By.css('input'));
    const el = input.nativeElement;

    expect(el.value).toBe('');

    el.value = 'testString';
    fixture.detectChanges();
    el.dispatchEvent(new Event('input'));

    tick(component.debounce / 2);
    expect(searchService.search$.value).toBe('');

    tick(component.debounce);
    expect(searchService.search$.value).toBe('testString');
  }));

});
