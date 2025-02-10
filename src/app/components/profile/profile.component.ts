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
import { Observable } from 'rxjs';
import { loadUserSuccess } from 'src/app/store/auth/auth.actions';

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
})
export class ProfileComponent implements OnInit {
  private store = inject(Store);

  user: Signal<User> = computed(() => {
    let userData: User | null = null;
    this.store.select(selectUser).subscribe(user => userData = user);
    return userData;
  });

  userForm = new FormGroup({
    email: new FormControl({ value: '', disabled: true }),
    role: new FormControl({ value: '', disabled: true }),
    shop_url: new FormControl({ value: '', disabled: true }),
  });

  isEditing: WritableSignal<boolean> = signal(false);

  ngOnInit(): void {
    this.store.select(selectUser).subscribe(user => {
      if (user) {
        this.userForm.patchValue({
          email: user.email,
          role: user.role,
          shop_url: user.shop_url
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
      this.store.dispatch(loadUserSuccess({ user: updatedUser }));
      console.log('Данные сохранены:', updatedUser);
    }
  }
}
