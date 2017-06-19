import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Ng2BootstrapModule } from 'ng2-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HomeModule } from './home/home.module';
import { FleetEntryModule } from './fleet-entry/fleet-entry.module';
import { BlankPageModule } from './blank-page/blankPage.module';
import { PrimaryLiabilityModule } from './primary-liability/primary-liability.module';
import { PricingIndicationModule } from './pricing-indication/pricing-indication.module';
import { GridModule } from './grid/grid.module';
import { BSComponentModule } from './bs-component/bsComponent.module';
import { InitialEligibilityModule } from './initial-eligibility/initial-eligibility.module';

import { DashboardComponent } from './dashboard.component';

import { TopNavComponent } from '../shared/index';
import { SidebarComponent } from '../shared/index';






@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    Ng2BootstrapModule.forRoot(),
    HomeModule,
    FleetEntryModule,
    PrimaryLiabilityModule,
    PricingIndicationModule,
    GridModule,
    BSComponentModule,
    InitialEligibilityModule,
    BlankPageModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [DashboardComponent, TopNavComponent, SidebarComponent],
  exports: [DashboardComponent, TopNavComponent, SidebarComponent]
})

export class DashboardModule { }
