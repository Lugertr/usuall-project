import { Themes } from '@core/services/theme.service';

export const enum KeeperLogoPaths {
  Light = 'logo/keeper-logo-light.png',
  Dark = 'logo/keeper-logo-dark.png',
}

export const keeperLogoMap: Record<Themes, string> = {
  [Themes.Light]: KeeperLogoPaths.Light,
  [Themes.Dark]: KeeperLogoPaths.Dark,
};

export const enum DeliveryLogoPaths {
  Light = 'logo/delivery-logo-light.png',
  Dark = 'logo/delivery-logo-dark.png',
}

export const deliveryLogoMap: Record<Themes, string> = {
  [Themes.Light]: DeliveryLogoPaths.Light,
  [Themes.Dark]: DeliveryLogoPaths.Dark,
};

export const enum InsalesLogoPaths {
  Light = 'logo/insales_light.svg',
  Dark = 'logo/insales_dark.svg',
}

export const insalesLogoMap: Record<Themes, string> = {
  [Themes.Light]: InsalesLogoPaths.Light,
  [Themes.Dark]: InsalesLogoPaths.Dark,
};
