import { Component, Input, Output, EventEmitter, forwardRef, HostListener } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Component({
  selector: 'app-bottom-sheet-select',
  templateUrl: './bottom-sheet-select.component.html',
  styleUrls: ['./bottom-sheet-select.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => BottomSheetSelectComponent),
    multi: true
  }]
})
export class BottomSheetSelectComponent implements ControlValueAccessor {
  @Input() options: string[] = [];
  @Input() placeholder: string = 'Select option';
  @Input() label: string = '';
  @Input() icon: string = '';

  @Output() selectionChange = new EventEmitter<string>();

  selected: string | null = null;
  isSheetOpen = false;
  isMobile = false;

  onChange = (value: any) => {};
  onTouched = () => {};

  constructor() {
    this.updateScreenType();
  }

  @HostListener('window:resize')
  updateScreenType() {
    this.isMobile = window.innerWidth <= 768;
  }

  toggleSheet() {
    this.isSheetOpen = !this.isSheetOpen;
  }

  selectOption(option: string) {
    this.selected = option;
    this.onChange(option);
    this.onTouched();
    this.selectionChange.emit(option);
    this.isSheetOpen = false;
  }

  writeValue(value: string): void {
    this.selected = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
}
