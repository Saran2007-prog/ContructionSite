import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  // Login input fields
  email = '';
  password = '';
  errorMessage = '';
  loading = false;

  // Active view state
  activeTab: 'home' | 'about' | 'contact' | 'login' | 'register' = 'home'; // Render home on initial load

  // Sign Up / Registration input fields
  signUpEmail = '';
  signUpPassword = '';
  signUpRole = 'Worker'; // Default dropdown choice
  signUpFirstName = '';
  signUpLastName = '';
  signUpPhone = '';
  
  signUpLoading = false;
  signUpSuccessMessage = '';
  signUpErrorMessage = '';

  constructor(private authService: AuthService, private router: Router) {
    if (this.authService.isAuthenticated()) {
      this.redirectByRole();
    }
  }

  ngOnInit() {
    // Defaults to home landing screen on load
  }

  setTab(tab: 'home' | 'about' | 'contact' | 'login' | 'register') {
    this.activeTab = tab;
    this.errorMessage = '';
    this.signUpErrorMessage = '';
    this.signUpSuccessMessage = '';
    
    if (tab === 'home' || tab === 'about' || tab === 'contact') {
      this.scrollToSection(tab);
    }
  }

  private scrollToSection(sectionId: string) {
    // Wait for DOM to register activeTab rendering the scrollpane
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
  }

  onSubmit() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Please enter both email and password';
      return;
    }

    this.errorMessage = '';
    this.loading = true;

    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        this.loading = false;
        this.redirectByRole();
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Login failed. Please check your credentials.';
      }
    });
  }

  onSignUp() {
    if (!this.signUpEmail || !this.signUpPassword || !this.signUpFirstName || !this.signUpLastName || !this.signUpRole) {
      this.signUpErrorMessage = 'Please fill out all required fields';
      return;
    }

    this.signUpErrorMessage = '';
    this.signUpSuccessMessage = '';
    this.signUpLoading = true;

    const userData = {
      email: this.signUpEmail,
      password: this.signUpPassword,
      role: this.signUpRole,
      profile: {
        firstName: this.signUpFirstName,
        lastName: this.signUpLastName,
        phone: this.signUpPhone
      }
    };

    this.authService.register(userData).subscribe({
      next: (res) => {
        this.signUpLoading = false;
        this.signUpSuccessMessage = 'Registration successful! You can now Sign In.';
        
        // Clear Sign Up fields
        this.signUpEmail = '';
        this.signUpPassword = '';
        this.signUpFirstName = '';
        this.signUpLastName = '';
        this.signUpPhone = '';
        this.signUpRole = 'Worker';

        // Auto transition to Sign In form after a short delay
        setTimeout(() => {
          this.setTab('login');
          this.errorMessage = '';
        }, 2000);
      },
      error: (err) => {
        this.signUpLoading = false;
        this.signUpErrorMessage = err.error?.message || 'Registration failed. Please check details.';
      }
    });
  }

  private redirectByRole() {
    const role = this.authService.getRole();
    switch (role) {
      case 'Administrator':
        this.router.navigate(['/admin-dashboard']);
        break;
      case 'Project_Manager':
        this.router.navigate(['/pm-dashboard']);
        break;
      case 'Site_Engineer':
        this.router.navigate(['/engineer-dashboard']);
        break;
      case 'Contractor':
        this.router.navigate(['/contractor-dashboard']);
        break;
      case 'Client':
        this.router.navigate(['/client-dashboard']);
        break;
      case 'Worker':
        this.router.navigate(['/worker-dashboard']);
        break;
      default:
        this.router.navigate(['/login']);
        break;
    }
  }
}
