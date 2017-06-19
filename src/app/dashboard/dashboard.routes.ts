import { Route } from '@angular/router';

import { HomeRoutes } from './home/home.routes';
import { FleetEntryRoutes } from './fleet-entry/fleet-entry.route';
import { BlankPageRoutes } from './blank-page/blankPage.routes';
import { PrimaryLiabilityRoutes } from './primary-liability/primary-liability.routes';
import { PricingIndicationRoutes } from './pricing-indication/pricing-indication.routes';
import { InitialEligibilityRoutes } from './initial-eligibility/initial-eligibility.routes';

import { DashboardComponent } from './index';

export const DashboardRoutes: Route[] = [
    {
      path: 'dashboard',
      component: DashboardComponent,
      children: [
        ...HomeRoutes,
        ...FleetEntryRoutes,
        ...PrimaryLiabilityRoutes,
        ...BlankPageRoutes,
        ...PricingIndicationRoutes,
        ...InitialEligibilityRoutes
      ]
    }
];
