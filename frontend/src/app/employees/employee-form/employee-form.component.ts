import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  inject,
  OnChanges,
  Output,
  SimpleChanges
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Employee, EmployeePayload } from '../../models/employee.model';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './employee-form.component.html',
  styleUrl: './employee-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeeFormComponent implements OnChanges {
  private readonly formBuilder = inject(FormBuilder);
  @Input() employee: Employee | null = null;
  @Input() disabled = false;

  @Output() save = new EventEmitter<EmployeePayload>();
  @Output() cancel = new EventEmitter<void>();

  readonly form = this.formBuilder.nonNullable.group({
    nombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
    cargo: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
    departamento: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
    sueldo: [0, [Validators.required, Validators.min(0)]]
  });


  get isEditMode(): boolean {
    return this.employee !== null;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['employee']) {
      return;
    }

    if (this.employee) {
      this.form.reset({
        nombre: this.employee.nombre,
        cargo: this.employee.cargo,
        departamento: this.employee.departamento,
        sueldo: this.employee.sueldo
      });
    } else {
      this.form.reset({
        nombre: '',
        cargo: '',
        departamento: '',
        sueldo: 0
      });
    }
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.save.emit(this.form.getRawValue());
  }

  cancelEdit(): void {
    this.cancel.emit();
  }

  hasError(controlName: 'nombre' | 'cargo' | 'departamento' | 'sueldo'): boolean {
    const control = this.form.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }
}
