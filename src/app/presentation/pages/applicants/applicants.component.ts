import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { read, utils } from 'xlsx';

import { ApplicantService } from '../../services';

import { applicantReponse } from '../../../infrastructure/interfaces';

import { ApplicantComponent } from './applicant/applicant.component';
import Swal from 'sweetalert2';
import { MaterialModule } from '../../../material.module';
import { AcceptComponent } from './accept/accept.component';
import { Applicant } from '../../../domain/models/applicant.model';
import { PaginatorComponent } from '../../components';
@Component({
  selector: 'app-applicants',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ApplicantComponent,
    MaterialModule,
    PaginatorComponent,
  ],
  templateUrl: './applicants.component.html',
  styleUrl: './applicants.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApplicantsComponent implements OnInit {
  private applicantService = inject(ApplicantService);
  private dialog = inject(MatDialog);

  displayedColumns = [
    'fullname',
    'dni',
    'profile',
    'candidate',
    'endorsers',
    'options',
  ];
  term = signal<string>('');
  datasource = signal<Applicant[]>([]);
  datasize = signal(0);
  limit = signal(10);
  index = signal(0);
  offset = computed(() => this.index() * this.limit());

  ngOnInit(): void {
    this.getData();
  }

  constructor() {}

  add() {
    const dialogRef = this.dialog.open(ApplicantComponent, { width: '1000px' });
    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;
    });
  }

  edit(applicant: applicantReponse) {
    const dialogRef = this.dialog.open(ApplicantComponent, {
      data: applicant,
      width: '1000px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;
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
    });
  }

  getData() {
    const observable =
      this.term() !== ''
        ? this.applicantService.search(this.limit(), this.offset(), this.term())
        : this.applicantService.findAll(this.limit(), this.offset());

    observable.subscribe(({ applicants, length }) => {
      this.datasource.set(applicants);
      this.datasize.set(length);
    });
  }

  chnagePage(data: { limit: number; index: number }) {
    this.limit.set(data.limit);
    this.index.set(data.index);
    this.getData();
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

  approve(applicant: Applicant) {
    this.applicantService.approve(applicant._id).subscribe((data) => {
      this.datasource.update((values) =>
        values.filter((el) => el._id !== applicant._id)
      );
    });
  }
  applyFilter(term: string) {
    console.log(term);
    if (term === '') return;
    this.term.set(term);
    this.getData();
  }
}
