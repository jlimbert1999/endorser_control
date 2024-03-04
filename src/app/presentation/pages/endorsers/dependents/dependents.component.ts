import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { ApplicantService, EndorserService } from '../../../services';
import { MaterialModule } from '../../../../material.module';
import {
  applicantReponse,
  endorserResponse,
} from '../../../../infrastructure/interfaces';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dependents',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './dependents.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DependentsComponent implements OnInit {
  applicants = signal<applicantReponse[]>([]);
  private applicantService = inject(ApplicantService);
  public endorser: endorserResponse = inject(MAT_DIALOG_DATA);

  ngOnInit(): void {
    this.applicantService
      .getApplicantByEndorser(this.endorser._id)
      .subscribe((data) => {
        this.applicants.set(data);
      });
  }
}
