import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { NavigationEnd, Router } from '@angular/router';
import { CurRoutes } from 'src/app/app.routes';
import { filter, takeUntil } from 'rxjs';
import { DestroyService } from '@core/services/destroy.service';
import { Themes, ThemeService } from '@core/services/theme.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { ModalLoaderComponent } from '../modal-loader/modal-loader.component';
import { Store } from '@ngrx/store';
import { selectShop } from 'src/app/store/auth/auth.selectors';
import { DeliveryLogoMap, KeeperLogoMap } from 'src/app/models/asstets-paths';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatListModule, MatToolbarModule, MatMenuModule, MatTooltipModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DestroyService],
})
export class NavBarComponent implements OnInit {
  @Output() menuToggle: EventEmitter<void> = new EventEmitter();
  private readonly themeService = inject(ThemeService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly router = inject(Router);
  private readonly destroy$ = inject(DestroyService);
  private readonly dialog = inject(MatDialog);
  private readonly store = inject(Store);

  hideAction = false;
  logoSrc = KeeperLogoMap[Themes.Light];
  private isAuthPage = false;
  private isDarkMode = false;

  ngOnInit(): void {
    this.themeService.setTheme();

    this.themeService.theme$.pipe(takeUntil(this.destroy$)).subscribe(theme => {
      this.isDarkMode = theme === Themes.Dark;
      this.updateLogo();
    });

    const routeSub = this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(event => {
      this.isAuthPage = event.urlAfterRedirects.includes(CurRoutes.Auth);
      this.updateLogo();
    });

    this.store
      .select(selectShop)
      .pipe(takeUntil(this.destroy$))
      .subscribe(shop => {
        this.hideAction = !!shop.params;
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
    this.dialog.open<ModalLoaderComponent, void, void>(ModalLoaderComponent, {
      disableClose: true,
    });
  }

  callMenuTrigger(): void {
    if (this.hideAction) {
      return;
    }
    this.menuToggle.emit();
  }

  changeTheme(): void {
    this.themeService.setTheme(this.isDarkMode);
  }

  updateLogo(): void {
    const logo = this.isAuthPage ? KeeperLogoMap : DeliveryLogoMap;
    const theme = this.isDarkMode ? Themes.Dark : Themes.Light;
    this.logoSrc = logo[theme];
  }
}
