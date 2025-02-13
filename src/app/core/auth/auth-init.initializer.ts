import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { setShopToken, loadShop } from 'src/app/store/auth/auth.actions';

export const AuthInit = (): void => {
  const store = inject(Store<{ shopToken: string }>);

  const url = new URL(window.location.href);
  const shopToken = url.searchParams.get('token');
  if (shopToken) {
    store.dispatch(setShopToken({ shopToken }));
    store.dispatch(loadShop());
  }
};
