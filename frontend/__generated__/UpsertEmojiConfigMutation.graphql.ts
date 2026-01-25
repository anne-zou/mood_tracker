/**
 * @generated SignedSource<<8f1101eb9b97fdda5ea5efa59a947060>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type UpsertEmojiConfigInput = {
  clientMutationId?: string | null | undefined;
  content: string;
};
export type UpsertEmojiConfigMutation$variables = {
  input: UpsertEmojiConfigInput;
};
export type UpsertEmojiConfigMutation$data = {
  readonly upsertEmojiConfig: {
    readonly clientMutationId: string | null | undefined;
    readonly emojiConfig: {
      readonly content: string;
      readonly createdAt: string;
      readonly id: string;
      readonly updatedAt: string;
      readonly userId: string;
    };
  };
};
export type UpsertEmojiConfigMutation = {
  response: UpsertEmojiConfigMutation$data;
  variables: UpsertEmojiConfigMutation$variables;
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
    "concreteType": "UpsertEmojiConfigPayload",
    "kind": "LinkedField",
    "name": "upsertEmojiConfig",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "EmojiConfig",
        "kind": "LinkedField",
        "name": "emojiConfig",
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
            "name": "userId",
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
    "name": "UpsertEmojiConfigMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "UpsertEmojiConfigMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "8bc23d9ee5b1adb76cd1fd18b608b8be",
    "id": null,
    "metadata": {},
    "name": "UpsertEmojiConfigMutation",
    "operationKind": "mutation",
    "text": "mutation UpsertEmojiConfigMutation(\n  $input: UpsertEmojiConfigInput!\n) {\n  upsertEmojiConfig(input: $input) {\n    emojiConfig {\n      id\n      userId\n      content\n      createdAt\n      updatedAt\n    }\n    clientMutationId\n  }\n}\n"
  }
};
})();

(node as any).hash = "f3bbac0e64f155c22986ed300396bd73";

export default node;
