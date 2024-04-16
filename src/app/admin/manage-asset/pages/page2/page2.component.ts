// page2.component.ts
import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators ,FormArray} from '@angular/forms';

@Component({
  selector: 'app-page2',
  templateUrl:'./page2.component.html',
  styleUrls: ['./page2.component.css']

})
export class Page2Component  {
  @Input() form: FormGroup = this.fb.group({
    ownershipDurationFrom: ['', []],
    ownershipDurationTo: ['', []],
    numOwners: ['', []],
    name: [''],
    contactInformation: [''],

      address: [''],
      purchasePrice: [''],
      marketPrice: [''],

      dateOfTransaction: [''],
      transactionType: [''],
      landUsageHistory: [''],
      buyerDetails: [''],
      sellerDetails: [''],
      north: [''],
      south: [''],
      east: [''],
      west: [''],


    owners: this.fb.array([]),
  });

  ownershipHistory: any[] = [];

  constructor(private fb: FormBuilder) {}

 
  ngOnInit() {
    // Initialize your form if needed
    this.form.addControl('ownershipDurationFrom', this.fb.control('', Validators.required));
    this.form.addControl('ownershipDurationTo', this.fb.control('', Validators.required));
    this.form.addControl('numOwners', this.fb.control('', Validators.required));

    
    
  }

  isValid(): boolean {
    return this.form.valid;
  }
  today: string = new Date().toISOString().split('T')[0];

  get owners() {
    return this.form.get('owners') as FormArray;
  }

  addOwners() {
    const numOwners = this.form.get('numOwners')?.value || 1;
    for (let i = 0; i < numOwners; i++) {
      this.addOwner();
    }
  }

  addOwner() {
    this.owners.push(this.fb.group({
      
      name:[''],
      contactInformation: [''],
      address: [''],
      marketPrice: [''],

      purchasePrice: [''],
      dateOfTransaction: [''],
      transactionType: [''],
      landUsageHistory: [''],
      buyerDetails: [''],
      sellerDetails: [''],
      north: [''],
      south: [''],
      east: [''],
      west: [''],
    }));
  }

  nextPage() {
    // Handle navigation logic to the next page
  }

  submitForm() {
  
      this.ownershipHistory = this.form.value.owners.map((owner: any) => {
        const ownershipFrom = new Date(this.form.value.ownershipDurationFrom);
        const ownershipTo = new Date(this.form.value.ownershipDurationTo);
        const ownershipYears = ownershipTo.getFullYear() - ownershipFrom.getFullYear();

        return {
          name: owner.name || 'Unknown Owner',
          duration: `${ownershipFrom.toLocaleDateString()} to ${ownershipTo.toLocaleDateString()} (${ownershipYears} years)`,
          // Add more details as needed
          ownershipDurationFrom: owner.ownershipDurationFrom || '',
          ownershipDurationTo: owner.ownershipDurationTo || '',
          contactInformation: owner.contactInformation || '',
          address: owner.address || '',
          marketPrice: owner.marketPrice || '',

          purchasePrice: owner.purchasePrice || '',
          dateOfTransaction: owner.dateOfTransaction || '',
          transactionType: owner.transactionType || '',
          landUsageHistory: owner.landUsageHistory || '',
          buyerSellerDetails: owner.buyerSellerDetails || '',
          sellerDetails: owner.sellerDetails || '',
          north: owner.north || '',
          south: owner.south || '',
          east: owner.east || '',
          west: owner.west || '',



        };
      });
      this.updatePreviousOwnerToDate();

    }

    private updatePreviousOwnerToDate() {
      const owners = this.form.get('owners') as FormArray;
      const numOwners = owners.length;
  
      // Iterate through owners array
      for (let i = 1; i < numOwners; i++) {
        const currentOwner = owners.at(i) as FormGroup | null;
  
        // Ensure that currentOwner is not null or undefined
        if (currentOwner && currentOwner instanceof FormGroup) {
          const previousOwner = owners.at(i - 1) as FormGroup;
  
          // Use optional chaining to safely access properties
          const fromValue = currentOwner.get('ownershipDurationFrom')?.value;
          const toValue = currentOwner.get('ownershipDurationTo')?.value;
  
          // Check if current owner's "From Date" is provided and "To Date" is not provided
          if (fromValue && !toValue) {
            // Use optional chaining to safely set the value
            currentOwner.get('ownershipDurationTo')?.setValue(this.today);
          }
        }
      }
    
  }
}