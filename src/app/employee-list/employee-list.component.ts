import { Component, OnInit } from '@angular/core';
import { IndexedDbService } from '../services/indexed-db.service';
import { Employee } from '../models/Employee';
import { Router } from '@angular/router';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss']
})
export class EmployeeListComponent implements OnInit {
  currentEmployees: Employee[] = [];
  previousEmployees: Employee[] = [];
  loading = true;
  deletedEmployee: Employee | null = null;
  showUndoToast = false;
  undoTimeout: any;

  constructor(private dbService: IndexedDbService, private router: Router) {}

  ngOnInit(): void {
    setTimeout(() => this.loadEmployees(), 500);
  }

  loadEmployees(): void {
    this.dbService.getAll<Employee>('employees')
      .then(data => {
        const today = new Date().toISOString().split('T')[0];

        this.currentEmployees = data.filter(emp => !emp.toDate || emp.toDate >= today);
        this.previousEmployees = data.filter(emp => emp.toDate && emp.toDate < today);

        this.loading = false;
      })
      .catch(error => {
        console.error('Error fetching employees:', error);
        this.loading = false;
      });
  }

  goToAddPage() {
    this.router.navigate(['/add']);
  }

  onSwipe(emp: Employee): void {
    emp.showDelete = true;
  }
  
  onSwipeReset(emp: Employee): void {
    emp.showDelete = false;
  }
  
  

  deleteEmployee(emp: Employee): void {
    // Store deleted data temporarily
    this.deletedEmployee = { ...emp }; // Keep id & values
    this.showUndoToast = true;
  
    this.currentEmployees = this.currentEmployees.filter(e => e.id !== emp.id);
  
    // Delete from IndexedDB
    if (emp.id !== undefined) {
      this.dbService.delete('employees', emp.id).then(() => {
        console.log('Deleted from IndexedDB');
      });
    }
  
    // Auto hide toast after 5 seconds
    this.undoTimeout = setTimeout(() => {
      this.showUndoToast = false;
      this.deletedEmployee = null;
    }, 5000);
  }
  
  undoDelete(): void {
    if (this.deletedEmployee && this.deletedEmployee.id !== undefined) {
      delete this.deletedEmployee.showDelete;
      this.dbService.addWithId('employees', this.deletedEmployee as Employee & { id: number }).then(() => {
        this.currentEmployees.push(this.deletedEmployee!);
        this.deletedEmployee = null;
        this.showUndoToast = false;
        clearTimeout(this.undoTimeout);
      });
    }
  }

  capitalize(text: string): string {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  goToEditPage(emp: any) {
    emp.showDelete = false;
    this.router.navigate(['/edit', emp.id]);
  }
}