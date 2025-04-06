import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BottomSheetSelectComponent } from './bottom-sheet-select.component';

describe('BottomSheetSelectComponent', () => {
  let component: BottomSheetSelectComponent;
  let fixture: ComponentFixture<BottomSheetSelectComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BottomSheetSelectComponent]
    });
    fixture = TestBed.createComponent(BottomSheetSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
