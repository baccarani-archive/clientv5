import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsElementService } from './bs-element.service';



@Component({
    selector: 'app-bs-element',
    templateUrl: './bs-element.component.html'
})

export class BSElementComponent {

    rForm: FormGroup;
    post: any;

    //Hiding Question
    isYIB: boolean = true;

    applicantName: string = '';
    stateCode: string = '';
    zip: string = '';
    vehicleType: string = '';
    hasDOTRevoked: string = '';
    garbageHaul: string = '';

    dot1: string = '';
    effDate: string = '';
    expDate: string = '';
    safetyRating: string = '';
    yearInBus: number = 4;
    primaryALLimit: string = '';
    primaryCGLimit: string = '';
    truckersOnly: string = '';
    primaryELLimit: string = '';
    isProvidedCommodities: string = '';
    isUnschedVehicleAuth: string = '';
    projectedGrossSales: string = '';
    projectedMileage: string = '';

    /* CARGO
    cargoLength: string = '';
    cargoEntries: string = '';
    individualPercent: string = '';
    totalPercent: string = '';
    */

    privatePassenger: number = 1;
    lightTrucks: number = 1;
    mediumTrucks: number = 1;
    heavyTrucks: number = 1;
    extraHeavyTrucks: number = 0;
    heavyTrucksTractors: number = 0;
    extraHeavyTrucksTractors: number = 1;
    trailers: number = 0;

    totalAdj: number = 0;

    limitAL: string = '';
    premiumAL: string = '';
    noOfLossesAL: string = '';
    lossesAL: string = '';

    limitCGL: string = '';
    premiumCGL: string = '';
    noOfLossesCGL: string = '';
    lossesCGL: string = '';

    lrgLosses: string = '';

    totalUnits: number = 0;
    underlying: number = 0;
    riskPremuimOne: number = 0;
    riskPremiumTwo: number = 0;


    //Rating Parameters
    noOfPU = this.privatePassenger + this.lightTrucks + this.mediumTrucks + this.heavyTrucks + this.extraHeavyTrucks + this.heavyTrucksTractors + this.extraHeavyTrucksTractors + this.trailers;
    //Placeholder
    interceptCoef: number = 4.171;
    logUnit: number = Math.log(this.noOfPU);
    isLogUnit: boolean = this.logUnit >= 5000;
    if(isLogUnit) {
        this.logUnit = 5000;
    }
    //Placeholders
    logUnitCoef: number = -0.059;
    logMile: number = 12.5;
    logMileCoef: number = 0.044;
    logISORate: number = 2351.09;
    logISORateCoef: number = 0.47;
    priorViolationCoef: number = -0.159;
    priorInspectionCoef: number = -0.093;
    priorCrashCoef: number = -0.155;

    //Primary $1M Premium Rating Formula
    baseLC = Math.exp(this.interceptCoef + ((Math.log1p(this.logISORate) * this.logISORateCoef)));
    sizeAdj = Math.exp(Math.log(this.noOfPU) * this.logUnitCoef);
    mileageAdj = Math.exp(this.logMile * this.logMileCoef);
    violFactor = Math.exp(this.priorViolationCoef);
    inspFactor = Math.exp(this.priorInspectionCoef);
    crashFactor = Math.exp(this.priorCrashCoef);
    //Placeholder
    targetLR: number = 0.6;
    //Placeholder
    ALAEPerc: number = 1.02;
    LCM = 1 / (this.targetLR * this.ALAEPerc);



    constructor(private fb: FormBuilder, private phaseOneService: BsElementService) {

        this.rForm = fb.group({

            'applicantName': [null, Validators.required],
            'stateCode': [null, Validators.required],
            'zip': [null, Validators.required],
            'vehicleType': [null, Validators.required],
            'hasDOTRevoked': [null, Validators.required],
            'garbageHaul': [null, Validators.required],

            'dot1': [null, Validators.required],
            'effDate': [null, Validators.required],
            'expDate': [null, Validators.required],
            'safetyRating': [null],
            'yearInBus': [null],
            'isDrivingExperience': [null],
            'primaryALLimit': [null, Validators.compose([Validators.required, Validators.minLength(6)])],
            'primaryCGLimit': [null, Validators.compose([Validators.required, Validators.minLength(6)])],
            'truckersOnly': [null, Validators.required],
            'primaryELLimit': [null, Validators.compose([Validators.required, Validators.minLength(6)])],
            'isProvidedCommodities': [null],
            'isUnschedVehicleAuth': [null],
            'projectedGrossSales': [null, Validators.required],
            'projectedMileage': [null, Validators.required],

            /* CARGO
            'cargoEntries': [null],
            'individualPercent': [null],
            'totalPercent': [null],
            */

            'privatePassenger': [null, Validators.required],
            'lightTrucks': [null, Validators.required],
            'mediumTrucks': [null, Validators.required],
            'heavyTrucks': [null, Validators.required],
            'extraHeavyTrucks': [null, Validators.required],
            'heavyTrucksTractors': [null, Validators.required],
            'extraHeavyTrucksTractors': [null, Validators.required],
            'trailers': [null, Validators.required],

            'totalAdj': [null],

            'limitAL': [null, Validators.required],
            'premiumAL': [null, Validators.required],
            'noOfLossesAL': [null],
            'lossesAL': [null],

            'limitCGL': [null, Validators.required],
            'premiumCGL': [null, Validators.required],
            'noOfLossesCGL': [null],
            'lossesCGL': [null],

            'lrgLosses': [null],

            'totalUnits': [null],
            'underlying': [null],
            'riskPremuimOne': [null],
            'riskPremiumTwo': [null],

            'interceptCoef': [null],
            'logUnit': [null],
            'logUnitCoef': [null],
            'logMile': [null],
            'logMileCoef': [null],
            'logISORate': [null],
            'logISORateCoef': [null],
            'priorViolationCoef': [null],
            'priorInspectionCoef': [null],
            'priorCrashCoef': [null]
        });

        /* Pricing Engine */
        function adjPU(pp, lt, mt, ht, eht, htt, ehtt: number): number {
            var privatePassengerAdj = pp * 0.25;
            var lightTrucksAdj = lt * 0.37;
            var mediumTrucksAdj = mt * 0.45;
            var heavyTrucksAdj = ht * 0.95;
            var extraHeavyTrucksAdj = eht * 1;
            var heavyTrucksTractorsAdj = htt * 0.95;
            var extraHeavyTrucksTractorsAdj = ehtt * 1;

            var adjTotal = privatePassengerAdj + lightTrucksAdj + mediumTrucksAdj + heavyTrucksAdj + extraHeavyTrucksAdj + heavyTrucksTractorsAdj + extraHeavyTrucksTractorsAdj;

            return adjTotal;
        }
    }

    onDot1Change(event: any) {
        //alert("dot 2 value is: "+this.dot2);
        let val = event.target.value;
        let data = this.phaseOneService.getDOTData(val);
        data.subscribe(
            data => {
                console.log("data:" + data);
                let response = JSON.parse(data);
                this.applicantName = response.finalPricing.applicantName;
                this.stateCode = response.physicalAddress.state.code;
                this.zip = response.physicalAddress.zip;
                this.vehicleType = response.initialEligibility.vehicleType;
                this.hasDOTRevoked = response.initialEligibility.hasDOTRevoked;
                this.garbageHaul = response.initialEligibility.garbageHaul;
            }
        );
        console.log("data here:" + data);
    }

    checkYIB(boolean){

        if(this.yearInBus <= 3){
            this.isYIB = false;
        }else{
            this.isYIB = true;
        }

        return this.isYIB;
    }

}