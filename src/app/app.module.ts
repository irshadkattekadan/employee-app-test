import { NgModule } from '@angular/core';
import { BrowserModule, HAMMER_GESTURE_CONFIG, HammerModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { EmployeeAddComponent } from './employee-add/employee-add.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatePickerComponent } from './date-picker/date-picker.component';
import { BottomSheetSelectComponent } from './bottom-sheet-select/bottom-sheet-select.component';
import { MyHammerConfig } from './services/hammer.config';

@NgModule({
  declarations: [
    AppComponent,
    EmployeeListComponent,
    EmployeeAddComponent,
    DatePickerComponent,
    BottomSheetSelectComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HammerModule
  ],
  providers: [
    { provide: HAMMER_GESTURE_CONFIG, useClass: MyHammerConfig }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
