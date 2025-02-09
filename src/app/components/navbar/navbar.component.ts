import { ChangeDetectionStrategy, Component, inject, Input, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AuthService } from '@core/auth/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatToolbarModule
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavBarComponent {
  @Input() menuToggleSignal = signal(() => {});
  authService = inject(AuthService);

  logout(username: string): void {
    this.authService.logout(username);
  }

  callMenuTrigger(): void {
    this.menuToggleSignal()();
  }
}
