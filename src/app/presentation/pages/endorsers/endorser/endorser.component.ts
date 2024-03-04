import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { organizationResponse } from '../../../../infrastructure/interfaces';
import { MaterialModule } from '../../../../material.module';
import { ServerSelectSearchComponent } from '../../../components/server-select-search/server-select-search.component';
import { EndorserService, OrganizationService } from '../../../services';
import { MatDialogRef } from '@angular/material/dialog';

interface SelectOption {
  text: string;
  value: string;
}
@Component({
  selector: 'endorser',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    ServerSelectSearchComponent,
  ],
  templateUrl: './endorser.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EndorserComponent implements OnInit {
  private organizationService = inject(OrganizationService);
  private endorserService = inject(EndorserService);
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<EndorserComponent>);
  organizations = signal<SelectOption[]>([]);
  Form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    organization: ['', Validators.required],
  });

  ngOnInit(): void {}

  searchOrganizations(term: string) {
    this.organizationService.searchAvailable(term).subscribe((data) => {
      this.organizations.set(
        data.map((el) => ({ text: el.name, value: el._id }))
      );
    });
  }
  setOrganization(value: string) {
    this.Form.get('organization')?.setValue(value);
  }

  save() {
    this.endorserService
      .create(
        this.Form.get('name')?.value!,
        this.Form.get('organization')?.value!
      )
      .subscribe((resp) => {
        this.dialogRef.close(resp);
      });
  }
}
