import { RouterModule} from '@angular/router';
import { NgModule } from '@angular/core';

import { BlankPageComponent } from './blankPage.component';
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
    declarations: [BlankPageComponent],
    exports: [BlankPageComponent]
})

export class BlankPageModule { }
