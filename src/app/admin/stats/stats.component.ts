import { Component, OnInit } from '@angular/core';
import { AssetService } from 'src/app/services/asset.service';
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

  
  searchQuery: any ;
  searchQueryLower:any;
  selectedFilterType: string = 'District';
  filteredDataset: any[] = [];
  fieldValueString:any;

  constructor(private assetService: AssetService) {}
  
  ngOnInit() {
    
    this.processData()
  }
  processData(){
    this.assetService.getAllAssets().subscribe((response: any) => {
      const assetsArrays: any[][] = response.asset || [];
      console.log("response", response);
      this.totalAssets = assetsArrays.length;
      const today = new Date().toISOString().split('T')[0];
      this.newAssetsToday = assetsArrays.filter(assetArray =>
        assetArray.some(asset =>
          asset.created_at && asset.created_at.split('T')[0] === today
        )
      ).length;

      const last7Days = new Date();
      last7Days.setDate(last7Days.getDate() - 7);

      this.recentRegistrationsData = assetsArrays
        .flatMap(assetArray => assetArray.filter(asset =>
          asset.created_at && new Date(asset.created_at) > last7Days
        ));

      console.log('Recent Registrations Data:', this.recentRegistrationsData);

      this.recentRegistrations = this.recentRegistrationsData.length;
      this.dataTable()
      
     
    });

    this.assetService.getAllUsers().subscribe((response: any) => {
      const users: any[] = response.user || [];

      console.log(users.length);
      this.totalUsers = users.length;
      const today = new Date().toISOString().split('T')[0];

      this.newUsersToday = users.filter(user =>
        user.createdAt && user.createdAt.split('T')[0] === today
      ).length;

      console.log(this.newUsersToday);
    });

  }

  dataTable(){
    this.columnDefinitions = [
      { id: 'id', name: 'S.No', field: 'id', sortable: true, maxWidth: 90 ,  filterable: true, filter: { model: Filters.compoundInputNumber }},
      { id: 'Date', name: 'Date', field: 'Date', sortable: true, maxWidth: 120,formatter: Formatters.dateIso,      type: FieldType.date, filterable: true, filter: { model: Filters.compoundDate }},
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


      this.dataset = this.recentRegistrationsData.reverse().map((registration, index) => ({
      id: index + 1,
      Date: registration.owners[registration.owners.length - 1].ownershipDurationFrom,
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

    
   
    // Set grid options
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
    // Update the dataset used by SlickGrid to the filtered dataset
    this.recentRegistrationsData=this.filteredDataset
    this.dataTable()
    console.log("aa",this.filteredDataset)
  }
  
  
  angularGridReady(event: any) {
    this.angularGrid = event.grid;
  }
  

}
