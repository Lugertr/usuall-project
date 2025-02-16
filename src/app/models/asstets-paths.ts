import { Themes } from '@core/services/theme.service';

export const enum KeeperLogoPaths {
  Light = 'assets/logo-light.svg',
  Dark = 'assets/logo-dark.svg',
}

export const KeeperLogoMap: Record<Themes, string> = {
  [Themes.Light]: KeeperLogoPaths.Light,
  [Themes.Dark]: KeeperLogoPaths.Dark,
};

export const enum DeliveryLogoPaths {
  Light = 'assets/logo-light.svg',
  Dark = 'assets/logo-dark.svg',
}

export const DeliveryLogoMap: Record<Themes, string> = {
  [Themes.Light]: DeliveryLogoPaths.Light,
  [Themes.Dark]: DeliveryLogoPaths.Dark,
};
