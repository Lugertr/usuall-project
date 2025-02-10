import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, first } from 'rxjs/operators';
import { selectToken } from 'src/app/store/auth/auth.selectors';

export const authGuard: CanActivateFn = () => {
  const store = inject(Store);
  const router = inject(Router);

  return store.select(selectToken).pipe(
    first(),
    map(token => {
      if (!token) {
        router.navigate(['/auth']);
        return false;
      }
      return true;
    })
  );
};
