import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  signal,
  Signal,
  ViewChild,
} from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { NavBarComponent } from './components/navbar/navbar.component';
import { LoadingBarComponent } from '@core/loading-bar/loading-bar.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '@core/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    RouterModule,
    MatCardModule,
    MatIconModule,
    MatListModule,
    LoadingBarComponent,
    NavBarComponent,
    RouterOutlet
  ],
})
export class AppComponent {
  @ViewChild('sidenav') sidenav;
  authService = inject(AuthService);
  cdr = inject(ChangeDetectorRef);
  isShowingMenu = false;

  isAuthenticated: Signal<boolean> = this.authService.isAuthenticatedSignal()

  navLinks = [
    { path: '/', label: 'Главная' },
  ];

  menuToggleSignal = signal(() => {
    console.log('sideNavToggle called');
    this.sideNavToggle();
  });

  sideNavToggle(): void {
    console.log('testq')
    this.isShowingMenu = !this.isShowingMenu;
  }
}
