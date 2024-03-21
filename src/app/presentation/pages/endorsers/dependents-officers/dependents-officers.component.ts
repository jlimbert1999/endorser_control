import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { Officer } from '../../../../domain/models/officer.model';
import { OfficerService } from '../../../services';
import {
  endorserResponse,
  officerResponse,
} from '../../../../infrastructure/interfaces';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FilterOfficerPipe } from '../../../pipes/filter-officer.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-dependents-officers',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatIconModule,
    MatListModule,
    MatButtonModule,
    MatFormFieldModule,
    FilterOfficerPipe,
    FormsModule,
    MatInputModule,
  ],
  templateUrl: './dependents-officers.component.html',
  styleUrl: './dependents-officers.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DependentsOfficersComponent {
  officers = signal<officerResponse[]>([]);
  private officerService = inject(OfficerService);
  public endorser: endorserResponse = inject(MAT_DIALOG_DATA);
  term = '';

  ngOnInit(): void {
    this.officerService.getByEndorser(this.endorser._id).subscribe((data) => {
      this.officers.set(data);
    });
  }
}
