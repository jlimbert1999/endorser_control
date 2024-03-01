import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { TableModule } from 'primeng/table';
import { InputNumberModule } from 'primeng/inputnumber';
import { ApplicantService, EndorserService } from '../../services';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import {
  applicantReponse,
  endorserResponse,
} from '../../../infrastructure/interfaces';
import { DataViewModule } from 'primeng/dataview';
import { PrimengModule } from '../../../primeng.module';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApplicantComponent } from './applicant/applicant.component';
@Component({
  selector: 'app-applicants',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    InputNumberModule,
    ReactiveFormsModule,
    DataViewModule,
    PrimengModule,
    ApplicantComponent,
  ],
  templateUrl: './applicants.component.html',
  styleUrl: './applicants.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DialogService],
})
export class ApplicantsComponent implements OnInit {
  private fb = inject(FormBuilder);
  private applicantService = inject(ApplicantService);
  private endorserService = inject(EndorserService);

  visible = false;
  endorsers = signal<endorserResponse[]>([]);
  applicants = signal<applicantReponse[]>([]);
  selectedEndorsers = signal<endorserResponse[]>([]);
  applicant: applicantReponse | undefined;
  FormApplicant = this.fb.group({
    firstname: ['', [Validators.required]],
    middlename: ['', [Validators.required]],
    lastname: ['', [Validators.required]],
    dni: ['', [Validators.required]],
    professional_profile: ['', [Validators.required]],
    candidate_for: [''],
  });

  ngOnInit(): void {
    this.applicantService.getApplicants().subscribe((data) => {
      this.applicants.set(data.applicants);
    });
  }

  constructor(public dialogService: DialogService) {}

  save() {
    this.applicantService
      .create(this.selectedEndorsers(), this.FormApplicant.value)
      .subscribe((data) => {
        console.log(data);
      });
  }

  searchEndorsers(term: string) {
    this.endorserService.searchAvailables(term).subscribe((endorsers) => {
      this.endorsers.set(endorsers);
    });
  }

  edit(applicant: applicantReponse) {
    this.applicant = applicant;
    this.visible = true;
  }

  news() {
    this.visible = true;
  }

  close(data: applicantReponse | undefined) {
    this.visible = false;
    if (data) {
      this.applicants.update((values) => [data, ...values]);
    }
  }
}
