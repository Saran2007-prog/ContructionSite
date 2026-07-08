import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService, User } from '../../../core/services/auth.service';

@Component({
  selector: 'app-engineer-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './engineer-dashboard.component.html',
  styleUrls: ['./engineer-dashboard.component.scss']
})
export class EngineerDashboardComponent implements OnInit {
  currentUser: User | null = null;
  
  // Verification states
  verificationStatus: 'Pending' | 'Success' | 'Error' = 'Pending';
  verificationResponse: any = null;
  verificationHeaders: string = '';

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
    this.http.get(`${this.authService.getApiUrl()}/dashboard/engineer`).subscribe({
      next: (res: any) => {
        this.verificationStatus = 'Success';
        this.verificationResponse = res;
        this.verificationHeaders = 'Authorization: Bearer ' + this.authService.getToken()?.slice(0, 30) + '...';
      },
      error: (err) => {
        this.verificationStatus = 'Error';
        this.verificationResponse = err.error || err;
        this.verificationHeaders = 'Failed to verify token';
      }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
