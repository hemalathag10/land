import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { ReactiveFormsModule } from '@angular/forms';
import { DialogService } from 'src/app/services/dialog.service';
import { MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoginSuccess?: boolean;
  isFormSubmitted: boolean = false; // Add this flag
  successMessage:string=''
  errorMessage:string=''
  

  openRegistrationDialog() {
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
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.authService.login(email, password).subscribe(
        (isValidUser) => {
          this.isLoginSuccess = isValidUser;
          if (isValidUser) {
            this.successMessage='Login successful'
            console.log('Login successful');
            this.dialogRef.close();
            this.router.navigate(['./land-records'])
            // Redirect or display a success message
          } else {
            this.errorMessage='Invalid email or password'
            console.error('Invalid email or password');
            // Display an error message to the user
          }
        },
        (error) => {
          this.errorMessage='Invalid email or password'

          console.error('Login failed:', error);
          // Display an error message to the user
        }
      );
    }
  }
}