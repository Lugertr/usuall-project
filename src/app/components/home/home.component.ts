import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { CurRoutes } from 'src/app/app.routes';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatCardModule, MatIconModule, NgOptimizedImage, RouterLink],
})
export class HomeComponent {
  insalesLogo = 'logo/insales.svg';
  rKeeperLogo = 'logo/keeper-logo-light.png';
  linkToSyncFAQ = `/${CurRoutes.SyncFAQ}`;
}
