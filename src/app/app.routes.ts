import { Routes } from '@angular/router';
import { HomesComponent } from './presentation/layouts/homes/homes.component';
import { ApplicantsComponent } from './presentation/pages/applicants/applicants.component';
import { EndorsersComponent } from './presentation/pages/endorsers/endorsers.component';
import { OrganizationsComponent } from './presentation/pages/organizations/organizations.component';
import { HomeComponent } from './presentation/layouts/home/home.component';
import { ApprovedComponent } from './presentation/pages/approved/approved.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: 'approved',
        component: ApprovedComponent,
        title: 'Aprobados',
      },
      {
        path: 'applicants',
        component: ApplicantsComponent,
        title: 'Postulantes',
      },
      { path: 'endorsers', component: EndorsersComponent, title: 'Avales' },
      {
        path: 'organizations',
        component: OrganizationsComponent,
        title: 'Organizaciones',
      },
    ],
  },
];
