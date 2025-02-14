import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  inject,
  OnInit,
  Output,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AuthService } from '@core/auth/auth.service';
import { MatMenuModule } from '@angular/material/menu';
import { ProfileComponent } from '../profile/profile.component';
import { NavigationEnd, Router } from '@angular/router';
import { CurRoutes } from 'src/app/app.routes';
import { filter, takeUntil } from 'rxjs';
import { DestroyService } from '@core/services/destroy.service';
import { Themes, ThemeService } from '@core/services/theme.service';
import {MatTooltipModule} from '@angular/material/tooltip';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatToolbarModule,
    MatMenuModule,
    ProfileComponent,
    MatTooltipModule
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DestroyService],
})
export class NavBarComponent implements OnInit {
  @Output() menuToggle: EventEmitter<void> = new EventEmitter();
  private readonly authService = inject(AuthService);
  private readonly themeService = inject(ThemeService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly router = inject(Router);
  private readonly destroy$ = inject(DestroyService);

  showAction = false;

  private isDarkMode = false;

  ngOnInit(): void {
    this.themeService.setTheme();
    this.isDarkMode = this.themeService.getTheme() === Themes.Dark;

    this.showAction = this.router.url.includes(`/${CurRoutes.Auth}`);

    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.showAction = this.router.url.includes(`/${CurRoutes.Auth}`);
        this.cdr.markForCheck();
      });
  }

  logout(): void {
    //this.authService.logout();
  }

  callMenuTrigger(): void {
    this.menuToggle.emit();
  }

  changeTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    this.themeService.setTheme(this.isDarkMode);
  }
}
