import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { QuestService } from './quest.service';

@Component({
  selector: 'app-quest',
  templateUrl: './quest.component.html',
})

export class QuestComponent { 

  rForm: FormGroup; // A PROPERTY WITHIN A CLASS
  post: any;                     // A property for our submitted form

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
  yearInBus: string = '';
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
  lightTrucks: number = 10;
  mediumTrucks: number = 0;
  heavyTrucks: number = 0;
  extraHeavyTrucks: number = 0;
  heavyTrucksTractors: number = 0;
  extraHeavyTrucksTractors: number = 0;
  trailers: number = 0;

  totalAdj: number = 100;

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

  titleAlert: string = 'This field is required';

  constructor(private fb: FormBuilder, private phaseOneService: QuestService) {

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
   
      'limitCGL': [null, Validators.required],
      'premiumCGL': [null, Validators.required],
      'noOfLossesCGL': [null],

      'lrgLosses': [null],

      'totalUnits': [null],
      'underlying': [null],
      'riskPremuimOne': [null],
      'riskPremiumTwo': [null],

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

    this.totalAdj = adjPU(this.privatePassenger, this.lightTrucks, this.mediumTrucks, this.heavyTrucks, this.extraHeavyTrucks, this.heavyTrucksTractors, this.extraHeavyTrucksTractors);
    console.log(adjPU(this.privatePassenger, this.lightTrucks, this.mediumTrucks, this.heavyTrucks, this.extraHeavyTrucks, this.heavyTrucksTractors, this.extraHeavyTrucksTractors));


  }

  onPrivatePassenger(event: Event) {
    this.privatePassenger = parseInt((<HTMLInputElement>event.target).value);
    console.log(event);
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
}