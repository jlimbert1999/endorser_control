import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { ApplicantService } from '../../services';
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
  private dialog = inject(MatDialog);

  public columns = [
    'fullname',
    'dni',
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
    this.applicantService
      .getApproved(this.limit(), this.offset())
      .subscribe((data) => {
        this.datasize.set(data.length);
        this.datasource.set(data.applicants);
      });
  }

  changePage(params: { limit: number; index: number }) {}

  applyFilter(term: string) {}

  approve(applicant: Applicant) {
    this.applicantService.approve(applicant._id).subscribe((data) => {
      console.log(data);
    });
  }

  accept(applicant: Applicant) {
    const dialogRef = this.dialog.open(AcceptComponent, {
      data: applicant,
      width: '1000px',
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;
      this.datasource.update((values) =>
        values.filter((el) => el._id !== applicant._id)
      );
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

  get file() {
    return ApplicantDocument;
  }
}
