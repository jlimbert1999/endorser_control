import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewChild,
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
import { MaterialModule } from '../../../material.module';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { DependentsComponent } from './dependents/dependents.component';

@Component({
  selector: 'app-endorsers',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PrimengModule,
    EndorserComponent,
    MaterialModule,
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
  private dialog = inject(MatDialog);

  visible: boolean = false;
  dialogDetail = false;
  datasource = signal<endorserResponse[]>([]);
  organizations = signal<organizationResponse[]>([]);

  applicants: applicantReponse[] = [];

  displayedColumns: string[] = ['name', 'organization', 'options'];
  dataSource!: MatTableDataSource<endorserResponse>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    this.getData();
  }

  create() {
    this.visible = true;
  }

  save() {}

  add(): void {
    const dialogRef = this.dialog.open(EndorserComponent, { width: '700px' });
    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;
      this.dataSource = new MatTableDataSource([
        result,
        ...this.dataSource.data,
      ]);
      this.dataSource.paginator = this.paginator;
    });
  }

  getData() {
    this.endorserService.findAll().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data.endorsers);
      this.dataSource.paginator = this.paginator;
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
    this.dialog.open(DependentsComponent, { data: endorser, width:'800px' });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
