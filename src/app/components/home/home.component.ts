import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { DestroyService } from '@core/services/destroy.service';
import { Themes, ThemeService } from '@core/services/theme.service';
import { takeUntil } from 'rxjs';
import { CurRoutes } from 'src/app/app.routes';
import { insalesLogoMap, keeperLogoMap } from 'src/app/models/asstets-paths';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [DestroyService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatCardModule, MatIconModule, NgOptimizedImage, RouterLink],
})
export class HomeComponent implements OnInit {
  private readonly themeService = inject(ThemeService);
  private destroy$ = inject(DestroyService);
  private cdr = inject(ChangeDetectorRef);

  insalesLogo;
  rKeeperLogo;
  linkToSyncFAQ = `/${CurRoutes.SyncFAQ}`;

  ngOnInit(): void {
    this.themeService.theme$.pipe(takeUntil(this.destroy$)).subscribe(theme => {
      this.updateLogo(theme as Themes);
    });
  }

  private updateLogo(theme: Themes): void {
    const isDarkTheme = theme === Themes.Dark;
    this.insalesLogo = isDarkTheme ? insalesLogoMap[Themes.Dark] : insalesLogoMap[Themes.Light];
    this.rKeeperLogo = isDarkTheme ? keeperLogoMap[Themes.Dark] : keeperLogoMap[Themes.Light];

    this.cdr.detectChanges();
  }
}
