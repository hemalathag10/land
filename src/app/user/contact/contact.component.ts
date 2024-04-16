import { AuthService } from 'src/app/services/auth.service';
import { NgForm } from '@angular/forms';
import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-contact',
  templateUrl:'./contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class contactComponent {
    successMessage: string | null = null;
    submitted: boolean = false;
    @ViewChild('feedbackForm') feedbackForm!: NgForm;
    ngAfterViewInit() {
      }
  
    formData = {
      
      name: '',
      email: '',
      phone: '',
      feedback: ''
    };
  
    constructor(private authService: AuthService) {}
  
    submitForm() {
      this.submitted = true;
  
      if (this.validateForm()) {
        const feedbackData = {
          _id: 'feedback_2_'+uuidv4() ,
          data:{
          name: this.formData.name,
          email: this.formData.email,
          phone: this.formData.phone,
          feedback: this.formData.feedback,
          createdOn:new Date().toLocaleDateString('en-GB'),
          type:"feedback"
          }
        };
  
        this.authService.userFeedback(feedbackData)
          .subscribe(
            (response:any) => {
              console.log('Feedback submitted successfully:', response);
              this.successMessage = 'Feedback submitted successfully';

  
              // Optionally, you can reset the form after successful submission
              this.resetForm();
            },
            (error:any) => {
              console.error('Error submitting feedback:', error);
            }
          );
      } else {
      }
    }
  
    validateForm(): boolean {
      // Additional validation logic can be added here
      return true;
    }
  
    resetForm() {
      this.formData = {
        name: '',
        email: '',
        phone: '',
        feedback: ''
      };
      // Reset form-related variables
      this.submitted = false;
      if (this.feedbackForm && this.feedbackForm.controls) {
        this.feedbackForm.resetForm();
        this.markControlsAsUntouched(this.feedbackForm.controls);
      }
    }
    
    markControlsAsUntouched(controls: { [key: string]: any }) {
      Object.keys(controls).forEach(key => {
        controls[key].markAsUntouched();
      });     
    
    }
}
