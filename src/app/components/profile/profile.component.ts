import {
  Component,
  inject,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Shop } from 'src/app/models/auth';
import { Store } from '@ngrx/store';
import { selectShop } from 'src/app/store/auth/auth.selectors';
import { takeUntil } from 'rxjs';
import { AuthService } from '@core/auth/auth.service';
import { DestroyService } from '@core/services/destroy.service';
import { LoadingBarService } from '@core/loading-bar/loading-bar.service';
import { InformerService } from '@core/services/informer.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
  ],
  providers: [DestroyService],
})
export class ProfileComponent implements OnInit {
  private store = inject(Store);
  private authSrv = inject(AuthService);
  private destroy = inject(DestroyService);
  private informer = inject(InformerService);
  private loadingBarSrv = inject(LoadingBarService);

  userForm = new FormGroup({
    email: new FormControl({ value: '', disabled: true }),
    role: new FormControl({ value: '', disabled: true }),
    shop_url: new FormControl({ value: '', disabled: true }),
  });

  isEditing: WritableSignal<boolean> = signal(false);

  private shop: Shop = null;

  ngOnInit(): void {
    this.store
      .select(selectShop)
      .pipe(takeUntil(this.destroy))
      .subscribe((shop) => {
        this.shop = shop || null;

        if (shop) {
          this.userForm.patchValue({
            email: shop.email,
            role: shop.role,
            shop_url: shop.shop_url,
          });
        }
      });
  }

  toggleEdit(): void {
    const editing = !this.isEditing();
    this.isEditing.set(editing);

    if (editing) {
      this.userForm.enable();
    } else {
      this.userForm.disable();
      this.saveChanges();
    }
  }

  saveChanges(): void {
    if (!this.userForm.invalid && this.shop) {
      const updatedShop = { ...this.shop, ...this.userForm.value };
      this.authSrv
        .updShop(updatedShop)
        .pipe(this.loadingBarSrv.withLoading(), takeUntil(this.destroy))
        .subscribe({
          next: () => {
            this.informer.success('Данные успешно изменены');
          },
          error: (err) => {
            this.informer.error(err);
          },
        });
    }
  }
}
