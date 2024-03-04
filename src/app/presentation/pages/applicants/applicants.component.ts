import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewChild,
  inject,
  signal,
} from '@angular/core';
import { TableModule } from 'primeng/table';
import { InputNumberModule } from 'primeng/inputnumber';
import { ApplicantService, EndorserService } from '../../services';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { read, utils } from 'xlsx';

import {
  applicantReponse,
  endorserResponse,
} from '../../../infrastructure/interfaces';
import { DataViewModule } from 'primeng/dataview';
import { PrimengModule } from '../../../primeng.module';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApplicantComponent } from './applicant/applicant.component';
import { UploadEvent } from 'primeng/fileupload';
import Swal from 'sweetalert2';
import { MaterialModule } from '../../../material.module';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { AcceptComponent } from './accept/accept.component';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Applicant } from '../../../domain/models/applicant.model';
@Component({
  selector: 'app-applicants',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    InputNumberModule,
    ReactiveFormsModule,
    DataViewModule,
    PrimengModule,
    ApplicantComponent,
    MaterialModule,
  ],
  templateUrl: './applicants.component.html',
  styleUrl: './applicants.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DialogService, MaterialModule],
  animations: [
    trigger('fadeInOut', [
      state('in', style({ opacity: 1 })),
      transition(':enter', [animate('0.5s ease-in-out')]),
      transition(':leave', [
        animate('0.5s ease-in-out', style({ opacity: 0 })),
      ]),
    ]),
  ],
})
export class ApplicantsComponent implements OnInit {
  private fb = inject(FormBuilder);
  private applicantService = inject(ApplicantService);
  private endorserService = inject(EndorserService);

  private dialog = inject(MatDialog);

  aceptApplincat: boolean = false;
  endorsers = signal<endorserResponse[]>([]);
  applicants = signal<applicantReponse[]>([]);
  selectedEndorsers = signal<endorserResponse[]>([]);
  applicant: applicantReponse | undefined;
  displayedColumns: string[] = [
    'fullname',
    'dni',
    'profile',
    'candidate',
    'endorsers',
    'options',
  ];
  dataSource!: MatTableDataSource<Applicant>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    this.applicantService.getApplicants().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data.applicants);
      this.dataSource.paginator = this.paginator;
    });
  }

  constructor(public dialogService: DialogService) {}

  add() {
    const dialogRef = this.dialog.open(ApplicantComponent, { width: '1000px' });
    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;
      this.dataSource = new MatTableDataSource([
        result,
        ...this.dataSource.data,
      ]);
      this.dataSource.paginator = this.paginator;
    });
  }

  edit(applicant: applicantReponse) {
    const dialogRef = this.dialog.open(ApplicantComponent, {
      data: applicant,
      width: '1000px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;
      const index = this.dataSource.data.findIndex(
        (el) => el._id === applicant._id
      );
      this.dataSource.data[index] = result;
      this.dataSource = new MatTableDataSource([...this.dataSource.data]);
      this.dataSource.paginator = this.paginator;
    });
  }

  searchEndorsers(term: string) {
    this.endorserService.searchAvailables(term).subscribe((endorsers) => {
      this.endorsers.set(endorsers);
    });
  }

  acept(applicant: applicantReponse) {
    const dialogRef = this.dialog.open(AcceptComponent, {
      data: applicant,
      width: '1000px',
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;
      const newdata = this.dataSource.data.filter(
        (el) => el._id !== applicant._id
      );
      this.dataSource = new MatTableDataSource(newdata);
      this.dataSource.paginator = this.paginator;
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
      Toast.fire({
        icon: 'success',
        position: 'bottom',
        title: 'Postulante aprobado',
      });
    });
  }

  async loadExcelFile() {
    const { value: file } = await Swal.fire({
      title: 'Seleccione el archivo a cargar',
      text: 'Formatos permitidos :ods, csv, xlsx',
      input: 'file',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      inputAttributes: {
        accept:
          '.ods, csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel',
        'aria-label': 'Cargar archivo excel',
      },
    });
    if (file) {
      const reader = new FileReader();
      reader.readAsBinaryString(file);
      reader.onload = (e) => {
        const wb = read(reader.result, {
          type: 'binary',
          cellDates: true,
        });
        const data = utils.sheet_to_json<any>(wb.Sheets[wb.SheetNames[1]]);
        this.applicantService.upload(data).subscribe((resp) => {
          console.log(resp);
        });
      };
    }
  }

  async loadOfficial() {
    const { value: file } = await Swal.fire({
      title: 'Seleccione el archivo a cargar',
      text: 'Formatos permitidos :ods, csv, xlsx',
      input: 'file',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      inputAttributes: {
        accept:
          '.ods, csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel',
        'aria-label': 'Cargar archivo excel',
      },
    });
    if (file) {
      const reader = new FileReader();
      reader.readAsBinaryString(file);
      reader.onload = (e) => {
        const wb = read(reader.result, {
          type: 'binary',
          cellDates: true,
        });
        const data = utils.sheet_to_json<any>(wb.Sheets[wb.SheetNames[0]]);
        console.log(data);
      };
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
