import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { DialogService } from 'src/app/services/dialog.service';
import { MatDialogRef} from '@angular/material/dialog';
import { Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoginSuccess?: boolean;
  isFormSubmitted: boolean = false; 
  successMessage:string=''
  errorMessage:string=''
  

  openLoginDialog() {
    this.dialogService.openRegistrationDialog().subscribe(result => {
      // Handle the result if needed
    });
  }

  constructor(private fb: FormBuilder, private authService: AuthService, private dialogService: DialogService, public dialogRef: MatDialogRef<LoginComponent>, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    this.isFormSubmitted = true;
    let emailId:string=this.loginForm.value.email
    let password:string=this.loginForm.value.password
    console.log("eee",emailId,password)
    this.authService.userLogin(emailId,password).subscribe((users: any) => {
      console.log("users",users)
      let user:any=users.rows[0].value.data.password
      console.log("USERS :",users,user)
      const decryptedPassword = CryptoJS.AES.decrypt(user, 'secret key').toString(CryptoJS.enc.Utf8);
  
      console.log('Decrypted password:', decryptedPassword,this.loginForm.value.password);
      if(decryptedPassword == this.loginForm.value.password){
      this.authService.setIsLogin(true)
      this.successMessage='Login successful'
      console.log('Login successful');
      this.dialogRef.close();
      this.router.navigate(['./land-records'])
      }
      else {
        this.errorMessage='Invalid email or password'
        console.error('Invalid email or password');
      }

    }
  )

  
  }
}