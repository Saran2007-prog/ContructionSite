import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    // 1. Check if the user is authenticated
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return false;
    }

    // 2. Retrieve required roles for this route
    const requiredRoles = route.data['roles'] as Array<string>;
    if (requiredRoles) {
      const userRole = this.authService.getRole();
      if (!userRole || !requiredRoles.includes(userRole)) {
        // Logged in but not authorized for this specific dashboard
        console.warn(`Role verification failed. User role: ${userRole}. Required: ${requiredRoles.join(', ')}`);
        
        // Redirect to login or appropriate page
        this.router.navigate(['/login']);
        return false;
      }
    }

    // Access authorized
    return true;
  }
}
