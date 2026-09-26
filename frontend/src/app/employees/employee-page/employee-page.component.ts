import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeFormComponent } from '../employee-form/employee-form.component';
import { EmployeeListComponent } from '../employee-list/employee-list.component';
import { Employee, EmployeePayload } from '../../models/employee.model';
import { EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-employee-page',
  standalone: true,
  imports: [CommonModule, EmployeeFormComponent, EmployeeListComponent],
  templateUrl: './employee-page.component.html',
  styleUrl: './employee-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeePageComponent implements OnInit {
  private readonly employeeService = inject(EmployeeService);
  readonly employees$ = this.employeeService.employees$;
  readonly loading$ = this.employeeService.loading$;
  readonly error$ = this.employeeService.error$;

  selectedEmployee: Employee | null = null;
  successMessage: string | null = null;


  ngOnInit(): void {
    this.refresh();
  }

  refresh(): void {
    this.successMessage = null;
    this.employeeService.loadEmployees().subscribe({
      error: () => undefined
    });
  }

  editEmployee(employee: Employee): void {
    this.successMessage = null;
    this.employeeService.clearError();
    this.selectedEmployee = employee;
  }

  cancelEdit(): void {
    this.selectedEmployee = null;
  }

  saveEmployee(payload: EmployeePayload): void {
    this.successMessage = null;

    if (this.selectedEmployee) {
      this.employeeService
        .updateEmployee(this.selectedEmployee.id, payload)
        .subscribe({
          next: () => {
            this.selectedEmployee = null;
            this.successMessage = 'Empleado actualizado correctamente.';
          },
          error: () => undefined
        });
      return;
    }

    this.employeeService.createEmployee(payload).subscribe({
      next: () => {
        this.successMessage = 'Empleado creado correctamente.';
      },
      error: () => undefined
    });
  }

  deleteEmployee(id: string): void {
    const confirmed = window.confirm('¿Desea eliminar este empleado?');
    if (!confirmed) {
      return;
    }

    this.successMessage = null;

    this.employeeService.deleteEmployee(id).subscribe({
      next: () => {
        if (this.selectedEmployee?.id === id) {
          this.selectedEmployee = null;
        }
        this.successMessage = 'Empleado eliminado correctamente.';
      },
      error: () => undefined
    });
  }
}
