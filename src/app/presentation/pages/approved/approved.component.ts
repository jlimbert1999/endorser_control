import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { AlertService, ApplicantService } from '../../services';
import { Applicant } from '../../../domain/models/applicant.model';
import { MaterialModule } from '../../../material.module';
import { PaginatorComponent } from '../../components';
import { MatDialog } from '@angular/material/dialog';
import { OfficerRegisterComponent } from './officer-register/officer-register.component';
import { OfficerUpdateComponent } from './officer-update/officer-update.component';
import { ApplicantDocument } from '../../../domain/interfaces/applicant-document.enum';
import { AcceptComponent } from '../applicants/accept/accept.component';

@Component({
  selector: 'app-approved',
  standalone: true,
  imports: [CommonModule, MaterialModule, PaginatorComponent],
  templateUrl: './approved.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `.is-done {
    background-color: #D8F3DC;
  }
  `,
})
export class ApprovedComponent implements OnInit {
  private applicantService = inject(ApplicantService);
  private alertService = inject(AlertService);
  private dialog = inject(MatDialog);

  public columns = [
    'dni',
    'fullname',
    'profile',
    'candidate',
    'endorsers',
    'dj',
    'rj',
    's',
    'af',
    'options',
  ];
  public datasource = signal<Applicant[]>([]);
  public datasize = signal(0);
  public term = signal<string>('');
  public limit = signal(10);
  public index = signal(0);
  public offset = computed(() => this.index() * this.limit());

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    const observable =
      this.term() !== ''
        ? this.applicantService.search({
            limit: this.limit(),
            offset: this.offset(),
            term: this.term(),
            status: 'accepted',
          })
        : this.applicantService.findAll(
            'accepted',
            this.limit(),
            this.offset()
          );
    observable.subscribe((data) => {
      this.datasize.set(data.length);
      this.datasource.set(data.applicants);
    });
  }

  remove(applicant: Applicant) {
    this.alertService.QuestionAlert({
      title: `¿REMOVER POSTULANTE?`,
      text: `${applicant.fullname} - ${applicant.dni} pasara a la seccion de postulantes.`,
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

  accept(applicant: Applicant) {
    const dialogRef = this.dialog.open(AcceptComponent, {
      data: applicant,
      width: '800px',
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;
      this.datasource.update((values) => {
        const data = values.filter((el) => el._id !== applicant._id);
        return [...data];
      });
    });
  }

  update(applicant: Applicant) {
    const dialogRef = this.dialog.open(OfficerUpdateComponent, {
      width: '700px',
      data: applicant,
      autoFocus: false,
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

  changePage(data: { limit: number; index: number }) {
    this.index.set(data.index);
    this.limit.set(data.limit);
    this.getData();
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

  get file() {
    return ApplicantDocument;
  }
}
