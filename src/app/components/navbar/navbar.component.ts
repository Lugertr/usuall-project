import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { CurRoutes } from 'src/app/app.routes';
import { filter, mergeMap, takeUntil } from 'rxjs';
import { DestroyService } from '@core/services/destroy.service';
import { Themes, ThemeService } from '@core/services/theme.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { selectShop } from 'src/app/store/auth/auth.selectors';
import { DeliveryLogoMap, KeeperLogoMap } from 'src/app/models/asstets-paths';
import { NgOptimizedImage } from '@angular/common';
import { SyncModalLoaderComponent } from '../sync-modal-loader/sync-modal-loader.component';
import { SyncDescModalComponent } from '../sync/sync-desc-modal/sync-desc-modal.component';
import { OverlayModule } from '@angular/cdk/overlay';
import { NavBarNotificationService } from './services/navbar-notification.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatListModule,
    RouterLink,
    MatToolbarModule,
    MatMenuModule,
    MatTooltipModule,
    NgOptimizedImage,
    OverlayModule,
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DestroyService, RouterOutlet, NavBarNotificationService],
})
export class NavBarComponent implements OnInit {
  @Output() menuToggle: EventEmitter<void> = new EventEmitter();
  private readonly themeService = inject(ThemeService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly router = inject(Router);
  private readonly destroy$ = inject(DestroyService);
  private readonly dialog = inject(MatDialog);
  private readonly store = inject(Store);
  private readonly visitService = inject(NavBarNotificationService);

  linkToMain = `/${CurRoutes.Main}`;
  hideAction = false;
  logoSrc = KeeperLogoMap[Themes.Light];
  isKeeper = false;
  showSyncNotification = false;
  private isDarkMode = false;

  ngOnInit(): void {
    this.themeService.setTheme();
    this.setNotification();

    this.themeService.theme$.pipe(takeUntil(this.destroy$)).subscribe(theme => {
      this.isDarkMode = theme === Themes.Dark;
      this.updateLogo();
    });

    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.destroy$),
      )
      .subscribe(event => {
        this.isKeeper = event.urlAfterRedirects.includes(CurRoutes.Auth) || event.urlAfterRedirects.includes(CurRoutes.SyncFAQ);
        this.updateLogo();
      });

    this.store
      .select(selectShop)
      .pipe(takeUntil(this.destroy$))
      .subscribe(shop => {
        this.hideAction = !shop?.params;
        this.cdr.markForCheck();
      });
  }

  openProfile(): void {
    if (this.hideAction) {
      return;
    }
    this.router.navigate([CurRoutes.Profile]);
  }

  editProfile(): void {
    if (this.hideAction) {
      return;
    }
    this.router.navigate([CurRoutes.Auth], { state: { isEdit: true } });
  }

  onSync(): void {
    if (this.hideAction) {
      return;
    }

    this.dialog
      .open<SyncDescModalComponent, void, boolean>(SyncDescModalComponent, {
        disableClose: true,
      })
      .afterClosed()
      .pipe(
        filter(Boolean),
        mergeMap(() => {
          return this.dialog
            .open<SyncModalLoaderComponent, void, void>(SyncModalLoaderComponent, {
              disableClose: true,
            })
            .afterClosed();
        }),
        takeUntil(this.destroy$),
      )
      .subscribe();
  }

  callMenuTrigger(): void {
    if (this.hideAction) {
      return;
    }
    this.menuToggle.emit();
  }

  changeTheme(): void {
    this.themeService.setTheme(!this.isDarkMode);
  }

  updateLogo(): void {
    const logo = this.isKeeper ? KeeperLogoMap : DeliveryLogoMap;
    const theme = this.isDarkMode ? Themes.Dark : Themes.Light;
    this.logoSrc = logo[theme];
    this.cdr.detectChanges();
  }

  setNotification(): void {
    if (!this.visitService.hasVisitedInLast24Hours()) {
      this.showSyncNotification = true;
    }
    this.visitService.updateVisitTime();
  }
}
