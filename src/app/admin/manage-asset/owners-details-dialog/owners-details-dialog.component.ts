// owners-details-dialog.component.ts
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-owners-details-dialog',
  templateUrl: './owners-details-dialog.component.html',
  styleUrls: ['./owners-details-dialog.component.css']
})
export class OwnersDetailsDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<OwnersDetailsDialogComponent>
  ) { 
    console.log("data",data)

  }

  closeDialog(): void {
    this.dialogRef.close();
  }}
