import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';


@Injectable()
export class DashboardService {

  private PrivatePassengerSource = new BehaviorSubject<number>(null);
  currentPrivatePassenger = this.PrivatePassengerSource.asObservable();

  private ExtraHeavyTrucksTractorsSource = new BehaviorSubject<number>(1);
  currentExtraHeavyTrucksTractors = this.ExtraHeavyTrucksTractorsSource.asObservable();

  constructor() { }

  changePrivatePassenger(privatePassenger: number) {
    this.PrivatePassengerSource.next(privatePassenger)
  }

  changeExtraHeavyTrucksTractors(extraHeavyTrucksTractors: number) {
    this.ExtraHeavyTrucksTractorsSource.next(extraHeavyTrucksTractors)
  }

}
