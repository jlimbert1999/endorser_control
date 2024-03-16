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
import { MatDialog } from '@angular/material/dialog';
import { OrganizationComponent } from './organization/organization.component';

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
  private dialog = inject(MatDialog);

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
      this.dataSource = new MatTableDataSource(resp.organizations);
      this.dataSource.paginator = this.paginator;
    });
  }

  add(): void {
    const dialogRef = this.dialog.open(OrganizationComponent, { width: '700px' });
    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;
      this.dataSource = new MatTableDataSource([
        result,
        ...this.dataSource.data,
      ]);
      this.dataSource.paginator = this.paginator;
    });
  }
}
