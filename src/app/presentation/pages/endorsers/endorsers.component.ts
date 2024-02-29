import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

import { EndorserService } from '../../services/endorser.service';
import {
  endorserResponse,
  organizationResponse,
} from '../../../infrastructure/interfaces';
import { OrganizationService } from '../../services/organization.service';
import { EndorserComponent } from './endorser/endorser.component';
import { PrimengModule } from '../../../primeng.module';
import { ListboxFilterEvent } from 'primeng/listbox';

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
  providers: [DialogService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EndorsersComponent implements OnInit {
  private endorserService = inject(EndorserService);
  private organizationService = inject(OrganizationService);
  private dialog = inject(DialogService);
  private fb = inject(FormBuilder);

  visible: boolean = false;
  datasource = signal<endorserResponse[]>([]);
  organizations = signal<organizationResponse[]>([]);

  ngOnInit(): void {
    this.getData();
  }

  create() {
    this.visible = true;
  }

  save() {
    // this.endorserService
    //   .create(
    //     this.FormEndorser.get('name')!.value,
    //     this.FormEndorser.get('people')!.value
    //   )
    //   .subscribe((resp) => {
    //     console.log(resp);
    //     this.closeDialog();
    //     this.datasource.update((values) => [resp, ...values]);
    //   });
  }

  getData() {
    this.endorserService.findAll().subscribe((data) => {
      this.datasource.set(data.endorsers);
    });
  }

  searchOrganizations(term: string) {
    this.organizationService.findAll().subscribe((data) => {
      this.organizations.set(data.organizations);
    });
  }
}
