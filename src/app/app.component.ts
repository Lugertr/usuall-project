import { ChangeDetectionStrategy, Component, inject, ChangeDetectorRef, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { NavBarComponent } from './components/navbar/navbar.component';
import { LoadingBarComponent } from '@core/loading-bar/loading-bar.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { Store } from '@ngrx/store';
import { takeUntil } from 'rxjs';
import { selectShopToken } from './store/auth/auth.selectors';
import { DestroyService } from '@core/services/destroy.service';
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
  providers: [DestroyService],
})
export class AppComponent implements OnInit {
  private readonly store = inject(Store<{ shopToken: string }>);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroy$ = inject(DestroyService);

  isShowingMenu = false;
  showNav = true;

  navLinks = [{ path: CurRoutes.Main, label: 'Главная' }];

  ngOnInit(): void {
    this.store
      .select(selectShopToken)
      .pipe(takeUntil(this.destroy$))
      .subscribe(shopToken => {
        this.showNav = !!shopToken;
        this.cdr.markForCheck();
      });
  }

  sideNavToggle(): void {
    this.isShowingMenu = !this.isShowingMenu;
    this.cdr.markForCheck();
  }
}
