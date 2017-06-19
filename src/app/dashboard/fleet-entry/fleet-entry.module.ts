import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';


import { FleetEntryComponent } from './fleet-entry.component';

@NgModule({
    imports: [RouterModule, FormsModule, ReactiveFormsModule, BrowserModule],
    declarations: [FleetEntryComponent],
    exports: [FleetEntryComponent]
})

export class FleetEntryModule { }
