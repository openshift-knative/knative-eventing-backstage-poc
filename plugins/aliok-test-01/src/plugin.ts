import { createPlugin, createRoutableExtension } from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';

export const aliokTest01Plugin = createPlugin({
  id: 'aliok-test-01',
  routes: {
    root: rootRouteRef,
  },
});

export const AliokTest01Page = aliokTest01Plugin.provide(
  createRoutableExtension({
    name: 'AliokTest01Page',
    component: () =>
      import('./components/ExampleComponent').then(m => m.ExampleComponent),
    mountPoint: rootRouteRef,
  }),
);
