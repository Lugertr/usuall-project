import {
  Component,
  computed,
  inject,
  OnInit,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { User } from 'src/app/models/auth';
import { Store } from '@ngrx/store';
import { selectUser } from 'src/app/store/auth/auth.selectors';
import { takeUntil } from 'rxjs';
import { AuthService } from '@core/auth/auth.service';
import { DestroyService } from '@core/services/destroy.service';
import { ToastrService } from 'ngx-toastr';
import { LoadingBarService } from '@core/loading-bar/loading-bar.service';

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
  private informer = inject(ToastrService);
  private loadingBarSrv = inject(LoadingBarService);

  user: Signal<User> = computed(() => {
    let userData: User | null = null;
    this.store.select(selectUser).subscribe((user) => (userData = user));
    return userData;
  });

  userForm = new FormGroup({
    email: new FormControl({ value: '', disabled: true }),
    role: new FormControl({ value: '', disabled: true }),
    shop_url: new FormControl({ value: '', disabled: true }),
  });

  isEditing: WritableSignal<boolean> = signal(false);

  ngOnInit(): void {
    this.store
      .select(selectUser)
      .pipe(takeUntil(this.destroy))
      .subscribe((user) => {
        if (user) {
          this.userForm.patchValue({
            email: user.email,
            role: user.role,
            shop_url: user.shop_url,
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
    if (!this.userForm.invalid && this.user()) {
      const updatedUser = { ...this.user(), ...this.userForm.value };
      this.authSrv
        .updUser(updatedUser)
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
