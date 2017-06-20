import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InitialEligibilityService } from './initial-eligibility.service';
import { DashboardService } from './../dashboard.service';


@Component({

    selector: 'app-initial-eligibility',
    templateUrl: './initial-eligibility.component.html',
    providers: [DashboardService],
    styleUrls: ['./initial-eligibility.component.css']

})

export class InitialEligibility implements OnInit {

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
    safetyRating: string = null;
    yearInBus: number = null;
    isDrivingExperience: string = null;
    primaryALLimit: number = null;
    primaryCGLimit: number = null;
    truckersOnly: string = '';
    primaryELLimit: number = null;
    isProvidedCommodities: string = null;
    isUnschedVehicleAuth: string = null;
    projectedGrossSales: string = '';
    projectedMileage: string = '';

    /* CARGO
    cargoLength: string = '';
    cargoEntries: string = '';
    individualPercent: string = '';
    totalPercent: string = '';
    */

    privatePassenger: number = 0;
    lightTrucks: number = 0;
    mediumTrucks: number = 0;
    heavyTrucks: number = 0;
    extraHeavyTrucks: number = 0;
    heavyTrucksTractors: number = 0;
    extraHeavyTrucksTractors: number = 0;

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
    noOfPU: number = null; //this.privatePassenger + this.lightTrucks + this.mediumTrucks + this.heavyTrucks + this.extraHeavyTrucks + this.heavyTrucksTractors + this.extraHeavyTrucksTractors;
    totalAdj: number = null; //this.privatePassenger * 0.25 + this.lightTrucks * 0.37 + this.mediumTrucks * 0.45 + this.heavyTrucks * 0.95 + this.extraHeavyTrucks * 1.00 + this.heavyTrucksTractors * 0.95 + this.extraHeavyTrucksTractors * 1.00;

    intercept1: number = null;
    intercept2: number = null; //COMING FROM CELL E9
    logUnit: number = null; //Math.log(this.noOfPU);

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

    //Placeholder
    targetLR: number = 0.6;
    ALAEPerc: number = 1.02;

    //Primary $1M Premium Rating Formula
    baseLC = null; //Math.exp(this.intercept1 + ((Math.log1p(this.logISORate) * this.logISORateCoef)));
    sizeAdj = null; //Math.exp(Math.log(this.noOfPU) * this.logUnitCoef);
    mileageAdj = null; //Math.exp(this.logMile * this.logMileCoef);
    violFactor = null; //Math.exp(this.priorViolCoef);
    inspFactor = null; //Math.exp(this.priorInspCoef);
    crashFactor = null; //Math.exp(this.priorCrashCoef);
    LCM = null; //1 / this.targetLR * this.ALAEPerc;

    //Placeholder
    Emod = null; //1;
    oneMRate = null; //this.baseLC * this.sizeAdj * this.mileageAdj * this.violFactor * this.inspFactor * this.crashFactor * this.LCM * this.Emod;
    adjExpo = null; //this.totalAdj
    oneMPremium = null; //this.oneMRate * this.totalAdj;

    //Placeholder
    cargoCoef: number = null;
    LOG_AVGGWT1: number = null;
    //LOG_AVGGWT2: number = null;
    popDensity: number = null;
    //POPDENSITY_COUNTY_ADJ_INSP: number = null;
    //POPDENSITY_COUNTY_ADJ_INSP_SQRT: number = null;

    //1x1 Factor Calculation
    baseFatality: number = null; //Math.exp(this.intercept2);
    cargoFactor: number = null; //Math.exp(this.cargoCoef);
    weightFactor: number = null; //Math.exp(this.LOG_AVGGWT1 * LOG_AVGGWT2);
    popDenFactor: number = null; //Math.POPDENSITY * POPDENSITY_COUNTY_ADJ_INSP * POPDENSITY^2 * POPDENSITY_COUNTY_ADJ_INSP_SQRT;
    fatalCrash: number = null; //this.baseFatality * this.cargoFactor * this.weightFactor * this.popDenFactor;
    factor1x1P: number = null; //Math.max(0.17, 0.17 * (this.fatalCrash / 3.6));
    rate1x1P: number = null; //this.factor1x1P * (this.oneMPremium / this.totalAdj);

    notEligibleSR: Boolean = false;
    notEligibleYIB: Boolean = false;
    notEligibleSPCH: Boolean = false;
    notEligibleUV: Boolean = false;
    notEligibleAL: Boolean = true;
    notEligibleCGL: Boolean = true;
    notEligibleEL: Boolean = true;


    constructor(private fb: FormBuilder, private phaseOneService: InitialEligibilityService, private data: DashboardService) {

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

            'privatePassenger': [null, Validators.required],
            'lightTrucks': [null, Validators.required],
            'mediumTrucks': [null, Validators.required],
            'heavyTrucks': [null, Validators.required],
            'extraHeavyTrucks': [null, Validators.required],
            'heavyTrucksTractors': [null, Validators.required],
            'extraHeavyTrucksTractors': [null, Validators.required],
            'trailers': [null, Validators.required],

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

            'noOfPU': [null],
            'totalAdj': [null],

            'intercept1': [null],
            'logUnit': [null],
            'logUnitCoef': [null],
            'logMile': [null],
            'logMileCoef': [null],
            'logISORate': [null],
            'logISORateCoef': [null],
            'priorViolCoef': [null],
            'priorInspCoef': [null],
            'priorCrashCoef': [null],

            'cargoCoef': [null],
            'LOG_AVGGWT1': [null],
            //'LOG_AVGGWT2': [null],
            'popDensity': [null],
            //'POPDENSITY_COUNTY_ADJ_INSP': [null],
            //'POPDENSITY_COUNTY_ADJ_INSP_SQRT': [null],

            'baseLC': [null],
            'sizeAdj': [null],
            'mileageAdj': [null],
            'violFactor': [null],
            'inspFactor': [null],
            'crashFactor': [null],
            'LCM': [null],
            'Emod': [null],
            'oneMRate': [null],
            'adjExpo': [null],
            'oneMPremium': [null],

            'baseFatality': [null],
            'cargoFactor': [null],
            'weightFactor': [null],
            'popDenFactor': [null],
            'fatalCrash': [null],
            'factor1x1P': [null],
            'rate1x1P': [null],

        });

        /* Pricing Engine -- DOES THIS DO ANYTHING */
        /*function adjPU(pp, lt, mt, ht, eht, htt, ehtt: number): number {
            var privatePassengerAdj = pp * 0.25;
            var lightTrucksAdj = lt * 0.37;
            var mediumTrucksAdj = mt * 0.45;
            var heavyTrucksAdj = ht * 0.95;
            var extraHeavyTrucksAdj = eht * 1;
            var heavyTrucksTractorsAdj = htt * 0.95;
            var extraHeavyTrucksTractorsAdj = ehtt * 1;

            var adjTotal = privatePassengerAdj + lightTrucksAdj + mediumTrucksAdj + heavyTrucksAdj + extraHeavyTrucksAdj + heavyTrucksTractorsAdj + extraHeavyTrucksTractorsAdj;

            return adjTotal;
        }*/

        console.log("Rating Parameters");
        console.log("# of PU " + this.noOfPU);
        console.log("Intercept Coef " + this.intercept1);
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

                this.intercept1 = response.TRANS_LC_201704.intercept1;
                this.logUnitCoef = response.TRANS_LC_201704.logUnitCoef;
                this.logMile = response.TRANS_LC_201704.logMile;
                this.logMileCoef = response.TRANS_LC_201704.logMileCoef;
                this.logISORate = response.TRANS_LC_201704.logISORate;
                this.logISORateCoef = response.TRANS_LC_201704.logISORateCoef;
                this.priorViolCoef = response.TRANS_LC_201704.priorViolCoef;
                this.priorInspCoef = response.TRANS_LC_201704.priorInspCoef;
                this.priorCrashCoef = response.TRANS_LC_201704.priorCrashCoef;
                this.cargoCoef = response.TRANS_LC_201704.cargoCoef;
                this.popDensity = response.TRANS_LC_201704.popDensity;
                this.LOG_AVGGWT1 = response.TRANS_LC_201704.LOG_AVGGWT1;

                this.noOfPU = this.privatePassenger + this.lightTrucks + this.mediumTrucks + this.heavyTrucks + this.extraHeavyTrucks + this.heavyTrucksTractors + this.extraHeavyTrucksTractors;
                this.totalAdj = this.privatePassenger * 0.25 + this.lightTrucks * 0.37 + this.mediumTrucks * 0.45 + this.heavyTrucks * 0.95 + this.extraHeavyTrucks * 1.00 + this.heavyTrucksTractors * 0.95 + this.extraHeavyTrucksTractors * 1.00;
                this.adjExpo = this.totalAdj
                this.logUnit = Math.log(this.noOfPU);

                this.baseLC = Math.exp(this.intercept1 + ((Math.log1p(this.logISORate) * this.logISORateCoef)));
                this.sizeAdj = Math.exp(Math.log(this.noOfPU) * this.logUnitCoef);
                this.mileageAdj = Math.exp(this.logMile * this.logMileCoef);
                this.violFactor = Math.exp(this.priorViolCoef);
                this.inspFactor = Math.exp(this.priorInspCoef);
                this.crashFactor = Math.exp(this.priorCrashCoef);
                this.LCM = 1 / this.targetLR * this.ALAEPerc;
                this.Emod = 1;
                this.oneMRate = this.baseLC * this.sizeAdj * this.mileageAdj * this.violFactor * this.inspFactor * this.crashFactor * this.LCM * this.Emod;
                this.adjExpo = this.totalAdj
                this.oneMPremium = this.oneMRate * this.totalAdj;

                //this.baseFatality = Math.exp(this.intercept2);
                this.cargoFactor = Math.exp(this.cargoCoef);
                //this.weightFactor = Math.exp(this.LOG_AVGGWT1 * LOG_AVGGWT2);
                //this.popDenFactor = Math.POPDENSITY * POPDENSITY_COUNTY_ADJ_INSP * POPDENSITY^2 * POPDENSITY_COUNTY_ADJ_INSP_SQRT;
                //this.fatalCrash = this.baseFatality * this.cargoFactor * this.weightFactor * this.popDenFactor;
                //this.factor1x1P = Math.max(0.17, 0.17 * (this.fatalCrash / 3.6));
                //this.rate1x1P = this.factor1x1P * (this.oneMPremium / this.totalAdj);
            }
        );
        console.log("data here:" + data);
    }

    ngOnInit() {
        this.data.currentPrivatePassenger.subscribe(privatePassenger => this.privatePassenger = privatePassenger)
        this.data.currentExtraHeavyTrucksTractors.subscribe(extraHeavyTrucksTractors => this.extraHeavyTrucksTractors = extraHeavyTrucksTractors)
    }

    isEligibleSR(notEligible: Boolean) {

        this.notEligibleSR = notEligible;
        return this.notEligibleSR;

    }

    isEligibleYIB(notEligible: Boolean) {

        this.notEligibleYIB = notEligible;
        return this.notEligibleYIB;

    }

    isEligibleSPCH(notEligible: Boolean) {

        this.notEligibleSPCH = notEligible;
        return this.notEligibleSPCH;

    }

    isEligibleUV(notEligible: Boolean) {

        this.notEligibleUV = notEligible;
        return this.notEligibleUV;

    }

    rangeLimitAL() {

        if (this.primaryALLimit >= 1000000 && this.primaryALLimit <= 2000000) {
            this.notEligibleAL = false;
            return this.notEligibleAL;
        } else {
            this.notEligibleAL = true;
            return this.notEligibleAL;
        }

    }

    rangeLimitEL() {

        if (this.primaryELLimit >= 1000000 && this.primaryELLimit <= 2000000) {
            this.notEligibleEL = false;
            return this.notEligibleEL;
        } else {
            this.notEligibleEL = true;
            return this.notEligibleEL;
        }

    }

    rangeLimitCGL(notEligible: Boolean) {

        if (this.primaryCGLimit >= 1000000 && this.primaryCGLimit <= 2000000) {
            this.notEligibleCGL = false;
            return this.notEligibleCGL;
        } else {
            this.notEligibleCGL = true;
            return this.notEligibleCGL;
        }

    }

}