import { Component, OnInit, computed, inject, signal } from '@angular/core';

import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../material.module';
import { OfficerService } from '../../services';
import { Officer } from '../../../domain/models/officer.model';
import { PaginatorComponent } from '../../components';
import Swal from 'sweetalert2';
import { read, utils } from 'xlsx';
import { MatDialog } from '@angular/material/dialog';
import { EditOfficerComponent } from './edit-officer/edit-officer.component';

@Component({
  selector: 'app-officers',
  templateUrl: './officers.component.html',
  styleUrl: './officers.component.css',
  standalone: true,
  imports: [CommonModule, MaterialModule, PaginatorComponent],
})
export class OfficersComponent implements OnInit {
  private dialog = inject(MatDialog);

  datasource = signal<Officer[]>([]);
  datasize = signal(0);
  displaycolumns = [
    'group',
    'level',
    'code',
    'dni',
    'name',
    'job',
    'endorsers',
    'options',
  ];
  public limit = signal(10);
  public index = signal(0);
  public offset = computed(() => this.index() * this.limit());
  public term = signal<string>('');

  constructor(private officerService: OfficerService) {}

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    const observable =
      this.term() !== ''
        ? this.officerService.search(this.term(), this.limit(), this.offset())
        : this.officerService.findAll(this.limit(), this.offset());
    observable.subscribe((data) => {
      this.datasource.set(data.officers);
      this.datasize.set(data.length);
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
        const data = utils.sheet_to_json<any>(wb.Sheets[wb.SheetNames[0]]);
        this.officerService.upload(data).subscribe((resp) => {
        });
      };
    }
  }

  edit(applicant: Officer) {
    const dialogRef = this.dialog.open(EditOfficerComponent, {
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

  applyFilter(term: string) {
    this.term.set(term);
    this.index.set(0);
    this.getData();
  }

  cancelFilter() {
    this.term.set('');
    this.index.set(0);
    this.getData();
  }

  changePage(data: { limit: number; index: number }) {
    this.index.set(data.index);
    this.limit.set(data.limit);
    this.getData();
  }
}
