import { CatalogBuilder } from '@backstage/plugin-catalog-backend';
import { ScaffolderEntitiesProcessor } from '@backstage/plugin-scaffolder-backend';
import { Router } from 'express';
import { PluginEnvironment } from '../types';
import { FakeEventTypeProvider } from './fake-event-type-provider';
import { ThreeScaleApiEntityProvider } from '@janus-idp/backstage-plugin-3scale-backend';


export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  const builder = await CatalogBuilder.create(env);

  const fakeEventTypeProvider = new FakeEventTypeProvider('production', env.logger);
  builder.addEntityProvider(fakeEventTypeProvider);

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
      id: 'run_fake_event_type_refresh',
      fn: async () => {
          await fakeEventTypeProvider.run();
      },
      frequency: { minutes: 30 },
      timeout: { minutes: 10 },
  });

  return router;
}
