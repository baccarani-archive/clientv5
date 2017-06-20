export interface Dashboard {
    dot1: string;
    effDate: Date;
    expDate: Date;
    safetyRating: string;
    yearInBus: number;
    isDrivingExperience: string;
    primaryALLimit: number;
    primaryCGLimit: number;
    truckersOnly: string;
    primaryELLimit: number;
    isProvidedCommodities: string;
    isUnschedVehicleAuth: string;
    applicantName: string;
    stateCode: string;
    zip: string;
    vehicleType: string;
    hasDOTRevoked: string;
    garbageHaul: string;
}

export interface InitialEligibility {
}
