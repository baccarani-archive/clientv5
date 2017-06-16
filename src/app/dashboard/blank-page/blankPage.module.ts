import { RouterModule} from '@angular/router';
import { NgModule } from '@angular/core';

import { BlankPageComponent } from './blankPage.component';

@NgModule({
    imports: [RouterModule],
    declarations: [BlankPageComponent],
    exports: [BlankPageComponent]
})

export class BlankPageModule { }
