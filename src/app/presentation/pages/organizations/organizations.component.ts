import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewChild,
  computed,
  inject,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MaterialModule } from '../../../material.module';
import { organizationResponse } from '../../../infrastructure/interfaces';
import { OrganizationService } from '../../services';
import { MatDialog } from '@angular/material/dialog';
import { OrganizationComponent } from './organization/organization.component';
import { PaginatorComponent } from '../../components';

@Component({
  selector: 'app-organizations',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    FormsModule,
    PaginatorComponent,
  ],
  templateUrl: './organizations.component.html',
  styleUrl: './organizations.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganizationsComponent implements OnInit {
  private organizationService = inject(OrganizationService);
  private fb = inject(FormBuilder);
  private dialog = inject(MatDialog);

  term: string = '';
  index = signal(0);
  limit = signal(10);
  offset = computed(() => this.limit() * this.index());

  datasource = signal<organizationResponse[]>([]);
  datasize = signal<number>(0);
  displayedColumns: string[] = ['name', 'options'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  Form: FormGroup = this.fb.nonNullable.group({
    name: ['', Validators.required],
  });

  constructor() {}

  ngOnInit(): void {
    this.getData();
  }

  add(): void {
    const dialogRef = this.dialog.open(OrganizationComponent, {
      width: '700px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;
      this.datasource.update((values) => {
        if (values.length === this.limit()) values.pop();
        return [result, ...values];
      });
      this.datasize.update((value) => (value += 1));
    });
  }

  edit(organization: organizationResponse) {
    const dialogRef = this.dialog.open(OrganizationComponent, {
      width: '700px',
      data: organization,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;
      this.datasource.update((values) => {
        const index = values.findIndex((el) => el._id === organization._id);
        values[index] = result;
        return [...values];
      });
    });
  }

  getData() {
    const observable =
      this.term !== ''
        ? this.organizationService.search(
            this.term,
            this.limit(),
            this.offset()
          )
        : this.organizationService.findAll(this.limit(), this.offset());
    observable.subscribe((data) => {
      this.datasource.set(data.organizations);
      this.datasize.set(data.length);
    });
  }

  changePage(params: { limit: number; index: number }) {
    this.limit.set(params.limit);
    this.index.set(params.index);
    this.getData();
  }

  applyFilter() {
    this.index.set(0);
    this.getData();
  }
}
