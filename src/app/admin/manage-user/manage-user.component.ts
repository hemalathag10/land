import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service'; // Import the correct path

@Component({
  selector: 'app-manage-user',
  templateUrl: './manage-user.component.html',
  styleUrls: ['./manage-user.component.css'] // You can create a separate CSS file for styling
})
export class ManageUserComponent implements OnInit {
  users: any[] = [];
  columnDefinitions: any[] = [];
  gridOptions: any = {};
  dataset: any[] = [];
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.fetchUsers();
    
  }
  

  fetchUsers(): void {
    this.authService.getAllUsers().subscribe(
      (data: any) => {
        this.users = data.rows;
        this.columnDefinitions = [
          { id: 'id', name: 'S.No', field: 'id', sortable: true, maxWidth: 80 },
    
          { id: 'email', name: 'Email', field: 'email', sortable: true, maxWidth: 200 },
          { id: 'createdAt', name: 'CreatedAt', field: 'createdAt', sortable: true,  maxWidth: 200},
          { id: 'lastLogin', name: 'LastLogin', field: 'lastLogin', sortable: true,filterable:true, maxWidth: 240},
    
        ];
        
    
        // Populate dataset dynamically
        this.dataset = this.users.map((registration, index) => ({
          id: index + 1,
          email: registration.value.data.emailId,
          createdAt: this.formatDate(registration.value.data.createdOn, false)
          // lastLogin: this.formatDate(registration.value.data.lastLogin, true)
        }));
        
       
        // Set grid options
        this.gridOptions = {
          enableAutoResize: true,
          enableCellNavigation: true,
          enableSorting: true,
          autoHeight: true, // Disable autoHeight to enable vertical scrolling
          explicitInitialization: true, // Explicit initialization is needed when using autoHeight or virtual scrolling
          showHeaderRow: true, // Show header row if needed
          headerRowHeight: 10, // Adjust header row height as needed
          rowHeight: 40, // Adjust row height as needed
          enableAsyncPostRender: true, // Enable async post render if needed
          enableVirtualRendering: true ,
          autoResize: {
            maxWidth: 700,
            maxHeight:500
          },
      }     
      },
      (error: any) => {
        console.error('Error fetching users:', error);
      }
    ); 
  
}
formatDate(dateString: string, includeTime: boolean): string {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleString('en-US', { month: 'short' });
  const year = date.getFullYear();
  
  if (includeTime) {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    return `${day} ${month} ${year}, ${this.formatTime(hours, minutes, seconds)}`;
  } else {
    return `${day} ${month} ${year}`;
  }
}

// Method to format time
formatTime(hours: number, minutes: number, seconds: number): string {
  return `${this.padZero(hours)}:${this.padZero(minutes)}:${this.padZero(seconds)}`;
}

// Method to pad zero to single digit time values
padZero(value: number): string {
  return value < 10 ? `0${value}` : `${value}`;
}
}