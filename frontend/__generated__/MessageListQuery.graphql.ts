/**
 * @generated SignedSource<<e101df989bc544fb517c2540390d6ccb>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type MessageListQuery$variables = {
  first: number;
};
export type MessageListQuery$data = {
  readonly " $fragmentSpreads": FragmentRefs<"MessageList_moodEntries">;
};
export type MessageListQuery = {
  response: MessageListQuery$data;
  variables: MessageListQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "first"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "first",
    "variableName": "first"
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "MessageListQuery",
    "selections": [
      {
        "args": (v1/*: any*/),
        "kind": "FragmentSpread",
        "name": "MessageList_moodEntries"
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "MessageListQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "MoodEntryConnection",
        "kind": "LinkedField",
        "name": "moodEntries",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "MoodEntryEdge",
            "kind": "LinkedField",
            "name": "edges",
            "plural": true,
            "selections": [
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
                    "name": "__typename",
                    "storageKey": null
                  }
                ],
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "cursor",
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "PageInfo",
            "kind": "LinkedField",
            "name": "pageInfo",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "hasNextPage",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "endCursor",
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
        "args": (v1/*: any*/),
        "filters": null,
        "handle": "connection",
        "key": "MessageList_moodEntries",
        "kind": "LinkedHandle",
        "name": "moodEntries"
      }
    ]
  },
  "params": {
    "cacheID": "a5e93cb807b24de2e47c581835004c77",
    "id": null,
    "metadata": {},
    "name": "MessageListQuery",
    "operationKind": "query",
    "text": "query MessageListQuery(\n  $first: Int!\n) {\n  ...MessageList_moodEntries_3ASum4\n}\n\nfragment MessageBubble_entry on MoodEntry {\n  id\n  content\n}\n\nfragment MessageList_moodEntries_3ASum4 on Query {\n  moodEntries(first: $first) {\n    edges {\n      node {\n        id\n        content\n        time\n        ...MessageRow_entry\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      hasNextPage\n      endCursor\n    }\n  }\n}\n\nfragment MessageMetadata_entry on MoodEntry {\n  id\n  time\n  content\n}\n\nfragment MessageRow_entry on MoodEntry {\n  id\n  ...MessageBubble_entry\n  ...MessageMetadata_entry\n}\n"
  }
};
})();

(node as any).hash = "3ab8b91e8ae380d88e66a36301e9429f";

export default node;
