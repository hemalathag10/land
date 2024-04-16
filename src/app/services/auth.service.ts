
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError, } from 'rxjs';
import { catchError, switchMap, map } from 'rxjs/operators';
import * as CryptoJS from 'crypto-js';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
 
  private isLoggedIn: boolean = false;
  private isAdminLoggedIn: boolean = false;


  private apiUrl = 'http://localhost:5984/project'; 
  private baseUrl = 'http://localhost:5984/project/form'; 
  CouchURL: string ='https://192.168.57.185:5984/land'; 
  databaseName: string = 'land';
  couchUserName: string = 'd_couchdb';
  couchPassword: string = 'Welcome#2';


  private headers = new HttpHeaders({
    'Authorization': 'Basic ' + btoa('admin:admin'),
    'Content-Type': 'application/json',
  });

  constructor(private http: HttpClient) {
  
  }

getFeedback(){
  const url = `${this.CouchURL}/_design/view/_view/feedbackSearch`
  return this.http.get(url, {
    headers: {
      'Authorization': 'Basic ' + btoa(this.couchUserName + ':' + this.couchPassword)
    }
  })

}

getAllUsers(){
  const url = `${this.CouchURL}/_design/view/_view/userSearch`
  return this.http.get(url, {
    headers: {
      'Authorization': 'Basic ' + btoa(this.couchUserName + ':' + this.couchPassword)
    }
  })
}


setIsLogin(value: boolean) {
  this.isLoggedIn = value;
}
  userLogin(emailId: string,password:string) {
    const url = `${this.CouchURL}/_design/view/_view/emailIdSearch?key="${emailId}"`
    return this.http.get(url, {
      headers: {
        'Authorization': 'Basic ' + btoa(this.couchUserName + ':' + this.couchPassword)
      }
    })}


  isUserLoggedIn(): boolean {
    return this.isLoggedIn;
  }

  adminLogin(userName: string, password: string): Observable<any> {
    const url = `${this.apiUrl}/admin`;

    return this.http.get(url, { headers: this.headers }).pipe(
      switchMap((userData: any) => {
        const adminUser = userData.user.find((u: any) => u.userName === userName && u.password === password);

        if (adminUser) {
          adminUser.lastLogin = new Date().toISOString();
          this.isAdminLoggedIn = true;

          return this.http.put(url, userData, { headers: this.headers }).pipe(
            switchMap(() => {
              return of({ success: true, adminUser });
            })
          );
        } else {
          alert("Invalid user or password")

          return throwError(()=>'Invalid credentials');
        }
      }),
      catchError((error: any) => {
        console.error('Error during admin login:', error);
        throw error;
      })
    );
  }

  

  logout():boolean {

    this.isLoggedIn = false;
    return this.isLoggedIn
  }

  adminLogout():boolean {

    this.isAdminLoggedIn = false;
    return this.isAdminLoggedIn
  }
  userFeedback(document: any):any {


    return this.http.post(this.CouchURL, document,   {
      headers: {
        'Authorization': 'Basic ' + btoa(this.couchUserName + ':' + this.couchPassword)
      }
     });

}
  submitFeedback(feedbackData: any): Observable<any> {
    const url = `${this.apiUrl}/feedback`; 
    console.log("feed",feedbackData)

    return this.http.get(url, { headers: this.headers }).pipe(
      switchMap((feedbackDoc: any) => {
        feedbackDoc.messages.push(feedbackData);

        return this.http.put(url, feedbackDoc, { headers: this.headers }).pipe(
          switchMap(() => {
            return of({ success: true });
          })
        );
      }),
      catchError((error: any) => {
        console.error('Error submitting feedback:', error);
        throw error;
      })
    );
  }

  profile(): Observable<any> {
    const url = `${this.apiUrl}/admin`;

    return this.http.get(url, { headers: this.headers }).pipe(
      map((response: any) => {
        console.log("profile",response)
        return {
          response
        };
      }),
      catchError((error: any) => {
        console.error('Error fetching data:', error);
        throw error;
      })
    );
  }


  userRegistration(document: any):any {


        return this.http.post(`${this.CouchURL}`, document,   {
          headers: {
            'Authorization': 'Basic ' + btoa(this.couchUserName + ':' + this.couchPassword)
          }
         });
    
  }

}
