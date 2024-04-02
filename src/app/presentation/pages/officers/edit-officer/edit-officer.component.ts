import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { Observable, debounceTime, filter, switchMap } from 'rxjs';
import { endorserResponse } from '../../../../infrastructure/interfaces';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EndorserService, OfficerService } from '../../../services';
import { Officer } from '../../../../domain/models/officer.model';
import { MatButtonModule } from '@angular/material/button';
import { endorser } from '../../../../domain/models';

@Component({
  selector: 'app-edit-officer',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatChipsModule,
    MatIconModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatButtonModule,
  ],
  templateUrl: './edit-officer.component.html',
  styleUrl: './edit-officer.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditOfficerComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  private endorserService = inject(EndorserService);
  private officerService = inject(OfficerService);
  private dialogRef = inject(MatDialogRef<EditOfficerComponent>);

  officer: Officer = inject(MAT_DIALOG_DATA);

  endorserCtrl = new FormControl('');
  filteredEndorsers!: Observable<endorserResponse[]>;
  endorsers: endorser[] = [];

  @ViewChild('endorserInput') endorserInput!: ElementRef<HTMLInputElement>;

  ngOnInit(): void {
    this.endorsers = [...this.officer.endorsers];
    this.filteredEndorsers = this.endorserCtrl.valueChanges.pipe(
      takeUntilDestroyed(this.destroyRef),
      filter((term) => !!term),
      debounceTime(350),
      switchMap((term) => this.endorserService.searchAvailables(term!))
    );
  }

  remove(fruit: endorser): void {
    const index = this.endorsers.indexOf(fruit);
    if (index >= 0) {
      this.endorsers.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const endorser = event.option.value;
    if (this.endorsers.some((el) => el._id === endorser._id)) return;
    this.endorsers.push(endorser);
    this.endorserInput.nativeElement.value = '';
    this.endorserCtrl.setValue(null);
  }

  save() {
    this.officerService
      .update(
        this.officer._id,
        this.endorsers.map((el) => el._id)
      )
      .subscribe((data) => {
        this.dialogRef.close(data);
      });
  }
}
