import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, finalize, map, tap, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  ApiErrorResponse,
  ApiSuccessResponse,
  Employee,
  EmployeePayload,
  UpdateEmployeePayload
} from '../models/employee.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private readonly endpoint = `${environment.apiUrl}/empleados`;

  private readonly employeesSubject = new BehaviorSubject<Employee[]>([]);
  readonly employees$ = this.employeesSubject.asObservable();

  private readonly loadingSubject = new BehaviorSubject<boolean>(false);
  readonly loading$ = this.loadingSubject.asObservable();

  private readonly errorSubject = new BehaviorSubject<string | null>(null);
  readonly error$ = this.errorSubject.asObservable();

  constructor(private readonly http: HttpClient) {}

  loadEmployees(): Observable<Employee[]> {
    this.beginRequest();

    return this.http
      .get<ApiSuccessResponse<Employee[]>>(this.endpoint)
      .pipe(
        map((response) => response.data),
        tap((employees) => {
          this.employeesSubject.next([...employees]);
        }),
        catchError((error: HttpErrorResponse) => this.handleError(error)),
        finalize(() => this.loadingSubject.next(false))
      );
  }

  createEmployee(payload: EmployeePayload): Observable<Employee> {
    this.beginRequest();

    return this.http
      .post<ApiSuccessResponse<Employee>>(this.endpoint, payload)
      .pipe(
        map((response) => response.data),
        tap((employee) => {
          const current = this.employeesSubject.value;
          this.employeesSubject.next([...current, employee]);
        }),
        catchError((error: HttpErrorResponse) => this.handleError(error)),
        finalize(() => this.loadingSubject.next(false))
      );
  }

  updateEmployee(
    id: string,
    payload: UpdateEmployeePayload
  ): Observable<Employee> {
    this.beginRequest();

    return this.http
      .put<ApiSuccessResponse<Employee>>(`${this.endpoint}/${id}`, payload)
      .pipe(
        map((response) => response.data),
        tap((updatedEmployee) => {
          const current = this.employeesSubject.value;
          const nextState = current.map((employee) =>
            employee.id === updatedEmployee.id ? updatedEmployee : employee
          );
          this.employeesSubject.next(nextState);
        }),
        catchError((error: HttpErrorResponse) => this.handleError(error)),
        finalize(() => this.loadingSubject.next(false))
      );
  }

  deleteEmployee(id: string): Observable<void> {
    this.beginRequest();

    return this.http
      .delete<ApiSuccessResponse<null>>(`${this.endpoint}/${id}`)
      .pipe(
        tap(() => {
          const current = this.employeesSubject.value;
          this.employeesSubject.next(
            current.filter((employee) => employee.id !== id)
          );
        }),
        map(() => undefined),
        catchError((error: HttpErrorResponse) => this.handleError(error)),
        finalize(() => this.loadingSubject.next(false))
      );
  }

  clearError(): void {
    this.errorSubject.next(null);
  }

  private beginRequest(): void {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    const apiError = error.error as ApiErrorResponse | undefined;
    const message =
      apiError?.error?.message ??
      'No fue posible completar la operación. Verifique que el backend esté disponible.';

    this.errorSubject.next(message);
    return throwError(() => error);
  }
}
