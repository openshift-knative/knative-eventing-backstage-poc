import {UrlReader} from '@backstage/backend-common';
import {EventTypes} from './fake-data';

import {
    ANNOTATION_LOCATION,
    ANNOTATION_ORIGIN_LOCATION,
    ApiEntity,
    Entity,
} from '@backstage/catalog-model';

import {
    EntityProvider,
    EntityProviderConnection,
} from '@backstage/plugin-catalog-node';

import {Logger} from 'winston';

/**
 * Provides entities from fictional frobs service.
 */
export class FrobsProvider implements EntityProvider {
    private readonly env:string;
    private readonly reader:UrlReader;
    private readonly logger:Logger;
    private connection?:EntityProviderConnection;

    /** [1] */
    constructor(env:string, reader:UrlReader, logger:Logger) {
        this.env = env;
        this.reader = reader;
        this.logger = logger;
    }

    /** [2] */
    getProviderName():string {
        return `frobs-${this.env}`;
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

        // const response = await this.reader.readUrl(
        //     `https://frobs-${this.env}.example.com/data`,
        // );
        // const data = JSON.parse(await response.buffer()).toString();

        this.logger.info("Hello world!");

        const entities:Entity[] = [];

        /** [5] */
            for (const eventType of EventTypes.items) {
                const entity = this.buildEventTypeEntity(eventType);
                entities.push(entity);
            }

        /** [6] */
        await this.connection.applyMutation({
            type: 'full',
            entities: entities.map(entity => ({
                entity,
                locationKey: `frobs-provider:${this.env}`,
            })),
        });
    }

    private buildEventTypeEntity(eventType):ApiEntity {
        // const location = `url:${this.baseUrl}/apiconfig/services/${service.service.id}`;

        // const spec = JSON.parse(apiDoc.api_doc.body);

        return {
            kind: 'API',
            apiVersion: 'backstage.io/v1alpha1',
            metadata: {
                annotations: {
                    [ANNOTATION_LOCATION]: `url:tbd-kube-api-server`,
                    [ANNOTATION_ORIGIN_LOCATION]: "url:tbd-kube-api-server",
                    // "backstage.io/view-url": "https://console-openshift-console.apps.aliok-c117.serverless.devcluster.openshift.com/k8s/ns/${eventType.metadata.namespace}/eventing.knative.dev~v1beta1~EventType/${eventType.metadata.name}",
                    // "backstage.io/edit-url": "https://console-openshift-console.apps.aliok-c117.serverless.devcluster.openshift.com/k8s/ns/${eventType.metadata.namespace}/eventing.knative.dev~v1beta1~EventType/${eventType.metadata.name}",
                    ...eventType.metadata.annotations
                },
                name: eventType.metadata.name,
                namespace: eventType.metadata.namespace,
                description: eventType.spec.description,
                title: eventType.spec.type,
                labels: eventType.metadata.labels || {},
                links: [
                    {
                        title: "View in OpenShift Console",
                        icon: "dashboard",
                        url: `https://console-openshift-console.apps.aliok-c117.serverless.devcluster.openshift.com/k8s/ns/${eventType.metadata.namespace}/eventing.knative.dev~v1beta1~EventType/${eventType.metadata.name}`
                    }
                ],
            },
            spec: {
                type: 'eventType',
                lifecycle: this.env,
                system: 'aliok-test',
                owner: 'aliok-test',
                definition: eventType.spec.schemaData || "{}",
            },
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
