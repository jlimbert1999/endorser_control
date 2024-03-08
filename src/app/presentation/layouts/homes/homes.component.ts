import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-homes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './homes.component.html',
  styleUrl: './homes.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomesComponent {
  

  ngOnInit() {
    
  }
}
