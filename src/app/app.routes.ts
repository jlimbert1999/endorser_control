import { Routes } from '@angular/router';
import { HomeComponent } from './presentation/layouts/home/home.component';
import { ApplicantsComponent } from './presentation/pages/applicants/applicants.component';
import { EndorsersComponent } from './presentation/pages/endorsers/endorsers.component';
import { OrganizationsComponent } from './presentation/pages/organizations/organizations.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      { path: 'applicants', component: ApplicantsComponent },
      { path: 'endorsers', component: EndorsersComponent },
      { path: 'organizations', component: OrganizationsComponent },
    ],
  },
];