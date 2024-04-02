import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from '../../../../material.module';
import { ServerSelectSearchComponent } from '../../../components/server-select-search/server-select-search.component';
import { EndorserService, OrganizationService } from '../../../services';
import { Endorser } from '../../../../domain/models';

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

  endorser: Endorser | undefined = inject(MAT_DIALOG_DATA);
  organizations = signal<SelectOption[]>([]);
  currentOrganization: string = '';
  Form: FormGroup = this.fb.nonNullable.group({
    name: ['', Validators.required],
    organization: ['', Validators.required],
  });

  ngOnInit(): void {
    if (this.endorser) {
      const { name, organization } = this.endorser;
      if (organization) {
        this.organizations.set([
          { value: organization._id, text: organization.name },
        ]);
      }
      this.Form.patchValue({
        name: name,
        organization: organization?._id,
      });
    }
  }

  searchOrganizations(term: string) {
    this.organizationService.searchAvailable(term).subscribe((data) => {
      this.organizations.set(
        data.map((el) => ({ text: el.name, value: el._id }))
      );
    });
  }
  setOrganization(value: string | undefined) {
    this.Form.get('organization')?.setValue(value ?? '');
  }

  save() {
    if (this.endorser) {
      this.endorserService
        .update(this.endorser, this.Form.value)
        .subscribe((resp) => {
          this.dialogRef.close(resp);
        });
    } else {
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
}
