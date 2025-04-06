import { Component, computed, effect, signal } from '@angular/core';
import { Employee } from '../models/Employee';
import { ActivatedRoute, Router } from '@angular/router';
import { IndexedDbService } from '../services/indexed-db.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'app-employee-add',
  templateUrl: './employee-add.component.html',
  styleUrls: ['./employee-add.component.scss']
})
export class EmployeeAddComponent {
  employeeForm = signal<FormGroup>(
    this.fb.group({
      name: ['', Validators.required],
      role: ['', Validators.required],
      fromDate: [moment().format("YYYY-MM-DD"), Validators.required],
      toDate: ['']
    })
  );

  employeeId = signal<number | undefined>(undefined);

  isEditMode = computed(() => this.employeeId() !== undefined);

  roles = ['Product Designer', 'Flutter Developer', 'QA Tester', 'Product Owner'];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private indexedDbService: IndexedDbService,
    private fb: FormBuilder
  ) {
    const idParam = this.route.snapshot.paramMap.get('id');

    if (idParam) {
      const id = +idParam;
      this.employeeId.set(id);

      this.indexedDbService.getByKey<Employee>('employees', id).then(employee => {
        if (employee) {
          this.employeeForm().patchValue(employee);
        } else {
          console.error('Employee not found');
          this.router.navigate(['/']);
        }
      });
    }

    effect(() => {
      const form = this.employeeForm();
      if (form.valid) {
        console.log('Form is valid:', form.value);
      }
    });
  }

  saveEmployee(): void {
    const form = this.employeeForm();

    if (form.valid) {
      const formValue = form.value;

      if (this.isEditMode() && this.employeeId() !== undefined) {
        const updatedEmployee = {
          ...formValue,
          id: this.employeeId()!
        };

        this.indexedDbService.update('employees', updatedEmployee)
          .then(() => this.router.navigate(['']))
          .catch(err => console.error('Error updating employee:', err));
      } else {
        this.indexedDbService.add('employees', formValue)
          .then(() => this.router.navigate(['']))
          .catch(err => console.error('Error saving employee:', err));
      }
    } else {
      form.markAllAsTouched();
    }
  }

  cancel(): void {
    this.router.navigate(['']);
  }
}
