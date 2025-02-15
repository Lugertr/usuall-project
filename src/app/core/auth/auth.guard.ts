import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, first } from 'rxjs/operators';
import { CurRoutes } from 'src/app/app.routes';
import { selectShopToken } from 'src/app/store/auth/auth.selectors';

export const authGuard: CanActivateFn = () => {
  const store = inject(Store);
  const router = inject(Router);

  return store.select(selectShopToken).pipe(
    map((shopToken) => {
      if (!shopToken) {
        router.navigate([CurRoutes.Auth]);
        return false;
      }
      return true;
    })
  );
};
