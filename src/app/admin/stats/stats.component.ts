import { Component, OnInit } from '@angular/core';
import { AssetService } from 'src/app/services/asset.service';
import { DataService } from 'src/app/services/data.service';
import { AuthService } from 'src/app/services/auth.service';
import {
  AngularGridInstance,
  FieldType,
  Filters,Formatters
} from 'node_modules/angular-slickgrid';


@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css']
})
export class StatsComponent implements OnInit {
  totalAssets: number = 0;
  totalUsers: number = 0;
  recentRegistrations: number = 0;
  newAssetsToday: number = 0;
  newUsersToday: number = 0;
  recentRegistrationsData: any[] = [];
  columnDefinitions: any[] = [];
  gridOptions: any = {};
  dataset: any[] = [];
  angularGrid!: AngularGridInstance;
  districts: string[] = ['Ariyalur', 'Chennai', 'Madurai'];
  recentAssetArray:any[]=[]
  recent:any[]=[]
  recentArrayLength:number=0
  searchQuery: any ;
  searchQueryLower:any;
  selectedFilterType: string = 'District';
  filteredDataset: any[] = [];
  fieldValueString:any;

  constructor(private assetService: AssetService, private dataService:DataService,
    private authService:AuthService
  ) {}
  
  ngOnInit() {
    
    this.processData()
  }
  landSearch(allLand: any[]) {
    const promises = allLand.map(land => {
      let landId = land.value._id;
      return this.locationSearch(landId);
    });
  
    Promise.all(promises).then(() => {
      this.recentRegistrations = this.recent.length;
      console.log("ppp", this.recent);
      this.recentRegistrationsData=this.recent
      console.log("table",this.recentRegistrationsData)

      console.log('Recent Data:', this.recent);
    }).catch(error => {
      console.error('Error:', error);
    });
  }
  
  locationSearch(landId: any): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.assetService.getLocation(landId).subscribe((location: any) => {
        let asset = location.rows[0].value.data;
        this.recentAssetArray.push(asset);
        this.recentArrayLength+=1
  
        const last7Days = new Date();
        last7Days.setDate(last7Days.getDate() - 7);
  
        let d = parseInt(asset.createdOn.slice(0, 2), 10);
        let m = parseInt(asset.createdOn.slice(3, 5), 10) - 1;
        let y = parseInt(asset.createdOn.slice(6, 10), 10);
        let fulldate = new Date(y, m, d);
  
        if (fulldate > last7Days) {
          this.recent.push(asset);
          this.dataTable()

        }
        if((asset.createdOn.slice(0,10)) === (new Date().toLocaleString('en-GB').slice(0,10))){
          this.newAssetsToday+=1
        }
        
        resolve();
      }, error => {
        console.error('Error fetching location:', error);
        reject(error);
      });
    });
  }
  
  processData(){
    this.assetService.getOwnersInfo().subscribe((allLand:any)=>{
      console.log("land",allLand)
      this.landSearch(allLand.rows)
      this.totalAssets=allLand.rows.length
      console.log("ttt",this.recent)
      
  
})



    this.authService.getAllUsers().subscribe((response: any) => {
      const users: any[] = response.rows || [];

      this.totalUsers = users.length;

      users.map((user:any) =>{
   
        let fulldate = user.key.createdOn
        let today=new Date().toLocaleString('en-GB').slice(0,10)
        console.log(user.key.createdOn,today)

        if(fulldate === today){
          this.newUsersToday+=1
        }
      }
      )

      console.log(this.newUsersToday);
    });

  }

  dataTable(){
    this.columnDefinitions = [
      { id: 'id', name: 'S.No', field: 'id', sortable: true, maxWidth: 90 ,  filterable: true, filter: { model: Filters.compoundInputNumber }},
      { id: 'landArea', name: 'Land Area', field: 'landArea', sortable: true, maxWidth: 90, filterable: true, filter: { model: Filters.compoundInputNumber} },
      { id: 'State', name: 'State', field: 'State', sortable: true, maxWidth: 110, filterable: true, filter: { model: Filters.compoundInputText } },
      { id: 'District', name: 'District', field: 'District', sortable: true,maxWidth: 120,filterable:true, filter: { model: Filters.compoundInputText } },
      { id: 'Taluk', name: 'Taluk', field: 'Taluk', sortable: true, maxWidth: 310 , type: FieldType.string, filterable: true, filter: { model: Filters.compoundInputText }},
      { id: 'Ward', name: 'Ward', field: 'Ward', sortable: true, maxWidth: 100, filterable: true,filter: { model: Filters.compoundInputNumber}},
      { id: 'SurveyNumber', name: 'Survey Number', field: 'SurveyNumber', sortable: true, maxWidth: 130,filterable: true, filter: { model: Filters.compoundInputNumber} },
      { id: 'SubdivisionNumber', name: 'Subdivision Number', field: 'SubdivisionNumber', sortable: true, maxWidth: 130,filterable: true, filter: { model: Filters.compoundInputNumber} },
      { id: 'ownership', name: 'Type of Ownership', field: 'ownership', sortable: true, maxWidth: 150, filterable: true,filter: { model: Filters.compoundInputText}},
      { id: 'LandUseType', name: 'Land Use Type', field: 'LandUseType', sortable: true, maxWidth: 150, filterable: true,filter: { model: Filters.compoundInputNumber}},
    ];

      this.dataset = this.recent.reverse().map((registration, index) => ({
      id: index + 1,
      landArea: registration.landArea,
      State: registration.state,
      District:registration.selectedDistrict,
      Taluk:registration.selectedTaluk,
      Ward:registration.ward,
      SurveyNumber:registration.surveyNumber,
      SubdivisionNumber:registration.subdivisionNumber,
      ownership:registration.ownership,
      LandUseType:registration.landUseType,

    }));

    
   
    this.gridOptions = {
      enableAutoResize: true,
      enableCellNavigation: true,
      enableSorting: true,
      enableFiltering: true,
      autoHeight: true, // Disable autoHeight to enable vertical scrolling
      explicitInitialization: true, // Explicit initialization is needed when using autoHeight or virtual scrolling
      showHeaderRow: true, // Show header row if needed
      headerRowHeight: 50, // Adjust header row height as needed
      rowHeight: 40, // Adjust row height as needed
      enableAsyncPostRender: true, // Enable async post render if needed
      enableVirtualRendering: true ,
      autoResize: {
        maxWidth: 1200,
        maxHeight:500
      },
    
    };
  }
  applyFilter() {
    if (this.selectedFilterType && this.searchQuery) {
      this.filteredDataset = this.recentRegistrationsData.filter(data => {
       
        
        console.log("jjj",data[this.selectedFilterType],data, typeof(this.searchQuery))
      
          console.log("value",data[this.selectedFilterType])

        
            this.fieldValueString = data[this.selectedFilterType].toString().toLowerCase();

            this.searchQueryLower = this.searchQuery.toLowerCase();

          return this.fieldValueString==this.searchQueryLower;
        
      });
    } 
    this.recentRegistrationsData=this.filteredDataset
    this.dataTable()
    console.log("aa",this.filteredDataset)
  }
  
  
  angularGridReady(event: any) {
    this.angularGrid = event.grid;
  }
  

}
