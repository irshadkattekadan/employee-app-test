import {
  Component,
  ElementRef,
  forwardRef,
  ViewChild
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatePickerComponent),
      multi: true
    }
  ]
})
export class DatePickerComponent implements ControlValueAccessor {
  selectedDate: Date | null = null;
  tempSelectedDate: Date | null = null;

  months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  showCalendar = false;
  years = Array.from({ length: 20 }, (_, i) => new Date().getFullYear() - 10 + i);
  currentMonth = new Date().getMonth();
  currentYear = new Date().getFullYear();
  days: (Date | null)[] = [];

  @ViewChild('calendar') calendarRef!: ElementRef;

  onChange: any = () => {};
  onTouched: any = () => {};

  writeValue(date: Date | string | null): void {
    if (date && typeof date === 'string') {
      this.selectedDate = moment(date, 'YYYY-MM-DD').toDate();
    }
    else if(!date) {
      this.selectedDate = null;
    }

    this.tempSelectedDate = this.selectedDate;

    if (this.selectedDate) {
      this.currentMonth = this.selectedDate.getMonth();
      this.currentYear = this.selectedDate.getFullYear();
      this.generateCalendar();
    }
    else {
      this.currentMonth = new Date().getMonth();
      this.currentYear = new Date().getFullYear();
      this.generateCalendar();
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    // Optional implementation
  }

  toggleCalendar() {
    this.showCalendar = !this.showCalendar;
    this.tempSelectedDate = this.selectedDate;
    if (this.showCalendar) this.writeValue(this.selectedDate);
  }

  generateCalendar() {
    const firstDay = new Date(this.currentYear, this.currentMonth, 1);
    const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);
    const startDay = firstDay.getDay();
    const daysInMonth = lastDay.getDate();
    this.days = [];

    for (let i = 0; i < startDay; i++) this.days.push(null);
    for (let i = 1; i <= daysInMonth; i++) {
      this.days.push(new Date(this.currentYear, this.currentMonth, i));
    }
  }

  isSelected(date: Date | null): boolean {
    return !!(date && this.tempSelectedDate && date.toDateString() === this.tempSelectedDate.toDateString());
  }

  selectDate(date: Date | null) {
    if (date) {
      this.tempSelectedDate = date;
    }
  }

  setToday() {
    const today = new Date();
    this.writeValue(today);
    this.onTouched();
    this.showCalendar = false;
  }

  clearDate() {
    this.selectedDate = null;
    this.onChange(null);
    this.onTouched();
    this.showCalendar = false;
  }

  closeCalendar() {
    this.showCalendar = false;
  }

  selectQuickDate(type: string) {
    const today = new Date();
    switch (type) {
      case 'today':
        this.selectDate(today);
        break;
      case 'nextMonday':
        this.selectDate(this.getNextWeekday(today, 1));
        break;
      case 'nextTuesday':
        this.selectDate(this.getNextWeekday(today, 2));
        break;
      case 'oneWeek':
        this.selectDate(new Date(today.setDate(today.getDate() + 7)));
        break;
    }
  }

  getNextWeekday(fromDate: Date, weekday: number): Date {
    const result = new Date(fromDate);
    result.setDate(fromDate.getDate() + ((7 + weekday - fromDate.getDay()) % 7 || 7));
    return result;
  }

  prevMonth() {
    if (this.currentMonth === 0) {
      this.currentMonth = 11;
      this.currentYear--;
    } else {
      this.currentMonth--;
    }
    this.generateCalendar();
  }

  nextMonth() {
    if (this.currentMonth === 11) {
      this.currentMonth = 0;
      this.currentYear++;
    } else {
      this.currentMonth++;
    }
    this.generateCalendar();
  }

  cancel() {
    this.showCalendar = false;
  }

  save() {
    if (this.tempSelectedDate) {
      this.selectedDate = this.tempSelectedDate;
      const formatted = moment(this.tempSelectedDate).format('YYYY-MM-DD');
      this.onChange(formatted);
    }
    this.onTouched();
    this.showCalendar = false;
  }

  isValidDate(date: any): boolean {
    return moment(date).isValid();
  }
  
  formatDate(date: any, format: string = 'MMM D, YYYY'): string {
    return moment(date).format(format);
  }
}
