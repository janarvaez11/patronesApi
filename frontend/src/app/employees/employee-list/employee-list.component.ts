import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Employee } from '../../models/employee.model';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, CurrencyPipe],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeeListComponent {
  @Input() employees: Employee[] = [];
  @Input() disabled = false;

  @Output() edit = new EventEmitter<Employee>();
  @Output() remove = new EventEmitter<string>();

  trackById(_index: number, employee: Employee): string {
    return employee.id;
  }
}
