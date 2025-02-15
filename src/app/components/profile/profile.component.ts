import { Component, inject, signal, WritableSignal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ExportType, LoginDelivery, LoginWSA, Shop } from 'src/app/models/auth';
import { Store } from '@ngrx/store';
import { selectShop } from 'src/app/store/auth/auth.selectors';
import { Observable } from 'rxjs';
import { DestroyService } from '@core/services/destroy.service';
import { MatDividerModule } from '@angular/material/divider';
import { Router } from '@angular/router';
import { CurRoutes } from 'src/app/app.routes';
import { MatIconModule } from '@angular/material/icon';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  imports: [
    AsyncPipe,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDividerModule,
  ],
  providers: [DestroyService],
})
export class ProfileComponent {
  private store = inject(Store);
  private router = inject(Router);

  isEditing: WritableSignal<boolean> = signal(false);
  exportType = ExportType;

  shop: WritableSignal<Observable<Shop>> = signal(
    this.store.select(selectShop)
  );

  editProfile(): void {
    this.router.navigate([CurRoutes.Auth], { state: { isEdit: true } });
  }

  booleanToText(value: boolean): string {
    return value ? 'Да' : 'Нет';
  }

  clientInfo(shop: Shop): { login: string; password: string } {
    switch (shop.export_type) {
      case this.exportType.Delivery:
        const userVal = shop.params as LoginDelivery;
        return { login: userVal.client_id, password: userVal.client_secret };
      case this.exportType.WSA:
        const user = shop.params as LoginWSA;
        return { login: user.object_id, password: user.wsa_token };
    }
  }
}
