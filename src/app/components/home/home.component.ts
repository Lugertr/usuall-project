import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal, WritableSignal} from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { User } from 'src/app/models/auth';
import { selectUser } from 'src/app/store/auth/auth.selectors';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [AsyncPipe]
})
export class HomeComponent {
  private store = inject(Store);

    user: WritableSignal<Observable<User>> = signal(
      this.store.select(selectUser)
    );
}
