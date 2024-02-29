import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { organizationResponse } from '../../../../infrastructure/interfaces';
import { PrimengModule } from '../../../../primeng.module';

@Component({
  selector: 'endorser',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PrimengModule],
  templateUrl: './endorser.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EndorserComponent implements OnInit {
  private fb = inject(FormBuilder);

  organizations = signal<organizationResponse[]>([]);
  FormEndorser = this.fb.nonNullable.group({
    name: ['', Validators.required],
  });

  ngOnInit(): void {
    console.log('create started');
  }
}
