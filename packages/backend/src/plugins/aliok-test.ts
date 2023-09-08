import {UrlReader} from '@backstage/backend-common';

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

const EventTypes = {
    "apiVersion": "v1",
    "items": [
        {
            "apiVersion": "eventing.knative.dev/v1beta2",
            "kind": "EventType",
            "metadata": {
                "annotations": {
                    "eventing.knative.dev/creator": "system:serviceaccount:knative-eventing:eventing-controller",
                    "eventing.knative.dev/lastModifier": "system:serviceaccount:knative-eventing:eventing-controller"
                },
                "creationTimestamp": "2023-09-07T12:30:12Z",
                "generation": 1,
                "labels": {
                    "eventing.knative.dev/sourceName": "test-api-server-source"
                },
                "name": "71fb09d5437a438332eac803e9e8b137",
                "namespace": "default",
                "ownerReferences": [
                    {
                        "apiVersion": "sources.knative.dev/v1",
                        "blockOwnerDeletion": true,
                        "controller": true,
                        "kind": "ApiServerSource",
                        "name": "test-api-server-source",
                        "uid": "cef25d22-37fa-4caa-ac04-7f604bfd7683"
                    }
                ],
                "resourceVersion": "185018",
                "uid": "022bec1f-bc78-4ade-a28e-168ebd77b331"
            },
            "spec": {
                "reference": {
                    "apiVersion": "eventing.knative.dev/v1",
                    "kind": "Broker",
                    "name": "default",
                    "namespace": "default"
                },
                "source": "https://172.30.0.1:443",
                "type": "dev.knative.apiserver.resource.update"
            },
            "status": {
                "conditions": [
                    {
                        "lastTransitionTime": "2023-09-07T12:30:12Z",
                        "status": "True",
                        "type": "Ready"
                    },
                    {
                        "lastTransitionTime": "2023-09-07T12:30:12Z",
                        "status": "True",
                        "type": "ReferenceExists"
                    }
                ],
                "observedGeneration": 1
            }
        },
        {
            "apiVersion": "eventing.knative.dev/v1beta2",
            "kind": "EventType",
            "metadata": {
                "annotations": {
                    "eventing.knative.dev/creator": "system:serviceaccount:knative-eventing:eventing-controller",
                    "eventing.knative.dev/lastModifier": "system:serviceaccount:knative-eventing:eventing-controller"
                },
                "creationTimestamp": "2023-09-07T12:30:12Z",
                "generation": 1,
                "labels": {
                    "eventing.knative.dev/sourceName": "test-ping-source"
                },
                "name": "e73c53b7d89bb417e7b064b3345741f7",
                "namespace": "default",
                "ownerReferences": [
                    {
                        "apiVersion": "sources.knative.dev/v1",
                        "blockOwnerDeletion": true,
                        "controller": true,
                        "kind": "PingSource",
                        "name": "test-ping-source",
                        "uid": "87af4d7d-5dbd-4eb2-8476-6ee81e92c100"
                    }
                ],
                "resourceVersion": "185024",
                "uid": "3a79c386-5219-499a-abb2-f90ee4820aa2"
            },
            "spec": {
                "reference": {
                    "apiVersion": "eventing.knative.dev/v1",
                    "kind": "Broker",
                    "name": "default",
                    "namespace": "default"
                },
                "source": "/apis/v1/namespaces/default/pingsources/test-ping-source",
                "type": "dev.knative.sources.ping"
            },
            "status": {}
        },
        {
            "apiVersion": "eventing.knative.dev/v1beta2",
            "kind": "EventType",
            "metadata": {
                "annotations": {
                    "eventing.knative.dev/creator": "system:serviceaccount:knative-eventing:eventing-controller",
                    "eventing.knative.dev/lastModifier": "system:serviceaccount:knative-eventing:eventing-controller"
                },
                "creationTimestamp": "2023-09-07T12:30:12Z",
                "generation": 1,
                "labels": {
                    "eventing.knative.dev/sourceName": "test-api-server-source"
                },
                "name": "e84a3f7baf42509597c8af3cfa8c9006",
                "namespace": "default",
                "ownerReferences": [
                    {
                        "apiVersion": "sources.knative.dev/v1",
                        "blockOwnerDeletion": true,
                        "controller": true,
                        "kind": "ApiServerSource",
                        "name": "test-api-server-source",
                        "uid": "cef25d22-37fa-4caa-ac04-7f604bfd7683"
                    }
                ],
                "resourceVersion": "185028",
                "uid": "331cc57b-2b0a-4e5b-a35c-0380c5684f21"
            },
            "spec": {
                "reference": {
                    "apiVersion": "eventing.knative.dev/v1",
                    "kind": "Broker",
                    "name": "default",
                    "namespace": "default"
                },
                "source": "https://172.30.0.1:443",
                "type": "dev.knative.apiserver.resource.add"
            },
            "status": {
                "conditions": [
                    {
                        "lastTransitionTime": "2023-09-07T12:30:12Z",
                        "status": "True",
                        "type": "Ready"
                    },
                    {
                        "lastTransitionTime": "2023-09-07T12:30:12Z",
                        "status": "True",
                        "type": "ReferenceExists"
                    }
                ],
                "observedGeneration": 1
            }
        },
        {
            "apiVersion": "eventing.knative.dev/v1beta2",
            "kind": "EventType",
            "metadata": {
                "annotations": {
                    "eventing.knative.dev/creator": "system:serviceaccount:knative-eventing:eventing-controller",
                    "eventing.knative.dev/lastModifier": "system:serviceaccount:knative-eventing:eventing-controller"
                },
                "creationTimestamp": "2023-09-07T12:30:12Z",
                "generation": 1,
                "labels": {
                    "eventing.knative.dev/sourceName": "test-api-server-source"
                },
                "name": "e8cd1b928879427aa2954f2ce1c2813f",
                "namespace": "default",
                "ownerReferences": [
                    {
                        "apiVersion": "sources.knative.dev/v1",
                        "blockOwnerDeletion": true,
                        "controller": true,
                        "kind": "ApiServerSource",
                        "name": "test-api-server-source",
                        "uid": "cef25d22-37fa-4caa-ac04-7f604bfd7683"
                    }
                ],
                "resourceVersion": "185025",
                "uid": "fedf1c86-b5d0-4b4d-9e75-813cf590e3e6"
            },
            "spec": {
                "reference": {
                    "apiVersion": "eventing.knative.dev/v1",
                    "kind": "Broker",
                    "name": "default",
                    "namespace": "default"
                },
                "source": "https://172.30.0.1:443",
                "type": "dev.knative.apiserver.resource.delete"
            },
            "status": {}
        },
        {
            "apiVersion": "eventing.knative.dev/v1beta2",
            "kind": "EventType",
            "metadata": {
                "annotations": {
                    "eventing.knative.dev/creator": "system:serviceaccount:knative-eventing:mt-broker-ingress",
                    "eventing.knative.dev/lastModifier": "system:serviceaccount:knative-eventing:mt-broker-ingress"
                },
                "creationTimestamp": "2023-09-07T12:23:00Z",
                "generation": 1,
                "name": "et-default-zgv2lmtuyx",
                "namespace": "default",
                "ownerReferences": [
                    {
                        "apiVersion": "eventing.knative.dev/v1",
                        "kind": "Broker",
                        "name": "default",
                        "uid": "f31a4c57-d1e3-4ada-851e-3a6c2c15c478"
                    }
                ],
                "resourceVersion": "160365",
                "uid": "a3282258-d9e3-44de-b447-5c4ac061b423"
            },
            "spec": {
                "description": "Event Type auto-created by controller",
                "reference": {
                    "apiVersion": "eventing.knative.dev/v1",
                    "kind": "Broker",
                    "name": "default",
                    "namespace": "default"
                },
                "source": "/apis/v1/namespaces/default/pingsources/test-ping-source",
                "type": "dev.knative.sources.ping"
            },
            "status": {
                "conditions": [
                    {
                        "lastTransitionTime": "2023-09-07T12:23:00Z",
                        "status": "True",
                        "type": "Ready"
                    },
                    {
                        "lastTransitionTime": "2023-09-07T12:23:00Z",
                        "status": "True",
                        "type": "ReferenceExists"
                    }
                ],
                "observedGeneration": 1
            }
        }
    ],
    "kind": "List",
    "metadata": {
        "resourceVersion": ""
    }
};
