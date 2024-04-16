import { Component, OnInit, } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { AssetService } from 'src/app/services/asset.service';
import { FormGroup,FormControl } from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
interface WardData {
  year: number;
  price: number;
}
@Component({
  selector: 'app-reports-analytics',
  templateUrl: './reports-analytics.component.html',
  styleUrls: ['./reports-analytics.component.css']
})
export class ReportsAnalyticsComponent implements OnInit {
  form!: FormGroup;
  assetData: any;
  searchDistrict: string = '';
  searchTaluk: string = '';
  selectedDistrict: string = '';
  selectedDistrictOption:string="";
  selectedTalukOption:string="";

  selectedTaluk: string = '';
  filteredDistricts: string[] = [];
  filteredTaluks: string[] = [];
  myControl = new FormControl('');
  Control = new FormControl('');
  talukList:string[]=[];
  opt:string=""
  filteredOptions!: Observable<string[]>;
  filteredTaluk!: Observable<string[]>;
  ta:string[]=["che","mdu"]
  wards: { [key: number]: WardData[] } = {};
doc:any;
  onDistrictSearch() {
    this.filteredDistricts = this.filterItems(this.districts, this.searchDistrict);
  }

  onTalukSearch() {
    this.filteredTaluks = this.filterItems(this.taluks[this.selectedDistrict], this.searchTaluk);
  }

  filterItems(items: string[] | undefined, searchTerm: string): string[] {
    if (!items) {
      return [];
    }
    return items.filter(item =>
      item.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
    

    constructor(private assetService: AssetService) { }

  ngOnInit() {
    
    console.log("taluks",this.taluks)

    this.fetchAssetData();

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value ?? '')),
      
    );
    
    }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    console.log("dist",this.districts)
    return this.districts.filter(option => option.toLowerCase().includes(filterValue));
  }

 
  
  private fetchAssetData() {
    this.assetService.getAllAssets().subscribe(
      (data) => {
        this.assetData = data;
        this.drawDoughnutChart();
        this.drawPieChart();
        
      
        
      },
      (error) => {
        console.error('Error fetching asset data:', error);
      }
    );
  }



  


private drawLineChart() {
  console.log(this.selectedDistrict,this.selectedTaluk)

  const landValueRange = this.extractLandValueFromDatabase(this.selectedDistrictOption, this.selectedTalukOption);

  const years = Object.keys(landValueRange).map(Number);

  const dataset: { x: number; y: number }[][] = []; 

  const wardNumbers = Object.keys(this.wards);
  
  wardNumbers.forEach((wardNumber: any, index) => {
    const wardData = this.wards[wardNumber];
    const datas: { x: number; y: number }[] = [];
  
    wardData.forEach((wardEntry) => {
      datas.push({ x: wardEntry.year, y: wardEntry.price });
    });
  
    dataset.push(datas);
  
    console.log("data", wardNumbers);
  });
  
  console.log("dataset", dataset);
  

 
  const chart = new Chart(document.getElementById("lineChart") as HTMLCanvasElement, {
    type: 'line',
    data: {
      labels: years,
      datasets: [],
    },
    options: {
      aspectRatio: 2.8,
      scales: {
        y: {
          title: {
            display: true,
            text: 'Price per square feet(Rs.)',
          },
          beginAtZero: true,
          grid: {
            color: 'rgba(0, 0, 0, 0.1)',
          }
        },
        x: {
          title: {
            display: true,
            text: 'Years',
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.1)',
          }
        }
      },
      plugins: {
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          bodyFont: {
            size: 14,
          },
          titleFont: {
            size: 16,
            weight: 'bold',
          },
          callbacks: {
            label: (context: any) => {
              console.log("label",context)
              const currentValue = Math.abs(context.dataset.data[context.dataIndex].y);
              const index = context.dataIndex;
              const previousValue = Math.abs(index > 0 ? context.dataset.data[index - 1].y : null);
              const currentYear = context.dataset.data[context.dataIndex].x;
          console.log("current",currentYear)
          console.log("previous",previousValue)

          let wardInfo = '';
    if (this.wards.hasOwnProperty(currentYear)) {
      wardInfo = ` | Ward: ${this.wards[currentYear].join(', ')}`;
    }
              let Change = previousValue !== 0 ? (((currentValue - previousValue)).toFixed(2)) : '0.00';
              console.log((((currentValue - previousValue) ).toFixed(2)))
              if (isNaN(parseFloat(Change))) {
              Change = 'N/A';
              } else {
               Change = Math.min(parseFloat(Change), 100).toFixed(2);
                if (currentValue < previousValue) {
                  Change = 'Decrease: Rs.' +Change ;
                } else if (currentValue > previousValue) {
                  Change = 'Increase: Rs.' + Change ;
                } else {
                  Change = 'No Change';
                }
              }
          
              return `${currentYear}: Rs.${currentValue.toFixed(2)} | ${Change}${wardInfo}`;
            },
          },
          
        },
        legend: {
          labels: {
            font: {
              size: 14,
            }
          }
        },
      }
    }
  });
  for(let index:number=0;index<wardNumbers.length;index++){
  chart.data.datasets.push({
    label: 'Ward'+ wardNumbers[index],
    data: dataset[index],
    borderColor: `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`,
    backgroundColor: `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`,
    borderWidth: 2,
    pointBackgroundColor: 'rgb(255, 99, 132)',
  })}
}






  private extractLandValueFromDatabase(searchDistrict: string, searchTaluk: string): { [key: number]: number[] }{
    const landValueRange: { [key: number]: number[] } = {};
  
    if (this.assetData ?.asset) {
      this.assetData.asset.forEach((landArray: any[]) => {
        landArray.forEach((land: any) => {

          if (land.selectedDistrict == searchDistrict && land.selectedTaluk == searchTaluk) {
            land.owners.forEach((owner: any) => {
              const ownershipDurationFrom = owner.ownershipDurationFrom;
  
              if (ownershipDurationFrom) {
                const year = new Date(ownershipDurationFrom).getFullYear();
                const purchasePrice = this.getPurchasePrice(owner);
                const landArea = land.landArea || 0;
                console.log("land",land.ward,year,purchasePrice)
                if (this.wards.hasOwnProperty(land.ward)) {
                    this.wards[land.ward].push({ year:year,price: (Math.floor(purchasePrice / landArea) )});
                  
              } else {
                  this.wards[land.ward] = [{ year:year,price:Math.floor (purchasePrice / landArea) }];
              }
console.log("www",this.wards)

  
                if (!isNaN(year) && !isNaN(purchasePrice)) {
                 if (!landValueRange.hasOwnProperty(year)) {
                  landValueRange[year] = [(purchasePrice / landArea)];
                  console.log("p",purchasePrice,landArea,Math.floor(purchasePrice / landArea))
                } else {
                  landValueRange[year].push(Math.floor(purchasePrice/landArea));
                }
                }
              }

            });
          }
        });
      });
    }
  
  console.log("landvalue",landValueRange)
    return landValueRange;
  }
  
  private getPurchasePrice(owner: any): number {
    const nestedOwners = owner.owners;
  
    if (nestedOwners && nestedOwners.length > 0) {
      const purchasePrice = nestedOwners[0].purchasePrice;
  console.log("price",purchasePrice)
      if (typeof purchasePrice === 'number') {
        return purchasePrice;
      } else if (typeof purchasePrice === 'string') {
        return parseInt(purchasePrice, 10) || 0;
      }
    }
  
    return 0;
  }
  
search(){
  this.drawLineChart()

}


  private drawDoughnutChart() {
    const ctx = document.getElementById('doughnutChart') as HTMLCanvasElement;
    const landUseTypes = this.extractLandUseTypesFromDatabase();
   const landUseTypeCount: { [key: string]: number }  = {
    'Industrial': 0,
    'Residential': 0,
    'Commercial': 0,
    'others': 0,
    'Agricultural': 0
  };

  landUseTypes.forEach(landUseType => {
    if (landUseTypeCount.hasOwnProperty(landUseType)) {
      landUseTypeCount[landUseType]++;
    }
  });
console.log(landUseTypeCount)
  const allLabels = Object.keys(landUseTypeCount);
  const dataValues = Object.values(landUseTypeCount);
  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: allLabels,
      datasets: [{
        data: dataValues,
        backgroundColor: ['#fa8e7d', '#92e089', '#8e90ed', '#FFD700', '#e8a0e8'],
      }]
    },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
          }
        }
      }
    });
  }
  
  private drawPieChart() {
    const ctx = document.getElementById('pieChart') as HTMLCanvasElement;
    const ownership = this.extractOwnershipFromDatabase();
    const ownershipTypeCount: { [key: string]: number }  = {
      'Government': 0,
      'Mitta': 0,
      'Zamindari': 0,
      'other': 0,
      'Inam': 0
    };
  
    ownership.forEach(ownershipType => {
      if (ownershipTypeCount.hasOwnProperty(ownershipType)) {
        ownershipTypeCount[ownershipType]++;
      }
    });
  console.log(ownershipTypeCount)
    const allLabels = Object.keys(ownershipTypeCount);
    const dataValues = Object.values(ownershipTypeCount);
    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: allLabels,
        datasets: [{
          data: dataValues,
          backgroundColor: ['#fa8e7d', '#92e089', '#8e90ed', '#FFD700', '#e8a0e8'],
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
          }
        }
      }
    });
  }




  private extractLandUseTypesFromDatabase(): string[] {
    const landUseTypes: string[] = [];
  
    if (this.assetData ?.asset) {
      this.assetData.asset.forEach((landArray: any[]) => { 
        landArray.forEach((land: any) => { 
          landUseTypes.push(land.landUseType);
        });
      });
    }
  
    return landUseTypes;
  }

  private countLandUseTypeOccurrences(landUseTypes: string[]): { [key: string]: number } {
    const landUseTypeCount: { [key: string]: number } = {};

    landUseTypes.forEach(landUseType => {
      landUseTypeCount[landUseType] = (landUseTypeCount[landUseType] || 0) + 1;
    });

    return landUseTypeCount;
  }



  private extractOwnershipFromDatabase(): string[] {
    const ownershipTypes: string[] = [];
  
    if (this.assetData ?.asset) {
      this.assetData.asset.forEach((ownershipArray: any[]) => { 
        ownershipArray.forEach((owner: any) => { 
          ownershipTypes.push(owner.ownership);
        });
      });
    }
  
    return ownershipTypes;
  }

  private countOwnershipTypeOccurrences(ownershipTypes: string[]): { [key: string]: number } {
    const ownershipTypeCount: { [key: string]: number } = {};

    ownershipTypes.forEach(ownershipType => {
      ownershipTypeCount[ownershipType] = (ownershipTypeCount[ownershipType] || 0) + 1;
    });

    return ownershipTypeCount;
  }
  districts: string[] = ['Ariyalur', 'Chennai', 'Madurai'];
  taluks: { [key: string]: string[] } = {
    'Ariyalur': ['none', 'Andimadam', 'Ariyalur', 'Sendurai', 'Udayarpalayam'],
    'Chennai': ['none', 'Alandur', 'Ambattur', 'Aminjikarai', 'Ayanavaram', 'Egmore', 'Guindy', 'Madhavaram', 'Maduravoyal', 'Mambalam', 'Mylapore', 'Perambur', 'Purasawalkam', 'Sholinganallur', 'Thiruvottiyur', 'Tondiarpet', 'Velachery'],
    'Madurai': ['none', 'Kalligudi', 'Madurai East', 'Madurai North', 'Madurai(South)', 'Madurai West', 'Melur', 'Peraiyur', 'Thirupparankundram', 'Tirumangalam', 'Usilampatti', 'Vadipatti'],
  };


  
 
}

