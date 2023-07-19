import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import { aliokTest01Plugin, AliokTest01Page } from '../src/plugin';

createDevApp()
  .registerPlugin(aliokTest01Plugin)
  .addPage({
    element: <AliokTest01Page />,
    title: 'Root Page',
    path: '/aliok-test-01'
  })
  .render();
