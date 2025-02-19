import { ChangeDetectionStrategy, Component, inject, ChangeDetectorRef } from '@angular/core';
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
})
export class AppComponent {
  private readonly cdr = inject(ChangeDetectorRef);

  isShowingMenu = false;

  navLinks = [
    { path: CurRoutes.Main, label: 'Главная' },
    { path: CurRoutes.SyncFAQ, label: 'Инструкция по синхронизации' },
  ];

  sideNavToggle(): void {
    this.isShowingMenu = !this.isShowingMenu;
    this.cdr.markForCheck();
  }
}
