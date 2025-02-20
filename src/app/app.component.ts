import { ChangeDetectionStrategy, Component, inject, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { NavBarComponent } from './components/navbar/navbar.component';
import { LoadingBarComponent } from '@core/loading-bar/loading-bar.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { CurRoutes } from './app.routes';
import { fromEvent, takeUntil } from 'rxjs';
import { DestroyService } from '@core/services/destroy.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
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
    RouterOutlet,
  ],
  providers: [DestroyService],
})
export class AppComponent implements AfterViewInit {
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroy$ = inject(DestroyService);

  isShowingMenu = false;
  isMobile = window.innerWidth <= environment.mobileWidth;

  navLinks = [
    { path: CurRoutes.Main, label: 'Главная' },
    { path: CurRoutes.SyncFAQ, label: 'Инструкция по синхронизации' },
  ];

  ngAfterViewInit(): void {
    fromEvent(window, 'resize')
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: event => {
          const userWindow = event.target as Window;
          this.isMobile = userWindow.innerWidth <= environment.mobileWidth;
          this.cdr.markForCheck();
        },
      });
  }

  sideNavToggle(): void {
    this.isShowingMenu = !this.isShowingMenu;
    this.cdr.markForCheck();
  }
}
