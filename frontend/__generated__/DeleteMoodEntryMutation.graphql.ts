/**
 * @generated SignedSource<<12f1365d44f084641eaf1106d5ff6b08>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type DeleteMoodEntryInput = {
  clientMutationId?: string | null | undefined;
  id: string;
};
export type DeleteMoodEntryMutation$variables = {
  input: DeleteMoodEntryInput;
};
export type DeleteMoodEntryMutation$data = {
  readonly deleteMoodEntry: {
    readonly clientMutationId: string | null | undefined;
    readonly deletedId: string;
  };
};
export type DeleteMoodEntryMutation = {
  response: DeleteMoodEntryMutation$data;
  variables: DeleteMoodEntryMutation$variables;
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
    "concreteType": "DeleteMoodEntryPayload",
    "kind": "LinkedField",
    "name": "deleteMoodEntry",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "deletedId",
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
    "name": "DeleteMoodEntryMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "DeleteMoodEntryMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "d85a6350e4e68bc4164748277f1e7670",
    "id": null,
    "metadata": {},
    "name": "DeleteMoodEntryMutation",
    "operationKind": "mutation",
    "text": "mutation DeleteMoodEntryMutation(\n  $input: DeleteMoodEntryInput!\n) {\n  deleteMoodEntry(input: $input) {\n    deletedId\n    clientMutationId\n  }\n}\n"
  }
};
})();

(node as any).hash = "5f9458f7c3acdc2bdfbe8acfa4b1d16f";

export default node;
