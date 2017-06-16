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

    applicantName: string = '';
    stateCode: string = '';
    zip: string = '';
    vehicleType: string = '';
    hasDOTRevoked: string = '';
    garbageHaul: string = '';

    dot1: string = '';
    effDate: Date = null;
    expDate: Date = null;
    safetyRating: string = '';
    yearInBus: number = null;
    isDrivingExperience: string = '';
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

    privatePassenger: number = 10;
    lightTrucks: number = 0;
    mediumTrucks: number = 0;
    heavyTrucks: number = 0;
    extraHeavyTrucks: number = 0;
    heavyTrucksTractors: number = 0;
    extraHeavyTrucksTractors: number = 0;
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

    intercept: number = null;
    logUnit: number = Math.log(this.noOfPU);
    isLogUnit: boolean = this.logUnit >= 5000;
    if(isLogUnit) {
        this.logUnit = 5000;
    }

    logUnitCoef: number = null;
    logMile: number = null;
    logMileCoef: number = null;
    logISORate: number = null;
    logISORateCoef: number = null;
    priorViolCoef: number = null;
    priorInspCoef: number = null;
    priorCrashCoef: number = null;

    //Primary $1M Premium Rating Formula
    baseLC = Math.exp(this.intercept + ((Math.log1p(this.logISORate) * this.logISORateCoef)));
    sizeAdj = Math.exp(Math.log(this.noOfPU) * this.logUnitCoef);
    mileageAdj = Math.exp(this.logMile * this.logMileCoef);
    violFactor = Math.exp(this.priorViolCoef);
    inspFactor = Math.exp(this.priorInspCoef);
    crashFactor = Math.exp(this.priorCrashCoef);
    //Placeholder
    targetLR: number = 0.6;
    //Placeholder
    ALAEPerc: number = 1.02;
    LCM = 1 / (this.targetLR * this.ALAEPerc);
    //Placeholder
    Emod = 1;
    oneMRate = this.baseLC * this.sizeAdj * this.mileageAdj * this.violFactor * this.inspFactor * this.crashFactor * this.LCM * this.Emod;
    oneMPremium = 0;



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
            'yearInBus': [null, Validators.required],
            'isDrivingExperience': [null],
            'primaryALLimit': [null, Validators.compose([Validators.required, Validators.minLength(7)])],
            'primaryCGLimit': [null, Validators.compose([Validators.required, Validators.minLength(7)])],
            'truckersOnly': [null, Validators.required],
            'primaryELLimit': [null, Validators.compose([Validators.required, Validators.minLength(7)])],
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

            'intercept': [null],
            'logUnit': [null],
            'logUnitCoef': [null],
            'logMile': [null],
            'logMileCoef': [null],
            'logISORate': [null],
            'logISORateCoef': [null],
            'priorViolCoef': [null],
            'priorInspCoef': [null],
            'priorCrashCoef': [null],

            'baseLC': [null],
            'sizeAdj': [null],
            'mileageAdj': [null],
            'violFactor': [null],
            'inspFactor': [null],
            'crashFactor': [null]
            



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

        this.oneMPremium = this.oneMRate * this.totalAdj;
        console.log("Rating Parameters");
        console.log("# of PU " + this.noOfPU);
        console.log("Intercept Coef " + this.intercept);
        console.log("LogUnit " + this.logUnit);
        console.log("LogUnit_Coef " + this.logUnitCoef);
        console.log("LogMile " + this.logMile);
        console.log("LogMile_Coef " + this.logMileCoef);
        console.log("LogISORate " + this.logISORate);
        console.log("logISORate_Coef " + this.logISORateCoef);
        console.log("priorViolation_Coef " + this.priorViolCoef);
        console.log("priorInspection_Coef " + this.priorInspCoef);
        console.log("priorCrash_Coef " + this.priorCrashCoef);

        console.log(" ");
        console.log("Premuim Formula");
        console.log("Base LC " + this.baseLC);
        console.log("Size Adj. " + this.sizeAdj);
        console.log("Mileage Adj. " + this.mileageAdj);
        console.log("Viol. Factor " + this.violFactor);
        console.log("Insp. Factor " + this.inspFactor);
        console.log("Crash Factor " + this.crashFactor);
        console.log("LCM " + this.LCM);
        console.log("Emod " + this.Emod);
        console.log("1M Rate " + this.oneMRate);
        console.log("1M Premium " + this.oneMPremium);
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

                this.intercept = response.TRANS_LC_201704.intercept;
                this.logUnitCoef = response.TRANS_LC_201704.logUnitCoef;
                this.logMile = response.TRANS_LC_201704.logMile;
                this.logMileCoef = response.TRANS_LC_201704.logMileCoef;
                this.logISORate = response.TRANS_LC_201704.logISORate;
                this.logISORateCoef = response.TRANS_LC_201704.logISORateCoef;
                this.priorViolCoef = response.TRANS_LC_201704.priorViolCoef;
                this.priorInspCoef = response.TRANS_LC_201704.priorInspCoef;
                this.priorCrashCoef = response.TRANS_LC_201704.priorCrashCoef;
                // this.cargoCoef = response.TRANS_LC_201704.cargoCoef;
                // this.popDensity = response.TRANS_LC_201704.popDensity;
            }
        );
        console.log("data here:" + data);

    }



}