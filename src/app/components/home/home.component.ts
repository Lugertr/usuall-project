import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal, WritableSignal} from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Shop } from 'src/app/models/auth';
import { selectShop } from 'src/app/store/auth/auth.selectors';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [AsyncPipe]
})
export class HomeComponent {
  private store = inject(Store);

    shop: WritableSignal<Observable<Shop>> = signal(
      this.store.select(selectShop)
    );
}
