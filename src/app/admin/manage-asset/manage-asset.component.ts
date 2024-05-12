
import { Component, OnInit, ElementRef  } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DataService } from 'src/app/services/data.service';

import { ManageAssetFormDialogComponent } from './manage-asset-form-dialog.component';
import { AssetService } from 'src/app/services/asset.service';
import { OwnersDetailsDialogComponent } from './owners-details-dialog/owners-details-dialog.component';
import { MapComponent } from './map/map.component';

import {
  AngularGridInstance,
  Formatter,Filters
} from 'node_modules/angular-slickgrid';

const updateFormatter: Formatter = (row, cell, value, columnDef, dataContext, grid) => {
  
  return `<button id="myButton"  style="background: rgb(74, 74, 168);color:white;border-radius:5px; height:31px; width:73px
  " >Update</button>
  `;
};
const viewFormatter: Formatter = (row, cell, value, columnDef, dataContext, grid) => {
  
  return `<button id="myButton"  style="background: rgb(74, 74, 168);color:white;border-radius:5px; height:31px; width:73px
  ">View</button>`;
};
const mapFormatter: Formatter = (row, cell, value, columnDef, dataContext, grid) => {
  
  return `<button id="myButton" style="background: rgb(74, 74, 168);color:white; border-radius:5px; height:31px; width:53px" >Add</button>`;
};


@Component({
  selector: 'app-manage-asset',
  templateUrl: './manage-asset.component.html',
  styleUrls: ['./manage-asset.component.css']
})
export class ManageAssetComponent implements OnInit {
  assetForm!: FormGroup;
  page1Data: any[] = [];
  page2Form!: FormGroup; 
  columnDefinitions: any[] = [];
  gridOptions: any = {};
  dataset: any[] = [];
  angularGrid!: AngularGridInstance;

  searchQuery: any ;
  searchQueryLower:any;
  selectedFilterType: string = 'District';
  filteredDataset: any[] = [];
  fieldValueString:any;
  assets:any[]=[]
  assetDoc:any[]=[]
  ownersArray:any=[]
  location:any={};
  format:any[]=[]
  constructor(private dialog: MatDialog, private fb: FormBuilder, private dataService:DataService,
    private assetService: AssetService,private elementRef: ElementRef) {
    this.assetForm = this.fb.group({
      landArea: [''],
      selectedDistrict: [''],
    });
  }

  ngOnInit(): void {
   
    this.fetchAssets();
    console.log("ASSETS",this.assetDoc)

   }   

  showAddNewForm(existingData?: any) {
    
    const dialogRef = this.dialog.open(ManageAssetFormDialogComponent, {
      width: '400px',
      data: existingData 
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(result);
        
        this.fetchAssets(); 
      }
    });
  }
  

 searchFormat={
  'q': "type : land",
  'include_docs': true

 }
  

 callOwnersInfoService(landId:string){
  this.ownersArray=[]
  console.log("iii",landId)
  let id:string;
  this.assetService.getOwners(landId).subscribe((ownersInfo:any)=>{
    ownersInfo.rows.map((item:any)=>{
      
      id=item.id
      console.log("ownerr",item,landId,item.value.data.land)
      this.assetService.getTransactionInfo(id).subscribe((info:any)=>{
        console.log("trans",info.rows[0].value)

        
      this.ownersArray.push({
          owners:item.value.data,
          transaction:info.rows[0].value.data
        
      }
      )
      console.log("array",this.ownersArray)
      })
    

    })

   
  })

 }

  fetchAssets() {
    console.log('Fetching Assets...');

    this.assetService.getOwnersInfo().subscribe((allLand:any)=>{
      this.assets=allLand.rows
      console.log(allLand.rows);
      
    

      console.log("RESPONSE :",this.assets,allLand,allLand.rows[0].value.data.ownersInfo)
      this.assets.map((land,index)=>{
        console.log(land)
        let landId=land.value._id
        
        
        this.assetService.getLocation(landId).subscribe((location:any)=>{
          console.log("loc",this.location)
          location.rows[0].value.data.barcode=land.value.data.barcode,
          location.rows[0].value.data.id=landId

          this.assetDoc.push(
            {
              location: location.rows[0].value.data,
              
            }

          )
      console.log("DOC",this.assetDoc)
      this.dataTable()
      this.lengthFunction()

          
        })
       

      
     
       
      })
     

    })
    console.log("yes")
    
  }


  update_Asset(landId: number) {
    const clickedAsset = this.page1Data.find(asset => asset.some((a: any) => a.landId === landId));
  
    if (clickedAsset) {
      const assetIndex = clickedAsset.findIndex((a: any) => a.landId === landId);
  
      const page2Data = this.assetForm.value;
  
      const ownersData = page2Data.owners;
  
      if (clickedAsset[assetIndex].owners) {
        clickedAsset[assetIndex].owners.push(...ownersData);
      } else {
        clickedAsset[assetIndex].owners = [...ownersData];
      }
  
     
  
    } else {
      console.error('Clicked asset not found. Cannot update.');
    }
  }

  dataTable(){

    var data = ['https://i.stack.imgur.com/Cj07W.jpg?s=128&g=1','data:image/jpeg;base64,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',
  ]
  let index:number=0;
    this.columnDefinitions = [
      { id: 'id', name: 'S.No', field: 'id', sortable: true, maxWidth: 90,  filterable: true, filter: { model: Filters.compoundInputNumber }},
      { id: 'landArea', name: 'Land Area', field: 'landArea', sortable: true, maxWidth: 90, filterable: true, filter: { model: Filters.compoundInputNumber } },
      { id: 'State', name: 'State', field: 'State', sortable: true, maxWidth: 110, filterable: true, filter: { model: Filters.compoundInputText } },
      { id: 'District', name: 'District', field: 'District', sortable: true,maxWidth: 110,  filterable: true, filter: { model: Filters.compoundInputText }},
      { id: 'Taluk', name: 'Taluk', field: 'Taluk', sortable: true, maxWidth: 150  ,filterable: true, filter: { model: Filters.compoundInputText }},
      { id: 'Ward', name: 'Ward', field: 'Ward', sortable: true, maxWidth: 90,  filterable: true, filter: { model: Filters.compoundInputNumber }},
      { id: 'SurveyNumber', name: 'Survey Number', field: 'SurveyNumber', sortable: true, maxWidth: 90 ,  filterable: true, filter: { model: Filters.compoundInputNumber }},
      { id: 'SubdivisionNumber', name: 'Subdivision Number', field: 'SubdivisionNumber', sortable: true, maxWidth: 90 ,  filterable: true, filter: { model: Filters.compoundInputNumber }},
      { id: 'typeOfOwnership', name: 'Type of Ownership', field: 'typeOfOwnership', sortable: true, maxWidth: 150,  filterable: true, filter: { model: Filters.compoundInputText }  },
      { id: 'LandUseType', name: 'Land Use Type', field: 'LandUseType', sortable: true, maxWidth: 150, filterable: true, filter: { model: Filters.compoundInputText }},
      {id: "img", name: "Image", field: "src", formatter: function(args:any,){  return "<img src ='" + data[args] + "' ></img>" }},

      
      {
        id: 'action', name: 'Actions', field: 'action', sortable: false, maxWidth: 110,
        formatter: updateFormatter, onCellClick: (event:any,row:any) => {
          if (event) {
            this.showAddNewForm(this.assetDoc[row.row].location)
          }
        }
        
      },
      {
        id: 'ownership', name: 'Ownership', field: 'ownership', sortable: false, maxWidth: 110,
        formatter: viewFormatter, onCellClick: (event:any,row:any) => {
          if (event) {
            console.log("table",this.page1Data, this.assetDoc,this.assetDoc[row.row].location)
            this.callOwnersInfoService(this.assetDoc[row.row].location.land)
            console.log("dialog",this.ownersArray)
            this.showOwnersDetailsDialog(this.ownersArray)
          }
        }
        
      },
      {
        id: 'map', name: 'Map', field: 'map', sortable: false, maxWidth: 110,
        formatter: mapFormatter, onCellClick: (event:any,row:any) => {
          if (event) {
            
            this.showMapDialog(this.page1Data[row.row])
          }
        }
        
      }
      
      
    ];
   

this.dataset = this.assetDoc.reverse().map((registration, index) => {

return {
id: index + 1,
landArea: registration? registration.location.landArea : "", 
State: registration ? registration.location.state : "",
District: registration ? registration.location.selectedDistrict : "",
Taluk: registration ? registration.location.selectedTaluk : "",
Ward: registration ? registration.location.ward : "",
SurveyNumber: registration ? registration.location.surveyNumber : "",
SubdivisionNumber: registration ? registration.location.subdivisionNumber : "",
typeOfOwnership: registration ? registration.location.ownership : "",
LandUseType: registration ? registration.location.landUseType : "",

};
});

   
    this.gridOptions = {
      enableAutoResize: true,
      enableCellNavigation: true,
      enableSorting: true,     
      enableFiltering: true,
      autoHeight: true,
      explicitInitialization: true, 
      showHeaderRow: true,
      headerRowHeight: 40, 
      rowHeight: 70, 
      enableAsyncPostRender: true,
      enableVirtualRendering: true ,
      autoResize: {
        maxWidth: 1420,
        maxHeight:500
      },
    
  } 
  }

  applyFilter() {
    if (this.selectedFilterType && this.searchQuery) {
      this.filteredDataset = this.page1Data.filter(data => {
       
        
      
          console.log("value",data[0][this.selectedFilterType])

        
            this.fieldValueString = data[0][this.selectedFilterType].toString().toLowerCase();

            this.searchQueryLower = this.searchQuery.toLowerCase();

          return this.fieldValueString==this.searchQueryLower;
        
      });
    } 
    this.page1Data=this.assetDoc
    this.dataTable()
    console.log("aa",this.filteredDataset)
  }
  
  
  
  showOwnersDetailsDialog(assetArray: any[]) {
    const dialogRef = this.dialog.open(OwnersDetailsDialogComponent, {
      width: '600px',
      height:'400px',
     
      data: assetArray,
      
    });
  
    dialogRef.afterClosed().subscribe(result => {
      console.log('Owners View dialog closed:', result,assetArray[0],this.page1Data);
    });
  }
  
  showMapDialog(assetArray: any[]) {
    const dialogRef = this.dialog.open(MapComponent, {
      width: '400px',
      height:'400px',
     
      data: assetArray[0],
      
    });
  
    dialogRef.afterClosed().subscribe(result => {
      console.log('dialog closed:', result);
    });
  }

  lengthFunction(){
    console.log('Fetching Assets...');
    this.assetService.getAllAssets().subscribe(
      (response: any) => {
        this.page1Data = response.asset || [];
        console.log("page",this.page1Data)


      },
      (error) => {
        console.error('Error fetching assets:', error);
      }
    );
  }


}
