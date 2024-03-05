import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MaterialModule } from '../../../../material.module';

@Component({
  selector: 'app-officer-register',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './officer-register.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OfficerRegisterComponent {}
