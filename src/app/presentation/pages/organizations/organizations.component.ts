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

import { organizationResponse } from '../../../infrastructure/interfaces';
import { OrganizationService } from '../../services';
import { PrimengModule } from '../../../primeng.module';

@Component({
  selector: 'app-organizations',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PrimengModule],
  templateUrl: './organizations.component.html',
  styleUrl: './organizations.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganizationsComponent implements OnInit {
  private organizationService = inject(OrganizationService);
  private fb = inject(FormBuilder);

  datasource = signal<organizationResponse[]>([]);
  visible: boolean = false;
  Form: FormGroup = this.fb.nonNullable.group({
    name: ['', Validators.required],
  });

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this.organizationService.findAll().subscribe((resp) => {
      this.datasource.set(resp.organizations);
    });
  }

  save() {
    this.organizationService
      .create(this.Form.value)
      .subscribe((organization) => {
        this.datasource.update((values) => {
          this.closeDialog();
          return [organization, ...values];
        });
      });
  }

  closeDialog() {
    this.visible = false;
    this.Form.reset({});
  }

  create() {
    this.visible = true;
  }
}
