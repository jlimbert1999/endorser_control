import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from '../../../../material.module';
import { ApplicantService } from '../../../services';
import { ServerSelectSearchComponent } from '../../../components/server-select-search/server-select-search.component';
import { Applicant } from '../../../../domain/models/applicant.model';
import { chargeResponse } from '../../../../infrastructure/interfaces';

interface SelectOption {
  value: chargeResponse;
  text: string;
}
@Component({
  selector: 'app-accept',
  standalone: true,
  imports: [CommonModule, MaterialModule, ServerSelectSearchComponent],
  templateUrl: './accept.component.html',
  styleUrl: './accept.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AcceptComponent {
  public applicant: Applicant = inject(MAT_DIALOG_DATA);
  public applicantService = inject(ApplicantService);
  jobs = signal<SelectOption[]>([]);
  job: chargeResponse | undefined = undefined;
  private dialogRef = inject(MatDialogRef<AcceptComponent>);

  seaarchJobs(term: string) {
    this.applicantService.searchjobs(term).subscribe((data) => {
      this.jobs.set(
        data.map((el) => ({
          value: el,
          text: `${el.tipoContrato} - ${el.nombre}`,
        }))
      );
    });
  }

  setJob(value: chargeResponse) {
    this.job = value;
  }

  acept() {
    if (!this.job) return;
    this.applicantService
      .accept(this.applicant, {
        id_job: this.job._id,
        name: this.job.nombre,
        dni: this.applicant.dni,
      })
      .subscribe((data) => {
        this.dialogRef.close(data);
      });
  }
}
