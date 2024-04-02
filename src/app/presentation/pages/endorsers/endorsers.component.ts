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
import { MatMenuModule } from '@angular/material/menu';
import { FormsModule } from '@angular/forms';

import { EndorserComponent } from './endorser/endorser.component';
import { EndorserService, PdfService } from '../../services';
import { MaterialModule } from '../../../material.module';
import { DetailApplicantsComponent } from './detail-applicants/detail-applicants.component';
import { DetailOfficersComponent } from './detail-officers/detail-officers.component';
import { Endorser } from '../../../domain/models';
import { PaginatorComponent } from '../../components';

@Component({
  selector: 'app-endorsers',
  standalone: true,
  imports: [
    CommonModule,
    EndorserComponent,
    MaterialModule,
    MatMenuModule,
    FormsModule,
    PaginatorComponent,
  ],
  templateUrl: './endorsers.component.html',
  styleUrl: './endorsers.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EndorsersComponent implements OnInit {
  private endorserService = inject(EndorserService);
  private pdfService = inject(PdfService);
  private dialog = inject(MatDialog);

  datasource = signal<Endorser[]>([]);
  datasize = signal(0);
  displayedColumns: string[] = [
    'name',
    'organization',
    'officers',
    'applicants',
    'options',
  ];
  term: string = '';
  index = signal(0);
  limit = signal(10);
  offset = computed(() => this.limit() * this.index());

  ngOnInit(): void {
    this.getData();
  }

  save() {}

  add(): void {
    const dialogRef = this.dialog.open(EndorserComponent, { width: '700px' });
    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;
      this.datasize.update((val) => (val += 1));
      this.datasource.update((values) => {
        return [result, ...values];
      });
    });
  }

  edit(endorser: Endorser) {
    const dialogRef = this.dialog.open(EndorserComponent, {
      width: '700px',
      data: endorser,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;
      this.datasource.update((values) => {
        const index = values.findIndex((el) => endorser.id === el.id);
        values[index] = result;
        return [...values];
      });
    });
  }

  getData() {
    const observable =
      this.term !== ''
        ? this.endorserService.search(this.term, this.limit(), this.offset())
        : this.endorserService.findAll(this.limit(), this.offset());
    observable.subscribe((data) => {
      this.datasource.set(data.endorsers);
      this.datasize.set(data.length);
    });
  }

  print() {
    this.pdfService.generateEndorsers('Listado de avales', this.datasource());
  }

  viewDetail(endorser: Endorser) {
    this.dialog.open(DetailApplicantsComponent, {
      data: endorser,
      autoFocus: false,
      width: '800px',
    });
  }

  viewDetailOfficer(endorser: Endorser) {
    this.dialog.open(DetailOfficersComponent, {
      data: endorser,
      autoFocus: false,
      width: '800px',
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
