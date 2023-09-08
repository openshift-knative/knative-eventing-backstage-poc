import { CatalogBuilder } from '@backstage/plugin-catalog-backend';
import { ScaffolderEntitiesProcessor } from '@backstage/plugin-scaffolder-backend';
import { Router } from 'express';
import { PluginEnvironment } from '../types';
import { ThreeScaleApiEntityProvider } from '@janus-idp/backstage-plugin-3scale-backend';


export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  const builder = await CatalogBuilder.create(env);


  const three = ThreeScaleApiEntityProvider.fromConfig(env.config, {
          logger: env.logger,
          scheduler: env.scheduler,
      });

  builder.addEntityProvider(
      three
  );

  builder.addProcessor(new ScaffolderEntitiesProcessor());
  const { processingEngine, router } = await builder.build();
  await processingEngine.start();


  return router;
}
