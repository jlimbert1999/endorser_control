import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MenubarModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  items: MenuItem[] | undefined;

  ngOnInit() {
    this.items = [
      {
        label: 'Organizaciones',
        icon: 'pi pi-fw pi-list',
        routerLink: 'organizations',
      },
      {
        label: 'Avales',
        icon: 'pi pi-fw pi-id-card',
        routerLink: 'endorsers',
      },
      {
        label: 'Postulantes',
        icon: 'pi pi-fw pi-users',
        routerLink: 'applicants',
      },
      {
        label: 'Aceptados',
        icon: 'pi pi-fw pi-list',
      },
    ];
  }
}
