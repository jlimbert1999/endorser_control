import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { MaterialModule } from '../../../../material.module';
import { ApplicantService } from '../../../services';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Applicant } from '../../../../domain/models/applicant.model';

@Component({
  selector: 'app-officer-update',
  standalone: true,
  imports: [CommonModule, OfficerUpdateComponent, MaterialModule, FormsModule],
  templateUrl: './officer-update.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OfficerUpdateComponent implements OnInit {
  private dialogRef = inject(MatDialogRef<OfficerUpdateComponent>);

  private applicantService = inject(ApplicantService);
  public applicant: Applicant = inject(MAT_DIALOG_DATA);

  documents: string[] = ['Declaracion jurada', 'Rejap', 'S', 'AF'];
  selectedDocuments: string[] = [];

  ngOnInit(): void {
    this.selectedDocuments = this.applicant.documents;
  }
  update() {
    this.applicantService
      .updateDocuments(this.applicant._id, this.selectedDocuments)
      .subscribe((resp) => {
        console.log(resp);
        this.dialogRef.close(resp);
      });
  }
}
