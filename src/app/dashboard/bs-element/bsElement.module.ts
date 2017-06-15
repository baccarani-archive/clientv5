import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { BSElementComponent } from './bsElement.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import 'rxjs/add/observable/throw';

// Operators
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/toPromise';


@NgModule({
    imports: [RouterModule, FormsModule, ReactiveFormsModule, BrowserModule],
    declarations: [BSElementComponent],
    exports: [BSElementComponent]
})

export class BSElementModule { }
