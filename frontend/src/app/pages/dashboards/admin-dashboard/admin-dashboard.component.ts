import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService, User } from '../../../core/services/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  currentUser: User | null = null;
  
  // API RBAC test verification variables
  verificationStatus: 'Pending' | 'Success' | 'Error' = 'Pending';
  verificationResponse: any = null;
  verificationHeaders: string = '';

  // New user invitation form variables
  inviteEmail = '';
  invitePassword = '';
  inviteRole = 'Site_Engineer';
  inviteFirstName = '';
  inviteLastName = '';
  invitePhone = '';
  
  inviteLoading = false;
  inviteSuccessMessage = '';
  inviteErrorMessage = '';

  constructor(
    private authService: AuthService, 
    private http: HttpClient, 
    private router: Router
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.currentUserValue;
    this.testRbacEndpoint();
  }

  testRbacEndpoint() {
    this.verificationStatus = 'Pending';
    this.http.get(`${this.authService.getApiUrl()}/dashboard/admin`).subscribe({
      next: (res: any) => {
        this.verificationStatus = 'Success';
        this.verificationResponse = res;
        this.verificationHeaders = 'Authorization: Bearer ' + this.authService.getToken()?.slice(0, 30) + '...';
      },
      error: (err) => {
        this.verificationStatus = 'Error';
        this.verificationResponse = err.error || err;
        this.verificationHeaders = 'Failed to attach or verify authorization header';
      }
    });
  }

  onInviteUser() {
    this.inviteSuccessMessage = '';
    this.inviteErrorMessage = '';
    this.inviteLoading = true;

    const userData = {
      email: this.inviteEmail,
      password: this.invitePassword,
      role: this.inviteRole,
      profile: {
        firstName: this.inviteFirstName,
        lastName: this.inviteLastName,
        phone: this.invitePhone
      }
    };

    this.authService.inviteUser(userData).subscribe({
      next: (res) => {
        this.inviteLoading = false;
        this.inviteSuccessMessage = `Successfully created user ${res.user.email} as ${res.user.role}!`;
        // Clear form
        this.inviteEmail = '';
        this.invitePassword = '';
        this.inviteFirstName = '';
        this.inviteLastName = '';
        this.invitePhone = '';
      },
      error: (err) => {
        this.inviteLoading = false;
        this.inviteErrorMessage = err.error?.message || 'Error occurred while creating user.';
      }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
