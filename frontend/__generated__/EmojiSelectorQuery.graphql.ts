/**
 * @generated SignedSource<<1e325a8e990b31c78b0c63e4235cf38b>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type EmojiSelectorQuery$variables = Record<PropertyKey, never>;
export type EmojiSelectorQuery$data = {
  readonly emojiConfig: {
    readonly content: string;
    readonly createdAt: string;
    readonly id: string;
    readonly updatedAt: string;
    readonly userId: string;
  } | null | undefined;
};
export type EmojiSelectorQuery = {
  response: EmojiSelectorQuery$data;
  variables: EmojiSelectorQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
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
  }
];
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "EmojiSelectorQuery",
    "selections": (v0/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "EmojiSelectorQuery",
    "selections": (v0/*: any*/)
  },
  "params": {
    "cacheID": "48d786482a92b81e0b5e18470863c138",
    "id": null,
    "metadata": {},
    "name": "EmojiSelectorQuery",
    "operationKind": "query",
    "text": "query EmojiSelectorQuery {\n  emojiConfig {\n    id\n    userId\n    content\n    createdAt\n    updatedAt\n  }\n}\n"
  }
};
})();

(node as any).hash = "155b925baf3520e96230e9520e0028ab";

export default node;
