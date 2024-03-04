import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MaterialModule } from '../../../material.module';
import { organizationResponse } from '../../../infrastructure/interfaces';
import { OrganizationService } from '../../services';

@Component({
  selector: 'app-organizations',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  templateUrl: './organizations.component.html',
  styleUrl: './organizations.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganizationsComponent implements OnInit {
  private organizationService = inject(OrganizationService);
  private fb = inject(FormBuilder);

  displayedColumns: string[] = ['name', 'options'];
  dataSource!: MatTableDataSource<organizationResponse>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  Form: FormGroup = this.fb.nonNullable.group({
    name: ['', Validators.required],
  });

  constructor() {}

  ngOnInit(): void {
    this.getData();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getData() {
    this.organizationService.findAll().subscribe((resp) => {
      console.log(resp.organizations);
      this.dataSource = new MatTableDataSource(resp.organizations);
      this.dataSource.paginator = this.paginator;
    });
  }

  save() {
    this.organizationService
      .create(this.Form.value)
      .subscribe((organization) => {
        // this.datasource.update((values) => {
        //   return [organization, ...values];
        // });
      });
  }
}
