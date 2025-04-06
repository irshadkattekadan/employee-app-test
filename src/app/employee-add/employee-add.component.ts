import { Component, OnInit } from '@angular/core';
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
export class EmployeeAddComponent implements OnInit {
  employeeForm!: FormGroup;
  isEditMode = false;
  employeeId?: number;
  roles = ['Product Designer', 'Flutter Developer', 'QA Tester', 'Product Owner'];
  
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private indexedDbService: IndexedDbService,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.employeeForm = this.fb.group({
      name: ['', Validators.required],
      role: ['', Validators.required],
      fromDate: [moment().format("YYYY-MM-DD"), Validators.required],
      toDate: ['']
    });

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      this.employeeId = +idParam;

      this.indexedDbService.getByKey<Employee>('employees', this.employeeId)
        .then(employee => {
          if (employee) {
            this.employeeForm.patchValue(employee);
          } else {
            console.error('Employee not found');
            this.router.navigate(['/']);
          }
        });
    }
  }

  saveEmployee(): void {
    if (this.employeeForm.valid) {
      const formValue = this.employeeForm.value;

      if (this.isEditMode && this.employeeId !== undefined) {
        const updatedEmployee = {
          ...this.employeeForm.value,
          id: this.employeeId // this must be a defined number
        };

        if (updatedEmployee.id !== undefined) {
          this.indexedDbService.update('employees', updatedEmployee)
            .then(() => this.router.navigate(['']))
            .catch(err => console.error('Error updating employee:', err));
        } else {
          console.error('Employee ID is missing for update');
        }
      } else {
        this.indexedDbService.add('employees', this.employeeForm.value)
        .then(() => this.router.navigate(['']))
        .catch(err => console.error('Error saving employee:', err));
        
      }
    }
    else {
      this.employeeForm.markAllAsTouched();
    }
  }

  cancel(): void {
    this.router.navigate(['']);
  }
}
