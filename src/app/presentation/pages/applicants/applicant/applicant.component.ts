import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable, debounceTime, filter, switchMap } from 'rxjs';
import { ApplicantService, EndorserService } from '../../../services';
import { MaterialModule } from '../../../../material.module';
import { Applicant, endorser } from '../../../../domain/models';
import { endorserResponse } from '../../../../infrastructure/interfaces';

@Component({
  selector: 'applicant',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, MaterialModule],
  templateUrl: './applicant.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApplicantComponent implements OnInit {
  private fb = inject(FormBuilder);
  private endorserService = inject(EndorserService);
  private applicantService = inject(ApplicantService);
  private dialogRef = inject(MatDialogRef<ApplicantComponent>);
  private destroyRef = inject(DestroyRef);

  applicant: Applicant | undefined = inject(MAT_DIALOG_DATA);
  FormApplicant = this.fb.group({
    firstname: ['', [Validators.required]],
    middlename: ['', [Validators.required]],
    lastname: [''],
    dni: ['', [Validators.required]],
    professional_profile: [''],
    candidate_for: [''],
    phone: [''],
  });

  endorserCtrl = new FormControl('');
  filteredEndorsers!: Observable<endorserResponse[]>;
  endorsers: endorser[] = [];

  @ViewChild('endorserInput') endorserInput!: ElementRef<HTMLInputElement>;

  ngOnInit(): void {
    this.filteredEndorsers = this.endorserCtrl.valueChanges.pipe(
      takeUntilDestroyed(this.destroyRef),
      filter((term) => !!term),
      debounceTime(350),
      switchMap((term) => this.endorserService.searchAvailables(term!))
    );
    if (this.applicant) {
      this.FormApplicant.patchValue(this.applicant);
      this.endorsers = [...this.applicant.endorsers];
    }
  }

  remove(fruit: endorser): void {
    const index = this.endorsers.indexOf(fruit);
    if (index >= 0) {
      this.endorsers.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const endorser = event.option.value;
    if (this.endorsers.some((el) => el._id === endorser._id)) return;
    this.endorsers.push(endorser);
    this.endorserInput.nativeElement.value = '';
    this.endorserCtrl.setValue(null);
  }

  save() {
    if (!this.applicant) {
      this.applicantService
        .create(this.endorsers, this.FormApplicant.value)
        .subscribe((data) => {
          this.dialogRef.close(data);
        });
    } else {
      this.applicantService
        .update(this.applicant._id, this.endorsers, this.FormApplicant.value)
        .subscribe((data) => {
          this.dialogRef.close(data);
        });
    }
  }
}
