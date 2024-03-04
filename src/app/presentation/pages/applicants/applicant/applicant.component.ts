import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  inject,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { debounceTime } from 'rxjs';
import { PrimengModule } from '../../../../primeng.module';
import {
  applicantReponse,
  endorserResponse,
} from '../../../../infrastructure/interfaces';
import { ApplicantService, EndorserService } from '../../../services';
import { MaterialModule } from '../../../../material.module';
import { ServerSelectSearchComponent } from '../../../components/server-select-search/server-select-search.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

interface SelectOption {
  value: endorserResponse;
  text: string;
}
@Component({
  selector: 'applicant',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    PrimengModule,
    MaterialModule,
    ServerSelectSearchComponent,
  ],
  templateUrl: './applicant.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApplicantComponent implements OnInit {
  private fb = inject(FormBuilder);
  private endorserService = inject(EndorserService);
  private applicantService = inject(ApplicantService);

  public applicant: applicantReponse | undefined = inject(MAT_DIALOG_DATA);
  private dialogRef = inject(MatDialogRef<ApplicantComponent>);

  endorsers = signal<SelectOption[]>([]);
  selectedEndorsers: endorserResponse[] = [];
  FormApplicant = this.fb.group({
    firstname: ['', [Validators.required]],
    middlename: ['', [Validators.required]],
    lastname: [''],
    dni: ['', [Validators.required]],
    professional_profile: [''],
    candidate_for: [''],
  });

  ngOnInit(): void {
    this.FormApplicant.patchValue(this.applicant ?? {});
    if (this.applicant) {
      this.selectedEndorsers = this.applicant.endorsers;
    }
  }

  searchEndorsers(term: string) {
    this.endorserService
      .searchAvailables(term)
      .pipe(debounceTime(300))
      .subscribe((endorsers) => {
        this.endorsers.set(
          endorsers.map((el) => ({ value: el, text: el.name }))
        );
      });
  }
  setEndorser(value: endorserResponse) {
    const exist = this.selectedEndorsers.some((el) => el._id === value._id);
    if (exist) return;
    this.selectedEndorsers.push(value);
  }

  remove(value: endorserResponse) {
    this.selectedEndorsers = this.selectedEndorsers.filter(
      (el) => el._id !== value._id
    );
  }

  save() {
    if (!this.applicant) {
      this.applicantService
        .create(this.selectedEndorsers, this.FormApplicant.value)
        .subscribe((data) => {
          this.dialogRef.close(data);
        });
    } else {
      this.applicantService
        .update(
          this.applicant._id,
          this.selectedEndorsers,
          this.FormApplicant.value
        )
        .subscribe((data) => {
          this.dialogRef.close(data);
        });
    }
  }
}
