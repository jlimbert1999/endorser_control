import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { OrganizationService } from '../../../services';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

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
export class OrganizationComponent {
  private fb = inject(FormBuilder);
  private orgService = inject(OrganizationService);
  private dialogRef = inject(MatDialogRef<OrganizationComponent>);

  Form = this.fb.nonNullable.group({
    name: ['', Validators.required],
  });

  save() {
    this.orgService
      .create({ name: this.Form.get('name')?.value! })
      .subscribe((data) => {
        this.dialogRef.close(data);
      });
  }
}
