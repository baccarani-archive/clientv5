
import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
    selector: 'app-fleet-entry',
    templateUrl: 'fleet-entry.component.html',

})

export class FleetEntryComponent implements OnInit {

    rForm: FormGroup;
    post: any;

    privatePassenger: number = 0;
    lightTrucks: number = 0;
    mediumTrucks: number = 0;
    heavyTrucks: number = 0;
    extraHeavyTrucks: number = 0;
    heavyTrucksTractors: number = 0;
    extraHeavyTrucksTractors: number = 0;

    message: string;

    constructor(private fb: FormBuilder) {

        this.rForm = fb.group({
            'privatePassenger': [null],
            'lightTrucks': [null],
            'mediumTrucks': [null],
            'heavyTrucks': [null],
            'extraHeavyTrucks': [null],
            'heavyTrucksTractors': [null],
            'extraHeavyTrucksTractors': [null],
        });

    }

    ngOnInit() {

    }


}











