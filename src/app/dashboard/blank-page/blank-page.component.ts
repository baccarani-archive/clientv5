import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InitialEligibilityService } from './../dashboard.service';
import * as $ from 'jquery';


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

    dot1: any = '';
    effDate;
    expDate;
    safetyRating: string = null;
    yearInBus: number = null;
    isDrivingExperience: any = null;
    /*primaryALLimit: number = null;
    primaryCGLimit: number = null;
    primarELLimit: number = null;*/
    truckersOnly: string = null;
    primaryELLimit: number = null;
    isProvidedCommodities: string = null;
    isUnschedVehicleAuth: string = null;

    /*CHECKBOX AL GL EL*/
    checkboxAL = true;
    checkboxGL = false;
    checkboxEL = false;

    /*UNDERLYING POLICIES*/
    limitAL = null;
    premiumAL = null;
    numYrsLossRunsAL = null;
    numClaimsAL = null;
    totIncurredLossesAL = null;
    numClaims50kAL: number = null;

    limitGL = null;
    premiumGL = null;
    numYrsLossRunsGL = null;
    numClaimsGL = null;
    totIncurredLossesGL = null;
    numClaims50kGL: number = null;

    /* CARGO
    cargoLength: string = '';
    cargoEntries: string = '';
    individualPercent: string = '';
    totalPercent: string = '';
    */

    privatePassenger: number = null;
    lightTrucks: number = null;
    mediumTrucks: number = null;
    heavyTrucks: number = null;
    extraHeavyTrucks: number = null;
    heavyTrucksTractors: number = null;
    extraHeavyTrucksTractors: number = null;

    /*limitAL: string = '';
    premiumAL: string = '';
    noOfLossesAL: string = '';
    lossesAL: string = '';

    limitCGL: string = '';
    premiumCGL: string = '';
    noOfLossesCGL: string = '';
    lossesCGL: string = '';*/

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
    notEligibleTO: Boolean = false;
    notEligibleYIB: Boolean = false;
    notEligibleSPCH: Boolean = false;
    notEligibleUV: Boolean = false;
    /*notEligibleAL: Boolean = true;
    notEligibleCGL: Boolean = true;
    notEligibleEL: Boolean = true;*/
    notEligible: Boolean = true;

    ALNoOfClaimsOver50K: number = null;
    GLNoOfClaimsOver50K: number = null;

    ALnewFields: any = ('');
    GLnewFields: any = ('');


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
            'isDrivingExperience': [null],
            /*'primaryALLimit': [null, Validators.required],
            'primaryCGLimit': [null, Validators.required],*/
            'truckersOnly': [null],
            /*'primaryELLimit': [null, Validators.required],*/
            'isProvidedCommodities': [null, Validators.required],
            'isUnschedVehicleAuth': [null, Validators.required],

            'checkboxAL': [null, Validators.required],
            'checkboxGL': [null],
            'checkboxEL': [null],

            'limitAL': [null, Validators.required],
            'premiumAL': [null, Validators.required],
            'numYrsLossRunsAL': [null, Validators.required],
            'numClaimsAL': [null, Validators.required],
            'totIncurredLossesAL': [null],
            'numClaims50kAL': [null],

            'limitGL': [null],
            'premiumGL': [null],
            'numYrsLossRunsGL': [null],
            'numClaimsGL': [null],
            'totIncurredLossesGL': [null],
            'numClaims50kGL': [null],

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

            'ALNoOfClaimsOver50K': [null],
            'GLNoOfClaimsOver50K': [null],

        });
    }

    onDot1Change(event: any) {
        //alert("dot 2 value is: "+this.dot2);
        /*let val = event.target.value;*/
        let val = this.dot1
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
                if (this.garbageHaul = "null") {
                    this.garbageHaul = "NaN";
                } else {
                    this.garbageHaul = this.garbageHaul;
                }

                /*this.primaryALLimit = 1000000;*/

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
                this.popDenFactor = Math.exp(this.popDensity * this.POPDENSITY_COUNTY_ADJ_INSP + Math.pow(this.popDensity, 2) * this.POPDENSITY_COUNTY_ADJ_INSP_SQRT);
                this.fatalCrash = this.baseFatality * this.cargoFactor * this.weightFactor * this.popDenFactor;
                this.factor1x1P = Math.max(100 * (0.17), 100 * (0.17 * (this.fatalCrash / 3.6)));
                this.rate1x1P = (this.factor1x1P / 100) * (this.oneMPremium / this.totalAdj);

                //Data Point 1
                //this.onex1P_WithoutMP = this.oneMPremium * (this.factor1x1P / 100);
                this.onex1P_WithoutMP = this.rate1x1P * this.noOfPU;
                this.onex1x1P_Percent = 0.61;
                this.onex1x1P_WithoutMP = this.onex1P_WithoutMP * this.onex1x1P_Percent;

                //Data Point 2
                /*this.unitLower = response.TABLE.VARIABLE;
                this.unitUpper = response.TABLE.VARIABLE;
                this.oneMLower = response.TABLE.VARIABLE;
                this.oneMUpper = response.TABLE.VARIABLE;*/
                this.weightUpper = this.adjExpo - Math.ceil(this.adjExpo);
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

                this.onex1x1P_WithMP = Math.max(this.onex1P_WithMP * this.onex1x1P_Percent, 1500);

                this.onex1P_Percent = 1;

                this.onex1P_Accumulation = this.onex1P_WithMP;
                this.onex1x1P_Accumulation = this.onex1P_Accumulation + this.onex1x1P_WithMP;

                this.proRata = 1;

                this.onexPAnnual = this.onex1P_Accumulation;
                this.twoxPAnnual = this.onex1x1P_Accumulation;

                this.onexPProRated = Math.ceil((this.onexPAnnual * this.proRata) / 5) * 5;
                this.twoxPProRated = Math.ceil((this.twoxPAnnual * this.proRata) / 5) * 5;
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
        let valLower = Math.floor(this.privatePassenger * 0.25 + this.lightTrucks * 0.37 + this.mediumTrucks * 0.45 + this.heavyTrucks * 0.95 + this.extraHeavyTrucks * 1.00 + this.heavyTrucksTractors * 0.95 + this.extraHeavyTrucksTractors * 1.00);
        let dataLower = this.phaseOneService.getQuest_T10_1x1Min(Math.min(valLower, 4));
        dataLower.subscribe(
            dataLower => {
                console.log("data:" + dataLower);
                let response = JSON.parse(dataLower);
                this.unitLower = response.QUEST_T10.units;
                this.oneMLower = response.QUEST_T10.oneMillion;
            }
        );
        let valUpper = valLower + 1;
        let dataUpper = this.phaseOneService.getQuest_T10_1x1Min(Math.min(valUpper, 4));
        dataUpper.subscribe(
            dataUpper => {
                console.log("data:" + dataUpper);
                let response = JSON.parse(dataUpper);
                this.unitUpper = response.QUEST_T10.units;
                this.oneMUpper = response.QUEST_T10.oneMillion;
            }
        );
        console.log("data here:" + dataUpper + dataLower);
    }

    ngOnInit() {
        $('#date1').mask('00/00/0000');
    }

    newExpDate() {
        this.expDate = new Date(this.effDate);
        this.expDate.setFullYear(this.expDate.getFullYear() + 1);
        /*this.expDate = this.expDate.getMonth() + 1 + "/" + this.expDate.getDate() + "/" + this.expDate.getFullYear();*/
    }

    setDrivingValidator() {

        if (this.yearInBus <= 3) {
            console.log("required");
            this.rForm.get('isDrivingExperience').setValidators([Validators.required]);
            this.isDrivingExperience = null;
        } else {
            console.log("not required");
            this.rForm.get('isDrivingExperience').clearValidators();
            this.isDrivingExperience = null;
        }

    }

    isEligibleSR(notEligible: Boolean) {

        this.notEligibleSR = notEligible;
        return this.notEligibleSR;

    }

    isEligibleTO(notEligible: Boolean) {

        this.notEligibleTO = notEligible;
        return this.notEligibleTO;

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

    /*rangeLimitAL() {

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

    }*/

    isNoOfPUGreaterThan5() {
        this.noOfPU = this.privatePassenger + this.lightTrucks + this.mediumTrucks + this.heavyTrucks + this.extraHeavyTrucks + this.heavyTrucksTractors + this.extraHeavyTrucksTractors;
        this.totalAdj = this.privatePassenger * 0.25 + this.lightTrucks * 0.37 + this.mediumTrucks * 0.45 + this.heavyTrucks * 0.95 + this.extraHeavyTrucks * 1.00 + this.heavyTrucksTractors * 0.95 + this.extraHeavyTrucksTractors * 1.00;
    }

    isEligible() {
        if (this.notEligibleSR === false && this.notEligibleYIB === false && this.notEligibleSPCH === false && this.notEligibleUV === false /*&& this.notEligibleAL === false && this.notEligibleCGL === false && this.notEligibleEL === false*/ && this.notEligibleTO === false && (this.noOfPU <= 5 && this.noOfPU >= 1)) {
            this.notEligible = false;
            return this.notEligible;
        } else {
            this.notEligible = true;
            return this.notEligible;
        }
    }


    ALLargeLossesIncurred(event: any) {
        /*let val = event.target.value;
        let input = ('');
        let newFields = ('');*/
        let val = event.target.value || 0;
        console.log("val: " + val);

        /*debugger;
        if (val > this.newFields.length) {
            this.addFields(val);
        } else {
            this.removeFields(val);
        }*/

        this.ALremoveFields(val);
        this.ALaddFields(val);
    }

    ALaddFields(val) {
        for (let i = this.ALnewFields.length; i < val; i++) {

            console.log("i: " + i);

            var myOnClick = function (event) {
                alert("change!!.. you entered: " + event.target.value);
            }

            var input = $('<label><label class="form-control-label">Incurred:<br></label><br><label><input type="text" class="form-control"></label></label><br>');
            var ALnewFields = $("#ALnewFields");
            var newInput = input.clone();
            newInput.attr("id", "input_" + i);
            newInput.change(myOnClick);
            var ALnewFieldsRen = ALnewFields.append(newInput);
            //newInput.appendTo('#newFields');
        }
    }

    ALremoveFields(val) {
        $("#ALnewFields label").remove();
        $("#ALnewFields input").remove();
        $("#ALnewFields br").remove();
    }


    GLLargeLossesIncurred(event: any) {
        /*let val = event.target.value;
        let input = ('');
        let newFields = ('');*/
        let val = event.target.value || 0;
        console.log("val: " + val);

        /*debugger;
        if (val > this.newFields.length) {
            this.addFields(val);
        } else {
            this.removeFields(val);
        }*/

        this.GLremoveFields(val);
        this.GLaddFields(val);
    }

    GLaddFields(val) {
        for (let i = this.GLnewFields.length; i < val; i++) {

            console.log("i: " + i);

            var myOnClick = function (event) {
                alert("change!!.. you entered: " + event.target.value);
            }

            var input = $('<label><label class="form-control-label">Incurred:<br></label><br><label><input type="text" class="form-control"></label></label><br>');
            var GLnewFields = $("#GLnewFields");
            var newInput = input.clone();
            newInput.attr("id", "input_" + i);
            newInput.change(myOnClick);
            var GLnewFields = GLnewFields.append(newInput);
            //newInput.appendTo('#newFields');
        }
    }

    GLremoveFields(val) {
        $("#GLnewFields label").remove();
        $("#GLnewFields input").remove();
        $("#GLnewFields br").remove();
    }


    onDOTReset(dot1 = '') {
         
            this.applicantName = '';
            return this.applicantName;
    }

}