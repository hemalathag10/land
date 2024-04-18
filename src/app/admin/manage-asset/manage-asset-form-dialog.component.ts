// manage-asset-form-dialog.component.ts
import { Component, Inject, ViewChildren, QueryList, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Page1Component } from './pages/page1/page1.component';
import { Page2Component } from './pages/page2/page2.component';
import { AssetService } from 'src/app/services/asset.service';
import {v4 as uuidv4} from 'uuid';


@Component({
  selector: 'app-manage-asset-form-dialog',
  templateUrl: './manage-asset-form-dialog.component.html',
  styleUrls: ['./manage-asset-form-dialog.component.css']
})
export class ManageAssetFormDialogComponent implements AfterViewInit {
  formData: any; 


  ngOnInit() {
      
  
  }
  page1Form: FormGroup;
  page2Form: FormGroup;
  assetForm!: FormGroup;
  page1Data: any[] = [];
  page1:any[]=[]
  pageForms: FormGroup[] = [];
  success:string='';
  pageComponents: { [key: string]: QueryList<any> } = {};
  currentPage: number = 1;
  land:any;
  landLocationInfo:any;
  ownersInfo:any;
  ownersContactInfo:any;
  transactionInfo:any;
  couchData:any={"docs":[]}
  ownerData:any;
  @ViewChildren(Page1Component) page1Components!: QueryList<Page1Component>;
  @ViewChildren(Page2Component) page2Components!: QueryList<Page2Component>;
  doc:any[]=[];
  constructor(
    private cdRef: ChangeDetectorRef,
    private AssetService: AssetService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ManageAssetFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,    
    private assetService: AssetService 

  ) 
  {
    this.page1Form = this.fb.group({
      barcode: ['', Validators.required],
      landArea: ['', Validators.required],
      selectedDistrict: ['', Validators.required],
      selectedTaluk: ['', Validators.required],
      state: ['', Validators.required],
    });

    this.page2Form = this.fb.group({
      ownershipDurationFrom: ['', []],
      ownershipDurationTo: ['', Validators.required],
      numOwners: ['', Validators.required],
      owners: this.fb.array([]), 
    });
    this.page1Form.patchValue(data);
    this.page2Form.patchValue(data);
    this.pageForms.push(this.page1Form);
    this.pageForms.push(this.page2Form);
    console.log("kkk",data,data.id)

  }

  
  setPageComponents(pageNumber: number, components: QueryList<any>) {
    this.pageComponents[`page${pageNumber}Components` as keyof ManageAssetFormDialogComponent] = components;
  }

  ngAfterViewInit() {
    this.setPageComponents(1, this.page1Components);
    this.setPageComponents(2, this.page2Components);
    this.pageForms[this.currentPage - 1].patchValue(this.data);
    
  }

  nextPage() {
    const currentForm = this.pageForms[this.currentPage - 1];

    if (currentForm.valid) {
      this.currentPage++;
    } else {
      console.log('Current page form is not valid.');
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  isPageValid(components: QueryList<any>): boolean {
    return components && components.length > 0 && components.toArray().every(component => component.isValid());
  }
 


onSubmitting() {
  const page1=this.page1Form.value;
  console.log("form",page1,this.page1Form.value,this.page2Form.value)
  if(!this.page1Form){
  this.couchData.docs.push(
    this.land={
      _id:"land_2_" + uuidv4(),
      data:{
        barcode:page1.barcode,
        type:"land",
        createdOn:new Date().toLocaleString('en-GB')
      }
    },
  
    this.landLocationInfo={
      _id:"landLocationInfo_2_"+ uuidv4(),
      data:{
        landArea: page1.landArea,
        selectedDistrict: page1.selectedDistrict,
        selectedTaluk: page1.selectedTaluk,
        state: page1.state,
        ward: page1.ward,
        surveyNumber: page1.surveyNumber,
        subdivisionNumber: page1.subdivisionNumber,
        ownership: page1.ownership,
        landUseType: page1.landUseType,
        type:"landLocationInfo",
        land: this.land._id,
        createdOn:new Date().toLocaleString('en-GB')
      }
    },
   
  )
}
   
  let owners:any=this.page2Form.value.owners
  for(let owner of owners){
    this.ownerData={
      _id:"ownersInfo_2_" + uuidv4(),
      data:{
        ownershipDurationFrom: owner.ownershipDurationFrom,
        ownershipDurationTo: owner.ownershipDurationTo,
        name: owner.name,
        contactNumber: owner.contactInformation,
        address:owner.address,   
        land: this.page1Form? this.data.id :this.land._id ,      
        type:"ownersInfo",
        createdOn:new Date().toLocaleString('en-GB')
      }
    }
    console.log("AAAA",this.ownerData)
   

    this.transactionInfo={
      _id:"transactionInfo_2_" + uuidv4(),
      data:{
      purchasePrice: owner.purchasePrice,
      dateOfTransaction: owner.dateOfTransaction,
      transactionType: owner.transactionType,
      landUsageHistory: owner.landUsageHistory,
      sellerName: owner.sellerDetails,
      type:"transactionInfo",
      ownersInfo:this.ownerData._id 
      }
    }
    this.doc.push(this.ownerData)
    this.couchData.docs.push(this.ownerData,this.transactionInfo)
    console.log("DOCc",this.doc)
    console.log("couchdata",this.couchData)
}
  
    
    console.log("couchdata",this.couchData)

    this.assetService.createdoc(this.couchData).subscribe((response:any )=> {
      console.log('Data stored successfully:', response.rows[0].value.ownersInfo);

    },
    (error: any) => {
      console.error('Error storing data:', error);
    });
  
  const existingData = this.data;

  const page2Data = this.page2Form.value;
  console.log("page2",page2Data)
 
  if (!page2Data.ownershipDurationTo) {
    page2Data.ownershipDurationTo = 'present';
  }


  if(existingData){      
    console.log("exist",this.data.owners)
    let owners=this.data.owners
   
  this.assetService.updateAsset(this.data.barcode, page2Data).subscribe(
    (response: any) => {
      console.log('Data updated in the database successfully:', response);
      console.log("DOC",this.doc,this.couchData)

      this.dialogRef.close();
    },
    (error) => {
      console.error('Error updating data in the database:', error);
    }
  );
  }
  else{

    const page1=this.page1Form.value;
    page1.owners=[page2Data]
    page1.created_at = new Date();

  
 console.log('All page data:', [page1]);
    
this.assetService.createAsset([page1], 'doc_asset').subscribe(
    (response: any) => {
   console.log('Data stored in the database successfully:', response);
   this.success="Data stored successfully"
   this.dialogRef.close()
  },
      (error) => {
      console.error('Error storing data in the database:', error);
  
  this.dialogRef.close();
  });

  }
}

}