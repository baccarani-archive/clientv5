import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PricingIndicationComponent } from './pricing-indication.component';

@NgModule({
    imports: [
        RouterModule
    ],
    declarations: [PricingIndicationComponent],
    exports: [PricingIndicationComponent]
})

export class PricingIndicationModule { }
