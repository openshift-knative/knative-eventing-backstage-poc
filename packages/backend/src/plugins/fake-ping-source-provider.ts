import {PingSources} from './fake-data';

import {
    ANNOTATION_LOCATION,
    ANNOTATION_ORIGIN_LOCATION,
    ComponentEntity,
    Entity,
} from '@backstage/catalog-model';

import {
    EntityProvider,
    EntityProviderConnection,
} from '@backstage/plugin-catalog-node';

import {Logger} from 'winston';

export class FakePingSourceProvider implements EntityProvider {
    private readonly env:string;
    // @ts-ignore
    private readonly logger:Logger;
    private connection?:EntityProviderConnection;

    /** [1] */
    constructor(env:string, logger:Logger) {
        this.env = env;
        this.logger = logger;
    }

    /** [2] */
    getProviderName():string {
        return `fake-ping-source-${this.env}`;
    }

    /** [3] */
    async connect(connection:EntityProviderConnection):Promise<void> {
        this.connection = connection;
    }

    /** [4] */
    async run():Promise<void> {
        if (!this.connection) {
            throw new Error('Not initialized');
        }

        const entities:Entity[] = [];

        /** [5] */
        for (const pingSource of PingSources.items) {
            const entity = this.buildPingSourceEntity(pingSource);
            entities.push(entity);
        }

        /** [6] */
        await this.connection.applyMutation({
            type: 'full',
            entities: entities.map(entity => ({
                entity,
                locationKey: `fake-ping-source-provider:${this.env}`,
            })),
        });
    }

    private buildPingSourceEntity(pingSource:any):ComponentEntity {
        // const location = `url:${this.baseUrl}/apiconfig/services/${service.service.id}`;

        // const spec = JSON.parse(apiDoc.api_doc.body);

        return {
            kind: 'Component',
            apiVersion: 'backstage.io/v1alpha1',
            metadata: {
                annotations: {
                    [ANNOTATION_LOCATION]: `url:tbd-kube-api-server`,
                    [ANNOTATION_ORIGIN_LOCATION]: "url:tbd-kube-api-server",
                    // "backstage.io/view-url": "https://console-openshift-console.apps.aliok-c117.serverless.devcluster.openshift.com/k8s/ns/${eventType.metadata.namespace}/eventing.knative.dev~v1beta1~EventType/${eventType.metadata.name}",
                    // "backstage.io/edit-url": "https://console-openshift-console.apps.aliok-c117.serverless.devcluster.openshift.com/k8s/ns/${eventType.metadata.namespace}/eventing.knative.dev~v1beta1~EventType/${eventType.metadata.name}",
                    ...pingSource.metadata.annotations
                },
                name: pingSource.metadata.name,
                namespace: pingSource.metadata.namespace,
                // description: pingSource.spec.description,
                // title: eventType.spec.type,
                labels: pingSource.metadata.labels || {},
                links: [
                    {
                        title: "View in OpenShift Console",
                        icon: "dashboard",
                        url: `https://console-openshift-console.apps.aliok-c117.serverless.devcluster.openshift.com/k8s/ns/${pingSource.metadata.namespace}/sources.knative.dev~v1~PingSource/${pingSource.metadata.name}`
                    }
                ],
            },
            spec: {
                type: 'eventSource',
                lifecycle: this.env,
                system: 'knative-event-mesh',
                owner: 'knative',
                providesApis: [
                    `api:${pingSource.status.ceAttributes[0].type}`
                ]
            },
            // relations: [
            //     {
            //         type: "providesApis",
            //         targetRef: `aliok-test:api:${pingSource.status.ceAttributes[0].type}`,
            //     }
            // ],
            // relations: [
            //     {
            //         type: "apiProvidedBy",
            //         targetRef: `aliok-test:broker:${eventType.spec.reference.namespace}/${eventType.spec.reference.name}`,
            //     }
            // ],
            // status: {
            //     items: [
            //         {
            //
            //         }
            //     ]
            // }
        };
    }
}
