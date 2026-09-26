import { ChangeDetectionStrategy, Component } from '@angular/core';
import { EmployeePageComponent } from './employees/employee-page/employee-page.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [EmployeePageComponent],
  template: '<app-employee-page />',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {}
