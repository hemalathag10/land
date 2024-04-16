// qr-code-scanner.component.ts

import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

declare const Html5QrcodeScanner: any;

@Component({
  selector: 'app-qr-code-scanner',
  templateUrl: './qr-code-scanner.component.html',
  styleUrls: ['./qr-code-scanner.component.css']
})
export class QrCodeScannerComponent implements OnInit {
  private isCodeProcessed = false;
  private htmlScanner: any;

  constructor(
    private dialogRef: MatDialogRef<QrCodeScannerComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) {}

  ngOnInit(): void {
    this.initQrCodeScanner();
  }

  private initQrCodeScanner(): void {
    const onScanSuccess = (decodeText: string, decodeResult: any): void => {
      alert(decodeText)
      if (decodeText && !this.isCodeProcessed) {
        this.data.onScanSuccess(decodeText); 

        console.log('Your QR Code is: ' + decodeText);

        this.isCodeProcessed = true;

        
        this.dialogRef.close();
      }
    };
    

    this.htmlScanner = new Html5QrcodeScanner('my-qr-reader', { fps: 10, qrbos: 250 });
    this.htmlScanner.render(onScanSuccess);
    Html5QrcodeScanner.stop().then((ignore:any) => {
      console.log("stopped",ignore)
    }).catch((err:any) => {
      console.log(err)
    });

  }

  closeScanner(): void {
    this.dialogRef.close();
  }
}


