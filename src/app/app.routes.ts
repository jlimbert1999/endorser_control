import { Routes } from '@angular/router';
import { ApplicantsComponent } from './presentation/pages/applicants/applicants.component';
import { EndorsersComponent } from './presentation/pages/endorsers/endorsers.component';
import { OrganizationsComponent } from './presentation/pages/organizations/organizations.component';
import { HomeComponent } from './presentation/layouts/home/home.component';
import { ApprovedComponent } from './presentation/pages/approved/approved.component';
import { ReportComponent } from './presentation/pages/report/report.component';
import { LoginComponent } from './presentation/layouts/login/login.component';
import { AuthGuard } from './presentation/guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent, title: 'Inicio de sesion' },
  {
    path: '',
    // canActivate: [AuthGuard],
    component: HomeComponent,
    children: [
      {
        path: 'report',
        component: ReportComponent,
        title: 'Reporte',
      },
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
      {
        path: 'endorsers',
        component: EndorsersComponent,
        title: 'Avales',
      },
      {
        path: 'organizations',
        component: OrganizationsComponent,
        title: 'Organizaciones',
      },
      { path: '', redirectTo: 'applicants', pathMatch: 'full'   },
    ],
  },
];
