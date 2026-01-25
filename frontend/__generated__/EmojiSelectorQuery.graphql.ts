/**
 * @generated SignedSource<<80b1491b9b015d3d715340ca72067339>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type EmojiSelectorQuery$variables = Record<PropertyKey, never>;
export type EmojiSelectorQuery$data = {
  readonly emojiConfig: {
    readonly content: string;
    readonly id: string;
    readonly " $fragmentSpreads": FragmentRefs<"EmojiEditRow_emojiConfig" | "EmojiRow_emojiConfig">;
  } | null | undefined;
};
export type EmojiSelectorQuery = {
  response: EmojiSelectorQuery$data;
  variables: EmojiSelectorQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "content",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "EmojiSelectorQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "EmojiConfig",
        "kind": "LinkedField",
        "name": "emojiConfig",
        "plural": false,
        "selections": [
          (v0/*: any*/),
          (v1/*: any*/),
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "EmojiRow_emojiConfig"
          },
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "EmojiEditRow_emojiConfig"
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "EmojiSelectorQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "EmojiConfig",
        "kind": "LinkedField",
        "name": "emojiConfig",
        "plural": false,
        "selections": [
          (v0/*: any*/),
          (v1/*: any*/),
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
    ]
  },
  "params": {
    "cacheID": "1ffdbbb3599d4e8eb340762018e0bd39",
    "id": null,
    "metadata": {},
    "name": "EmojiSelectorQuery",
    "operationKind": "query",
    "text": "query EmojiSelectorQuery {\n  emojiConfig {\n    id\n    content\n    ...EmojiRow_emojiConfig\n    ...EmojiEditRow_emojiConfig\n  }\n}\n\nfragment EmojiEditRow_emojiConfig on EmojiConfig {\n  id\n  userId\n  content\n  createdAt\n  updatedAt\n}\n\nfragment EmojiRow_emojiConfig on EmojiConfig {\n  id\n  content\n}\n"
  }
};
})();

(node as any).hash = "7a2515bed1c3b8430bb9b0853891e3b9";

export default node;
