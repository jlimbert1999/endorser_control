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

@Component({
  selector: 'applicant',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, PrimengModule],
  templateUrl: './applicant.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApplicantComponent implements OnInit {
  @Input() visible = false;
  @Input() set applicant(val: applicantReponse | undefined) {
    const { endorsers, ...props } = val ?? {};
    this.FormApplicant.patchValue(props);
    if (endorsers) {
      console.log(endorsers);
      this.selectedEndorsers = endorsers;
    }
  }
  @Output() close: EventEmitter<applicantReponse | undefined> =
    new EventEmitter();

  private fb = inject(FormBuilder);
  private endorserService = inject(EndorserService);
  private applicantService = inject(ApplicantService);

  endorsers = signal<endorserResponse[]>([]);
  selectedEndorsers: endorserResponse[] = [];
  FormApplicant = this.fb.group({
    firstname: ['', [Validators.required]],
    middlename: ['', [Validators.required]],
    lastname: ['', [Validators.required]],
    dni: ['', [Validators.required]],
    professional_profile: ['', [Validators.required]],
    candidate_for: [''],
  });

  ngOnInit(): void {
    console.log(this.applicant);
    this.FormApplicant.patchValue(this.applicant ?? {});
  }

  searchEndorsers(term: string) {
    this.endorserService
      .searchAvailables(term)
      .pipe(debounceTime(300))
      .subscribe((endorsers) => {
        this.endorsers.set(endorsers);
      });
  }

  save() {
    this.applicantService
      .create(this.selectedEndorsers, this.FormApplicant.value)
      .subscribe((data) => {
        this.FormApplicant.reset({});
        this.selectedEndorsers = [];
        this.endorsers.set([]);
        this.close.emit(data);
      });
  }

  cancel() {
    this.FormApplicant.reset({});
    this.selectedEndorsers = [];
    this.endorsers.set([]);
    this.close.emit(undefined);
  }

}
