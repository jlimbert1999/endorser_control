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
import { provideNativeDateAdapter } from '@angular/material/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [CommonModule, MaterialModule, FormsModule],
  templateUrl: './report.component.html',
  styleUrl: './report.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideNativeDateAdapter()],
})
export class ReportComponent implements OnInit {
  private applicantService = inject(ApplicantService);

  date: Date = new Date();
  applicants = signal<Applicant[]>([]);
  limit = signal<number>(10);
  index = signal<number>(0);
  offset = computed(() => this.limit() * this.index());

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this.applicantService
      .getCompleted(this.date, this.limit(), this.offset())
      .subscribe((data) => {
        this.applicants.set(data.applicants);
      });
  }
}
