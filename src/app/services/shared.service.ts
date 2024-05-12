// shared.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject,  Subject  } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class SharedService {
  public _fetchedData: any; 
  private decodedTextSubject = new Subject<string>();
  decodedText$ = this.decodedTextSubject.asObservable();

  sendDecodedText(decodedText: string) {
    this.decodedTextSubject.next(decodedText);
  }
  get fetchedData(): any {
    return this._fetchedData;
  }

  setFetchedData(data: any): void {
    this._fetchedData = data;
  }
  private showScanningSectionSubject = new BehaviorSubject<boolean>(false);
  showScanningSection$ = this.showScanningSectionSubject.asObservable();
  private userLoggedInSubject = new BehaviorSubject<boolean>(false);
  userLoggedIn$ = this.userLoggedInSubject.asObservable();

  constructor() {
    this.showScanningSectionSubject.next(false);
    this.userLoggedInSubject.next(false);
  }

  updateShowScanningSection(value: boolean) {
    this.showScanningSectionSubject.next(value);
  }

  updateUserLoggedInStatus(loggedIn: boolean) {
    this.userLoggedInSubject.next(loggedIn);
  }
}
