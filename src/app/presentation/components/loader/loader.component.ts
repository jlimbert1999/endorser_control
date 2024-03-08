import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { MaterialModule } from '../../../material.module';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  template: `<mat-spinner [diameter]="180" [strokeWidth]="15"/>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoaderComponent {}
