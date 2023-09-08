import { CatalogBuilder } from '@backstage/plugin-catalog-backend';
import { ScaffolderEntitiesProcessor } from '@backstage/plugin-scaffolder-backend';
import { Router } from 'express';
import { PluginEnvironment } from '../types';
import { FakeEventTypeProvider } from './fake-event-type-provider';
import { FakePingSourceProvider } from './fake-ping-source-provider';
import { FakeApiServerSourceProvider } from './fake-api-server-source-provider';
import { ThreeScaleApiEntityProvider } from '@janus-idp/backstage-plugin-3scale-backend';


export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  const builder = await CatalogBuilder.create(env);

  const fakeEventTypeProvider = new FakeEventTypeProvider('production', env.logger);
  builder.addEntityProvider(fakeEventTypeProvider);

  const fakePingSourceProvider = new FakePingSourceProvider('production', env.logger);
  builder.addEntityProvider(fakePingSourceProvider);

    const fakeApiServerSource = new FakeApiServerSourceProvider('production', env.logger);
    builder.addEntityProvider(fakeApiServerSource);


  builder.addEntityProvider(ThreeScaleApiEntityProvider.fromConfig(env.config, {
      logger: env.logger,
      scheduler: env.scheduler,
    }));

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

  await env.scheduler.scheduleTask({
      id: 'run_fake_ping_source_refresh',
      fn: async () => {
          await fakePingSourceProvider.run();
      },
      frequency: { minutes: 30 },
      timeout: { minutes: 10 },
  });

    await env.scheduler.scheduleTask({
        id: 'run_api_server_source_refresh',
        fn: async () => {
            await fakeApiServerSource.run();
        },
        frequency: { minutes: 30 },
        timeout: { minutes: 10 },
    });

  return router;
}
