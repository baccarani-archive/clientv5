import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InitialEligibilityService } from './../dashboard.service';


@Component({
    selector: 'app-blank-page',
    templateUrl: './blank-page.component.html',
    styleUrls: ['./blank-page.component.css'],
    providers: [InitialEligibilityService],
})

export class BlankPageComponent implements OnInit {

    rForm: FormGroup;

    applicantName: string = '';
    stateCode: string = '';
    zip: string = '';
    vehicleType: string = '';
    hasDOTRevoked: string = '';
    garbageHaul: string = '';

    dot1: string = '';
    effDate;
    expDate;
    safetyRating: string = null;
    yearInBus: number = null;
    isDrivingExperience: string = null;
    primaryALLimit: number = null;
    primaryCGLimit: number = null;
    truckersOnly: string = null;
    primaryELLimit: number = null;
    isProvidedCommodities: string = null;
    isUnschedVehicleAuth: string = null;

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
    noOfPU = this.privatePassenger + this.lightTrucks + this.mediumTrucks + this.heavyTrucks + this.extraHeavyTrucks + this.heavyTrucksTractors + this.extraHeavyTrucksTractors;
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
    adjYIB = 1;

    //Placeholder
    Emod = null; //1;
    oneMRate = null; //this.baseLC * this.sizeAdj * this.mileageAdj * this.violFactor * this.inspFactor * this.crashFactor * this.LCM * this.Emod;
    adjExpo = null; //this.totalAdj
    oneMPremium = null; //this.oneMRate * this.totalAdj;

    //Placeholder
    cargoCoef: number = null;
    LOG_AVGGWT1: number = null;
    LOG_AVGGWT2: number = null;
    popDensity: number = null;
    POPDENSITY_COUNTY_ADJ_INSP: number = null;
    POPDENSITY_COUNTY_ADJ_INSP_SQRT: number = null;

    //1x1 Factor Calculation
    baseFatality: number = null //Math.exp(this.intercept2);
    cargoFactor: number = null; //Math.exp(this.cargoCoef);
    weightFactor: number = null; //Math.exp(this.LOG_AVGGWT1 * LOG_AVGGWT2);
    popDenFactor: number = null; //Math.POPDENSITY * POPDENSITY_COUNTY_ADJ_INSP * POPDENSITY^2 * POPDENSITY_COUNTY_ADJ_INSP_SQRT;
    fatalCrash: number = null; //this.baseFatality * this.cargoFactor * this.weightFactor * this.popDenFactor;
    factor1x1P: number = null; //Math.max(0.17, 0.17 * (this.fatalCrash / 3.6));
    rate1x1P: number = null; //this.factor1x1P * (this.oneMPremium / this.totalAdj);

    /*Calculation for withMP*/
    units: number = null;
    unitsLower: number = null;
    unitsUpper: number = null;
    oneMillion: number = null;

    /*excessOccLimit: number = null;*/
    onex1P_Percent: number = null;
    onex1P_WithoutMP: number = null;
    onex1P_WithMP: number = null;
    onex1P_Accumulation: number = null;

    onex1x1P_Percent: number = null;
    onex1x1P_WithoutMP: number = null;
    onex1x1P_WithMP: number = null;
    onex1x1P_Accumulation: number = null;


    //Data Point 2
    unitLower: number = null;
    unitUpper: number = null;
    oneMLower: number = null;
    oneMUpper: number = null;
    weightLower: number = null;
    weightUpper: number = null;
    avgUpLow: number = null;
    dataPoint2: number = null;
    //End DP2

    //Data Point 3
    dataPoint3: number = null;
    //End DP3

    proRata: number = null;

    onexPAnnual: number = null;
    onexPProRated: number = null;

    twoxPAnnual: number = null;
    twoxPProRated: number = null;

    notEligibleSR: Boolean = false;
    notEligibleYIB: Boolean = false;
    notEligibleSPCH: Boolean = false;
    notEligibleUV: Boolean = false;
    notEligibleAL: Boolean = true;
    notEligibleCGL: Boolean = true;
    notEligibleEL: Boolean = true;
    notEligible: Boolean = true;


    constructor(private fb: FormBuilder, private phaseOneService: InitialEligibilityService) {

        this.rForm = fb.group({

            'applicantName': [null],
            'stateCode': [null],
            'zip': [null],
            'vehicleType': [null],
            'hasDOTRevoked': [null],
            'garbageHaul': [null],

            'dot1': [null, Validators.required],
            'effDate': [null, Validators.required],
            'expDate': [null, Validators.required],
            'safetyRating': [null, Validators.required],
            'yearInBus': [null, Validators.required],
            'isDrivingExperience': [null, Validators.required],
            'primaryALLimit': [null, Validators.required],
            'primaryCGLimit': [null, Validators.required],
            'truckersOnly': [null, Validators.required],
            'primaryELLimit': [null, Validators.required],
            'isProvidedCommodities': [null, Validators.required],
            'isUnschedVehicleAuth': [null, Validators.required],

            'privatePassenger': [null],
            'lightTrucks': [null],
            'mediumTrucks': [null],
            'heavyTrucks': [null],
            'extraHeavyTrucks': [null],
            'heavyTrucksTractors': [null],
            'extraHeavyTrucksTractors': [null],

            'noOfPU': [null],
            'totalAdj': [null],

            'intercept1': [null],
            'intercept2': [null],
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
            'LOG_AVGGWT2': [null],
            'popDensity': [null],
            'POPDENSITY_COUNTY_ADJ_INSP': [null],
            'POPDENSITY_COUNTY_ADJ_INSP_SQRT': [null],

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

            'onex1P_Percent': [null],
            'onex1P_WithoutMP': [null],
            'onex1P_WithMP': [null],
            'onex1P_Accumulation': [null],

            'onex1x1P_Percent': [null],
            'onex1x1P_WithoutMP': [null],
            'onex1x1P_WithMP': [null],
            'onex1x1P_Accumulation': [null],

            'proRata': [null],

            'onexPAnnual': [null],
            'onexPProRated': [null],

            'twoxPAnnual': [null],
            'twoxPProRated': [null],

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

                this.extraHeavyTrucksTractors = 1;
                this.primaryALLimit = 1000000;

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
                this.adjExpo = this.totalAdj;
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

                this.baseFatality = Math.exp(this.intercept2) * 100;
                this.cargoFactor = Math.exp(this.cargoCoef);
                this.weightFactor = Math.exp(this.LOG_AVGGWT1 * this.LOG_AVGGWT2);
                this.popDenFactor = Math.exp(this.popDensity * this.POPDENSITY_COUNTY_ADJ_INSP * (this.popDensity * this.popDensity) * this.POPDENSITY_COUNTY_ADJ_INSP_SQRT);
                this.fatalCrash = this.baseFatality * this.cargoFactor * this.weightFactor * this.popDenFactor;
                this.factor1x1P = Math.max(100 * (0.17), 100 * (0.17 * (this.fatalCrash / 3.6)));
                this.rate1x1P = (this.factor1x1P / 100) * (this.oneMPremium / this.totalAdj);

                //Data Point 2
                /*this.unitLower = response.TABLE.VARIABLE;
                this.unitUpper = response.TABLE.VARIABLE;
                this.oneMLower = response.TABLE.VARIABLE;
                this.oneMUpper = response.TABLE.VARIABLE;*/
                this.weightUpper = this.adjExpo - 1;
                this.weightLower = 1 - this.weightUpper;
                this.avgUpLow = (this.weightLower * this.oneMLower) + (this.weightUpper * this.oneMUpper);
                if (this.unitLower >= 4) {
                    this.dataPoint2 = this.adjYIB * 5000;
                } else {
                    this.dataPoint2 = this.adjYIB * this.avgUpLow;
                }
                //Data Point 3
                this.dataPoint3 = this.dataPoint2 * (this.rate1x1P / 1350);

                this.onex1P_WithMP = Math.max(this.onex1P_WithoutMP, this.dataPoint2, this.dataPoint3);
                this.onex1x1P_WithMP = this.onex1P_WithMP * this.onex1x1P_Percent;

                this.onex1P_Percent = 1;
                this.onex1P_WithoutMP = this.oneMPremium * (this.factor1x1P / 100);

                this.onex1x1P_Percent = 0.61;
                this.onex1x1P_WithoutMP = this.onex1P_WithoutMP * this.onex1x1P_Percent;
            }
        );
        console.log("data here:" + data);
    }

    onQuest_T01_FatalityCoef(event: any) {
        //alert("dot 2 value is: "+this.dot2);
        let data = this.phaseOneService.getQuest_T01_FatalityCoef('1');
        data.subscribe(
            data => {
                console.log("data:" + data);
                let response = JSON.parse(data);
                this.intercept2 = response.QUEST_T01.intercept2;
                this.LOG_AVGGWT2 = response.QUEST_T01.LOG_AVGGWT2;
                this.POPDENSITY_COUNTY_ADJ_INSP = response.QUEST_T01.POPDENSITY_COUNTY_ADJ_INSP;
                this.POPDENSITY_COUNTY_ADJ_INSP_SQRT = response.QUEST_T01.POPDENSITY_COUNTY_ADJ_INSP_SQRT;
            }
        );
        console.log("data here:" + data);
    }

    onQuest_T10_1x1Min(event: any) {
        //alert("dot 2 value is: "+this.dot2);
        let val = this.totalAdj;
        let data = this.phaseOneService.getQuest_T10_1x1Min(val);
        data.subscribe(
            data => {
                console.log("data:" + data);
                let response = JSON.parse(data);
                this.units = response.QUEST_T10.units;
                this.oneMillion = response.QUEST_T10.oneMillion;
            }
        );
        console.log("totalAdj: " + val);
    }

    ngOnInit() {
        //this.data.currentPrivatePassenger.subscribe(privatePassenger => this.privatePassenger = privatePassenger)
        //this.data.currentExtraHeavyTrucksTractors.subscribe(extraHeavyTrucksTractors => this.extraHeavyTrucksTractors = extraHeavyTrucksTractors)
    }

    newExpDate() {
        this.expDate = new Date(this.effDate);
        this.expDate.setFullYear(this.expDate.getFullYear() + 1);
        this.expDate = this.expDate.getFullYear()  + "-" + ("0" + (this.expDate.getMonth() + 1)).slice(-2) + "-" + (this.expDate.getDate() + 1);
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

    rangeLimitCGL() {

        if (this.primaryCGLimit >= 1000000 && this.primaryCGLimit <= 2000000) {
            this.notEligibleCGL = false;
            return this.notEligibleCGL;
        } else {
            this.notEligibleCGL = true;
            return this.notEligibleCGL;
        }

    }

    isEligible() {
        if (this.notEligibleSR === false && this.notEligibleYIB === false && this.notEligibleSPCH === false && this.notEligibleUV === false && this.notEligibleAL === false && this.notEligibleCGL === false && this.notEligibleEL === false /*&& this.noOfPU <=5*/) {
            this.notEligible = false;
            return this.notEligible;
        } else {
            this.notEligible = true;
            return this.notEligible;
        }
    }

}