import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { EndorserService } from '../../services/endorser.service';
import {
  applicantReponse,
  endorserResponse,
  organizationResponse,
} from '../../../infrastructure/interfaces';
import { OrganizationService } from '../../services/organization.service';
import { EndorserComponent } from './endorser/endorser.component';
import { PrimengModule } from '../../../primeng.module';
import { ApplicantService } from '../../services';

@Component({
  selector: 'app-endorsers',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PrimengModule,
    EndorserComponent,
  ],
  templateUrl: './endorsers.component.html',
  styleUrl: './endorsers.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EndorsersComponent implements OnInit {
  private endorserService = inject(EndorserService);
  private organizationService = inject(OrganizationService);
  private applicantService = inject(ApplicantService);
  private fb = inject(FormBuilder);

  Form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    organization: ['', Validators.required],
  });
  visible: boolean = false;
  dialogDetail = false;
  datasource = signal<endorserResponse[]>([]);
  organizations = signal<organizationResponse[]>([]);

  applicants: applicantReponse[] = [];

  ngOnInit(): void {
    this.getData();
  }

  create() {
    this.visible = true;
  }

  save() {
    this.endorserService
      .create(
        this.Form.get('name')!.value,
        this.Form.get('organization')!.value
      )
      .subscribe((resp) => {
        this.close();
        this.datasource.update((values) => [resp, ...values]);
      });
  }

  getData() {
    this.endorserService.findAll().subscribe((data) => {
      this.datasource.set(data.endorsers);
    });
  }

  searchOrganizations(term: string) {
    if (term === '') return;
    this.organizationService.searchAvailable(term).subscribe((data) => {
      this.organizations.set(data);
    });
  }

  getApplicantsByEndorser(id_endorser: string) {
    return this.applicantService
      .getApplicantByEndorser(id_endorser)
      .subscribe((data) => {
        console.log(data);
        this.applicants = data;
      });
  }

  viewDetail(endorser: endorserResponse) {
    this.dialogDetail = true;
    this.getApplicantsByEndorser(endorser._id);
  }

  close() {
    this.Form.reset({});
    this.visible = false;
  }
}
