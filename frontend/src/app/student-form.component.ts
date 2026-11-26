import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { catchError, EMPTY, finalize, of, switchMap } from 'rxjs';
import { Student, StudentInput, StudentService } from './student.service';

interface StudentForm {
  firstName: FormControl<string>;
  lastName: FormControl<string>;
  email: FormControl<string>;
  birthDate: FormControl<Date | null>;
  major: FormControl<string>;
  grade: FormControl<number | null>;
  programs: FormArray<FormControl<string>>;
}

@Component({
  imports: [ReactiveFormsModule, RouterLink, MatButtonModule, MatDatepickerModule, MatFormFieldModule,
    MatInputModule, MatSelectModule, MatSnackBarModule],
  providers: [provideNativeDateAdapter()],
  templateUrl: './student-form.component.html',
  styles: ['form { display: grid; align-items: start; } .program { display: flex; gap: .75rem; align-items: center; flex-wrap: wrap; }'],
})
export class StudentFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly students = inject(StudentService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly snackbar = inject(MatSnackBar);
  private readonly destroyRef = inject(DestroyRef);
  private original: Student | null = null;
  private studentId: number | null = null;
  readonly options = ['Informatique', 'Mathématiques', 'Physique'];
  readonly maxDate = new Date();
  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly error = signal('');
  readonly editing = signal(false);
  readonly ready = signal(false);
  readonly form: FormGroup<StudentForm> = this.fb.group({
    firstName: this.fb.nonNullable.control('', [Validators.required, Validators.minLength(2), Validators.pattern(/.*\S.*/)]),
    lastName: this.fb.nonNullable.control('', [Validators.required, Validators.minLength(2), Validators.pattern(/.*\S.*/)]),
    email: this.fb.nonNullable.control('', [Validators.required, Validators.email]),
    birthDate: this.fb.control<Date | null>(null, Validators.required),
    major: this.fb.nonNullable.control('', Validators.required),
    grade: this.fb.control<number | null>(null, [Validators.required, Validators.min(0), Validators.max(20), Validators.pattern(/^\d{1,2}(\.\d{1,2})?$/)]),
    programs: this.fb.array([this.programControl()]),
  });

  get programs() { return this.form.controls.programs; }

  ngOnInit(): void {
    this.route.paramMap.pipe(switchMap(params => {
      const value = params.get('id');
      this.editing.set(value !== null);
      this.original = null;
      this.ready.set(false);
      this.error.set('');
      this.studentId = value === null ? null : Number(value);
      if (this.studentId === null) return of(null);
      if (!Number.isSafeInteger(this.studentId) || this.studentId <= 0) {
        this.error.set('Identifiant étudiant invalide.');
        return EMPTY;
      }
      this.loading.set(true);
      return this.students.getStudent(this.studentId).pipe(
        catchError((error: Error) => {
          this.error.set(error.message);
          return EMPTY;
        }),
        finalize(() => this.loading.set(false)),
      );
    }), takeUntilDestroyed(this.destroyRef)).subscribe(student => {
      this.original = student;
      this.reset();
      this.ready.set(true);
    });
  }

  addProgram(): void { this.programs.push(this.programControl()); }
  removeProgram(index: number): void {
    if (this.programs.length > 1) this.programs.removeAt(index);
  }

  reset(): void {
    const entry = this.original;
    const birthDate = entry ? new Date(entry.birthDate + 'T00:00:00') : null;
    this.programs.clear();
    for (const value of entry?.programs.length ? entry.programs : ['']) {
      this.programs.push(this.programControl(value));
    }
    this.form.reset({
      firstName: entry?.firstName ?? '', lastName: entry?.lastName ?? '',
      email: entry?.email ?? '', birthDate, major: entry?.major ?? '',
      grade: entry?.grade ?? null, programs: entry?.programs.length ? entry.programs : [''],
    });
  }

  submit(): void {
    if (!this.ready() || this.saving()) return;
    this.form.markAllAsTouched();
    const { firstName, lastName, email, birthDate, major, grade, programs } = this.form.getRawValue();
    if (this.form.invalid || !birthDate || grade === null) return;
    const date = [birthDate.getFullYear(), birthDate.getMonth() + 1, birthDate.getDate()]
      .map((part, index) => String(part).padStart(index === 0 ? 4 : 2, '0')).join('-');
    const input: StudentInput = {
      firstName: firstName.trim(), lastName: lastName.trim(), email: email.trim(),
      birthDate: date, major, grade, programs: programs.map(program => program.trim()),
    };
    const edit = this.studentId !== null;
    const request = this.studentId === null
      ? this.students.createStudent(input)
      : this.students.updateStudent(this.studentId, input);
    this.saving.set(true);
    this.error.set('');
    request.pipe(takeUntilDestroyed(this.destroyRef), finalize(() => this.saving.set(false))).subscribe({
      next: () => {
        this.snackbar.open(edit ? 'Étudiant modifié' : 'Étudiant ajouté', 'Fermer', { duration: 3500 });
        void this.router.navigate(['/students']);
      },
      error: (error: Error) => this.error.set(error.message),
    });
  }

  private programControl(value = '') {
    return this.fb.nonNullable.control(value, [Validators.required, Validators.pattern(/.*\S.*/)]);
  }
}
