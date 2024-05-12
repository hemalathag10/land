// asset.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, } from 'rxjs';
import { catchError, switchMap, map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AssetService {
  private baseUrl = 'http://localhost:5984/project'; 
  private credentials = 'admin:admin'; 
  CouchURL: string ='https://192.168.57.185:5984/land'; 
  databaseName: string = 'land';
  couchUserName: string = 'd_couchdb';
  couchPassword: string = 'Welcome#2';
  asset:any[]=[]


  constructor(private http: HttpClient) {}
  
  createdoc(document: any):any {


    return this.http.post(`${this.CouchURL}/_bulk_docs`, document,   {
      headers: {
        'Authorization': 'Basic ' + btoa(this.couchUserName + ':' + this.couchPassword)
      }
     });

}

getAssets(document:any):Observable<any>{
  const url=`${this.CouchURL}/_design/landInfoSearch/_search/landInfoSearch`
  return this.http.post(url, document, {
    headers: {
      'Authorization': 'Basic ' + btoa(this.couchUserName + ':' + this.couchPassword)
    }
  })
}

  createAsset(formData: any, documentId: string): Observable<any> {
    const url = `${this.baseUrl}/${documentId}`;
  
    return this.http.get(url, { headers: this.getHeaders() }).pipe(
      switchMap((existingData: any) => {
        const latestRev = existingData._rev;
  
        existingData.asset.push(formData);
  
        return this.http.put(`${url}?rev=${latestRev}`, existingData, { headers: this.getHeaders() });
      }),
      catchError((error: any) => {
        if (error.status === 404) {
          const newDocument = {
            asset: [formData],
          };
  
          return this.http.put(url, newDocument, { headers: this.getHeaders() });
        } else {
          throw error;
        }
      })
    );
  }
  searchAssetByLandId(documentId: string, landId: number): Observable<any> {
    const url = `${this.baseUrl}/doc_asset`;
    return this.http.get(url,{ headers: this.getHeaders() });
  }
  


  updateAsset(Id: string, formData: any): Observable<any> {
  const url = `${this.baseUrl}/doc_asset`;

  return this.http.get(url, { headers: this.getHeaders() }).pipe(
    switchMap((existingData: any) => {
     const indexToUpdate = existingData.asset
  .findIndex((outerArray: any[]) => outerArray.some((obj: any) => obj.barcode === Id));

console.log('formData:', formData.ownershipDurationFrom);
console.log('existingData.asset:', existingData.asset);
console.log('indexToUpdate:', indexToUpdate);

if (indexToUpdate !== -1) {
  const ownersArray = existingData.asset[indexToUpdate][0]?.owners;
  console.log('ownersArray:', ownersArray);
  if (ownersArray) {
    let previousOwners=ownersArray[ownersArray.length-1]
    console.log("pre",previousOwners)
    if (previousOwners.ownershipDurationTo==="present")
    {
      const ownershipFromDate = new Date(formData.ownershipDurationFrom);
      ownershipFromDate.setDate(ownershipFromDate.getDate() - 1);
      previousOwners.ownershipDurationTo = ownershipFromDate.toISOString().split('T')[0];

    }
    ownersArray.push(formData);
    console.log('Updated ownersArray:', ownersArray);
  } else {
    console.error('Owners array is undefined or null');
  }
} else {
  console.error('Index not found for landId:', Id);
}

      return this.http.put(url, existingData, { headers: this.getHeaders() });
    }),
    catchError((error: any) => {
      console.error('Error updating data:', error);
      throw error;
    })
  );
}

  
private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + btoa(this.credentials)
    });
  }


  getAll_Assets(documentId: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + btoa(this.credentials)
    });

    return this.http.get<any>(`${this.baseUrl}/${documentId}`, { headers }).pipe(
      map((response: any) => {
        return {
          page1: response.page1 || [],
          page2: response.page2 || [],
        };
      }),
      catchError((error: any) => {
        console.error('Error fetching data:', error);
        throw error;
      })
    );
  }
  getAllAssets(): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + btoa(this.credentials)
    });
console.log(headers)
    return this.http.get<any>(`${this.baseUrl}/doc_asset`, { headers });
  }

  

getInfo(): Observable<any> {
  const url = `${this.CouchURL}/_design/view/_view/landSearch`;
  return this.http.get(url, {
    headers: {
      'Authorization': 'Basic ' + btoa(this.couchUserName + ':' + this.couchPassword)
    }
  }).pipe(
    map((response: any) => {
      return response.rows.map((eachLand: any) => ({
        barcode: eachLand.value.data.barcode
        
      }),
      

    );
    })
  );
}

async getLandDetails() {
  const url = `${this.CouchURL}/_design/view/_view/landSearch`
  const data=this.http.get(url, {
    headers: {
      'Authorization': 'Basic ' + btoa(this.couchUserName + ':' + this.couchPassword)
    }
  })
  data.subscribe((response:any)=>{
    response.rows.map((eachLand:any,index:number)=>{
      this.getInfo().subscribe((res: any) => {
        this.asset=res

        this.getOwners(eachLand.id,index)
        this.getLocation(eachLand.id,index)
        console.log(this.asset)

      });         
 
     
    })


  });
this.getAssetss()
  return this.asset
 
}



getAssetss(){
  console.log(this.asset)
  
}




getOwnersInfo(){
  const url = `${this.CouchURL}/_design/view/_view/landSearch`
  const data=this.http.get(url, {
    headers: {
      'Authorization': 'Basic ' + btoa(this.couchUserName + ':' + this.couchPassword)
    }
  })
  data.subscribe((response:any)=>{
    response.rows.map((eachLand:any,index:number)=>{
      this.getInfo().subscribe((res: any) => {
        this.asset=res

        this.getOwners(eachLand.id,index)
        this.getLocation(eachLand.id,index)
        console.log(this.asset)

      });         
 
     
    })


  });
this.getAssetss()
  return data
  
}

getOwners(id:any, index?:number){

  const url = `${this.CouchURL}/_design/view/_view/info?key="${id}"`
  const ownersData=this.http.get(url, {
    headers: {
      'Authorization': 'Basic ' + btoa(this.couchUserName + ':' + this.couchPassword)
    }
  })

  ownersData.subscribe((response:any)=>{

    response.rows.map((eachOwner:any,index:number)=>{
      let owner=eachOwner.value.data
      if(index!=undefined){
        this.asset[index].owner=owner
        // this.getAssetss()

      }
      this.getTransactionInfo(eachOwner.id,index)

    })
  })
  return ownersData
}

getTransactionInfo(Id:any,index?:number){
  const url = `${this.CouchURL}/_design/view/_view/ownersInfo?key="${Id}"`
  const transactionData=this.http.get(url, {
    headers: {
      'Authorization': 'Basic ' + btoa(this.couchUserName + ':' + this.couchPassword)
    }
  })

  transactionData.subscribe((response:any)=>{

    response.rows.map((eachTransaction:any)=>{
      let trans=eachTransaction.value.data
      if(index!=undefined){
        this.asset[index].transaction=trans
        // this.getAssetss()

      }
    })
  })
  return transactionData
}

getLocation(landId:any,index?:number){
  const url = `${this.CouchURL}/_design/view/_view/locationSearch?key="${landId}"`
  let LocationData=this.http.get(url, {
    headers: {
      'Authorization': 'Basic ' + btoa(this.couchUserName + ':' + this.couchPassword)
    }
  })
  LocationData.subscribe((response:any)=>{

    response.rows.map((location:any)=>{
      if(index!=undefined){
      this.asset[index].location=location.value.data

      }
    })
  })

  return LocationData
}




  getLandRecordByDetails(district: string, taluk: string, surveyNumber: string, subdivisionNumber:string): Observable<any> {
    const url = `${this.baseUrl}/doc_asset`;
    const headers = this.getHeaders();

    return this.http.get(url, { headers }).pipe(
      map((response: any) => {
        const index = response.asset.findIndex((outerArray: any[]) =>
          outerArray.some((obj: any) =>
            obj.selectedDistrict == district &&
            obj.selectedTaluk == taluk &&
            obj.surveyNumber == surveyNumber &&
            obj.subdivisionNumber == subdivisionNumber
          )
        );
        if (index !== -1) {
          return response.asset[index];
        } 
      }),
      catchError((error: any) => {
        console.error('Error fetching data:', error);
        throw error;
      })
    );
}


getLandRecordByBarcode(barcode:any): Observable<any> {
  const url = `${this.baseUrl}/doc_asset`;
  const headers = this.getHeaders();
  return this.http.get(url, { headers }).pipe(
    map((response: any) => {
      const index = response.asset.findIndex((outerArray: any[]) =>
        outerArray.some((obj: any) =>
          obj.barcode == barcode
         
        )
      );
      if (index !== -1) {
        return response.asset[index];
      } 
    }),
    catchError((error: any) => {
      console.error('Error fetching data:', error);
      throw error;
    })
  );
}

  
}
