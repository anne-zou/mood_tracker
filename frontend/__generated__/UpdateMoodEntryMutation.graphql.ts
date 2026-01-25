/**
 * @generated SignedSource<<065f2a5690446a92e754f4a733553c51>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type UpdateMoodEntryInput = {
  clientMutationId?: string | null | undefined;
  content?: string | null | undefined;
  id: string;
  time?: string | null | undefined;
};
export type UpdateMoodEntryMutation$variables = {
  input: UpdateMoodEntryInput;
};
export type UpdateMoodEntryMutation$data = {
  readonly updateMoodEntry: {
    readonly clientMutationId: string | null | undefined;
    readonly moodEntry: {
      readonly content: string;
      readonly id: string;
      readonly time: string;
      readonly updatedAt: string;
    };
  };
};
export type UpdateMoodEntryMutation = {
  response: UpdateMoodEntryMutation$data;
  variables: UpdateMoodEntryMutation$variables;
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
    "concreteType": "UpdateMoodEntryPayload",
    "kind": "LinkedField",
    "name": "updateMoodEntry",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "MoodEntry",
        "kind": "LinkedField",
        "name": "moodEntry",
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
            "name": "updatedAt",
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
    "name": "UpdateMoodEntryMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "UpdateMoodEntryMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "33128b0b0eb519e1130f6baf4e976c2a",
    "id": null,
    "metadata": {},
    "name": "UpdateMoodEntryMutation",
    "operationKind": "mutation",
    "text": "mutation UpdateMoodEntryMutation(\n  $input: UpdateMoodEntryInput!\n) {\n  updateMoodEntry(input: $input) {\n    moodEntry {\n      id\n      content\n      time\n      updatedAt\n    }\n    clientMutationId\n  }\n}\n"
  }
};
})();

(node as any).hash = "7e39eb9c4d0c80c60a5161fd4148a460";

export default node;
