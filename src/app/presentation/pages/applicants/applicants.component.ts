import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AlertService, ApplicantService } from '../../services';
import { ApplicantComponent } from './applicant/applicant.component';
import { MaterialModule } from '../../../material.module';
import { Applicant } from '../../../domain/models/applicant.model';
import { PaginatorComponent } from '../../components';
// import Swal from 'sweetalert2';
// import { read, utils } from 'xlsx';
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
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class ApplicantsComponent implements OnInit {
  private applicantService = inject(ApplicantService);
  private alertService = inject(AlertService);
  private dialog = inject(MatDialog);

  expandedElement: any | null;
  displayedColumns = [
    'dni',
    'phone',
    'fullname',
    'profile',
    'candidate',
    'expand',
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

  getData() {
    const observable =
      this.term() !== ''
        ? this.applicantService.search(this.term(), {
            limit: this.limit(),
            offset: this.offset(),
            status: 'pending',
          })
        : this.applicantService.findAll({
            status: 'pending',
            limit: this.limit(),
            offset: this.offset(),
          });
    observable.subscribe(({ applicants, length }) => {
      this.datasource.set(applicants);
      this.datasize.set(length);
    });
  }

  add() {
    const dialogRef = this.dialog.open(ApplicantComponent, {
      width: '1000px',
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;
      this.datasize.update((value) => (value += 1));
      this.datasource.update((values) => [result, ...values]);
    });
  }

  edit(applicant: Applicant) {
    const dialogRef = this.dialog.open(ApplicantComponent, {
      data: applicant,
      autoFocus: false,
      width: '1000px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;
      this.datasource.update((values) => {
        const index = values.findIndex((el) => el._id === applicant._id);
        values[index] = result;
        return [...values];
      });
    });
  }

  chnagePage(data: { limit: number; index: number }) {
    this.limit.set(data.limit);
    this.index.set(data.index);
    this.getData();
  }

  approve(applicant: Applicant) {
    this.alertService.QuestionAlert({
      title: `¿APROBAR POSTULANTE?`,
      text: `${applicant.fullname} - ${applicant.dni} pasara a la seccion de aprobados.`,
      callback: () => {
        this.applicantService.toggleAproved(applicant._id).subscribe(() => {
          this.datasource.update((values) =>
            values.filter((el) => el._id !== applicant._id)
          );
          this.datasize.update((value) => (value -= 1));
        });
      },
    });
  }

  applyFilter(term: string) {
    if (term === '') return;
    this.term.set(term);
    this.index.set(0);
    this.getData();
  }

  cancelFilter() {
    this.term.set('');
    this.index.set(0);
    this.getData();
  }

  // async loadExcelFile() {
  //   const { value: file } = await Swal.fire({
  //     title: 'Seleccione el archivo a cargar',
  //     text: 'Formatos permitidos :ods, csv, xlsx',
  //     input: 'file',
  //     showCancelButton: true,
  //     confirmButtonText: 'Aceptar',
  //     cancelButtonText: 'Cancelar',
  //     inputAttributes: {
  //       accept:
  //         '.ods, csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel',
  //       'aria-label': 'Cargar archivo excel',
  //     },
  //   });
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.readAsBinaryString(file);
  //     reader.onload = (e) => {
  //       const wb = read(reader.result, {
  //         type: 'binary',
  //         cellDates: true,
  //       });
  //       const data = utils.sheet_to_json(wb.Sheets[wb.SheetNames[1]]);
  //       this.applicantService.upload(data).subscribe((resp) => {});
  //     };
  //   }
  // }
}
