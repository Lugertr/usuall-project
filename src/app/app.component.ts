import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  WritableSignal,
  ChangeDetectorRef,
  OnInit,
} from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterModule,
  RouterOutlet,
} from '@angular/router';
import { NavBarComponent } from './components/navbar/navbar.component';
import { LoadingBarComponent } from '@core/loading-bar/loading-bar.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { Store } from '@ngrx/store';
import { filter, map, Observable, take, takeUntil } from 'rxjs';
import { selectToken } from './store/auth/auth.selectors';
import { AuthService } from '@core/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { DestroyService } from '@core/services/destroy.service';
import { LoadingBarService } from '@core/loading-bar/loading-bar.service';
import { loadUser, setToken } from './store/auth/auth.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    RouterModule,
    MatCardModule,
    MatIconModule,
    MatListModule,
    LoadingBarComponent,
    NavBarComponent,
    RouterOutlet,
  ],
  providers: [DestroyService],
})
export class AppComponent implements OnInit {
  private readonly store = inject(Store<{ token: string }>);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly authSrv = inject(AuthService);
  private readonly loadingBarSrv = inject(LoadingBarService);
  private readonly destroy$ = inject(DestroyService);
  private readonly informer = inject(ToastrService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  isAuthenticated: WritableSignal<Observable<boolean>> = signal(
    this.store.select(selectToken).pipe(map((token) => !!token))
  );

  isShowingMenu = false;

  navLinks = [{ path: '/', label: 'Профиль' }];

  sideNavToggle(): void {
    this.isShowingMenu = !this.isShowingMenu;
    this.cdr.markForCheck();
  }

  ngOnInit(): void {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        take(1),
        this.loadingBarSrv.withLoading(),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        const token = this.route.snapshot.queryParams['token'];
        if (token) {
          this.store.dispatch(setToken({ token }));
          this.store.dispatch(loadUser());
        } else {
          this.router.navigate(['/auth']);
        }
      });
  }
}
