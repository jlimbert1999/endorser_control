import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { OrganizationService } from '../../../services';
import { organizationResponse } from '../../../../infrastructure/interfaces';

@Component({
  selector: 'app-organization',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './organization.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganizationComponent implements OnInit {
  private fb = inject(FormBuilder);
  private orgService = inject(OrganizationService);
  private dialogRef = inject(MatDialogRef<OrganizationComponent>);

  organization: organizationResponse | undefined = inject(MAT_DIALOG_DATA);

  Form = this.fb.nonNullable.group({
    name: ['', Validators.required],
  });

  ngOnInit(): void {
    if (this.organization) {
      this.Form.patchValue(this.organization);
    }
  }
  save() {
    if (this.organization) {
      this.orgService
        .update(this.organization._id, this.Form.value)
        .subscribe((data) => {
          this.dialogRef.close(data);
        });
    } else {
      this.orgService
        .create({ name: this.Form.get('name')?.value! })
        .subscribe((data) => {
          this.dialogRef.close(data);
        });
    }
  }
}
