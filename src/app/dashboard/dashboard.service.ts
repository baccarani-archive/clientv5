import { Injectable, Component } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class InitialEligibilityService {

  private DOTData = 'http://localhost:8080/getDOTData';
  private Quest_T01_FatalityCoef = 'http://localhost:8080/getQuest_T01_FatalityCoef';

  constructor(private http: Http) { }

  getDOTData(dotNum: number): Observable<any> {
    const bodyString = JSON.stringify({ 'dotNum': dotNum }); // Stringify payload
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ 'headers': headers });
    return this.http.post(this.DOTData, bodyString, options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getQuest_T01_FatalityCoef(T01_Version: any): Observable<any> {
    const bodyString = JSON.stringify({ 'T01_Version': T01_Version }); // Stringify payload
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ 'headers': headers });
    return this.http.post(this.Quest_T01_FatalityCoef, bodyString, options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  private extractData(res: Response) {
    let body = res.json();
    return body || {};
  }

  private handleError(error: Response | any) {
    // In a real world app, we might use a remote logging infrastructure
    let errMsg: string;
    console.log(error)
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      if (error.status == 0) {
        errMsg = `Status : ${error.status}<br>Server Message : ${err}<br>Problem connecting to Server. Please contact IT Support.`;
      } else {
        errMsg = `Status : ${error.status}<br>Message : ${error.statusText || ''} ${err}`;
      }
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    return Observable.throw(errMsg);
  }
}




/*
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
*/
