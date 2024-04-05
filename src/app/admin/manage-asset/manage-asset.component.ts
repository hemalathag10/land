
import { Component, OnInit, ElementRef  } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

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
  " >Update</button>`;
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

  constructor(private dialog: MatDialog, private fb: FormBuilder, private assetService: AssetService,private elementRef: ElementRef) {
    this.assetForm = this.fb.group({
      landArea: [''],
      selectedDistrict: [''],
    });
  }

  ngOnInit(): void {
   
    this.fetchAssets();

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
  

  
  

  fetchAssets() {
    console.log('Fetching Assets...');
    this.assetService.getAllAssets().subscribe(
      (response: any) => {
        this.page1Data = response.asset || [];
        console.log("page",this.page1Data)
        this.dataTable()


      },
      (error) => {
        console.error('Error fetching assets:', error);
      }
    );
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
      {
        id: 'action', name: 'Actions', field: 'action', sortable: false, maxWidth: 110,
        formatter: updateFormatter, onCellClick: (event:any,row:any) => {
          if (event) {
            this.showAddNewForm(this.page1Data[row.row][0])
          }
        }
        
      },
      {
        id: 'ownership', name: 'Ownership', field: 'ownership', sortable: false, maxWidth: 110,
        formatter: viewFormatter, onCellClick: (event:any,row:any) => {
          if (event) {
            
            this.showOwnersDetailsDialog(this.page1Data[row.row])
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
    


this.dataset = this.page1Data.reverse().map((registrationArray, index) => {
const registration = registrationArray[0];
return {
id: index + 1,
landArea: registration ? registration.landArea : "", 
State: registration ? registration.state : "",
District: registration ? registration.selectedDistrict : "",
Taluk: registration ? registration.selectedTaluk : "",
Ward: registration ? registration.ward : "",
SurveyNumber: registration ? registration.surveyNumber : "",
SubdivisionNumber: registration ? registration.subdivisionNumber : "",
typeOfOwnership: registration ? registration.ownership : "",
LandUseType: registration ? registration.landUseType : "",

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
      rowHeight: 40, 
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
    this.page1Data=this.filteredDataset
    this.dataTable()
    console.log("aa",this.filteredDataset)
  }
  
  
  
  showOwnersDetailsDialog(assetArray: any[]) {
    const dialogRef = this.dialog.open(OwnersDetailsDialogComponent, {
      width: '600px',
      height:'400px',
     
      data: assetArray[0],
      
    });
  
    dialogRef.afterClosed().subscribe(result => {
      console.log('Owners View dialog closed:', result);
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

}
