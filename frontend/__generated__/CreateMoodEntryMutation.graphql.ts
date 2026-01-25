/**
 * @generated SignedSource<<f63d8cc3d13f8c97b23838016309e061>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type CreateMoodEntryInput = {
  clientMutationId?: string | null | undefined;
  content: string;
  time: string;
};
export type CreateMoodEntryMutation$variables = {
  input: CreateMoodEntryInput;
};
export type CreateMoodEntryMutation$data = {
  readonly createMoodEntry: {
    readonly clientMutationId: string | null | undefined;
    readonly moodEntryEdge: {
      readonly cursor: string;
      readonly node: {
        readonly content: string;
        readonly createdAt: string;
        readonly id: string;
        readonly time: string;
        readonly updatedAt: string;
      };
    };
  };
};
export type CreateMoodEntryMutation = {
  response: CreateMoodEntryMutation$data;
  variables: CreateMoodEntryMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "input"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "input",
        "variableName": "input"
      }
    ],
    "concreteType": "CreateMoodEntryPayload",
    "kind": "LinkedField",
    "name": "createMoodEntry",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "MoodEntryEdge",
        "kind": "LinkedField",
        "name": "moodEntryEdge",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "cursor",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "MoodEntry",
            "kind": "LinkedField",
            "name": "node",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "id",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "content",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "time",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "createdAt",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "updatedAt",
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "clientMutationId",
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "CreateMoodEntryMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "CreateMoodEntryMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "f1564c704ec45a0c86d61d9d4b78d4e6",
    "id": null,
    "metadata": {},
    "name": "CreateMoodEntryMutation",
    "operationKind": "mutation",
    "text": "mutation CreateMoodEntryMutation(\n  $input: CreateMoodEntryInput!\n) {\n  createMoodEntry(input: $input) {\n    moodEntryEdge {\n      cursor\n      node {\n        id\n        content\n        time\n        createdAt\n        updatedAt\n      }\n    }\n    clientMutationId\n  }\n}\n"
  }
};
})();

(node as any).hash = "5a50bad7cbaab97cf7ba43f9e0bff6c7";

export default node;
