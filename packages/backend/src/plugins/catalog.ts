import { CatalogBuilder } from '@backstage/plugin-catalog-backend';
import { ScaffolderEntitiesProcessor } from '@backstage/plugin-scaffolder-backend';
import { Router } from 'express';
import { PluginEnvironment } from '../types';
import { FrobsProvider } from './fake-event-type-provider';
import { ThreeScaleApiEntityProvider } from '@janus-idp/backstage-plugin-3scale-backend';


export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  const builder = await CatalogBuilder.create(env);

  const frobs = new FrobsProvider('production', env.reader, env.logger);
  builder.addEntityProvider(frobs);

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

  await env.scheduler.scheduleTask({
      id: 'run_frobs_refresh',
      fn: async () => {
          await frobs.run();
      },
      frequency: { minutes: 30 },
      timeout: { minutes: 10 },
  });

  return router;
}
