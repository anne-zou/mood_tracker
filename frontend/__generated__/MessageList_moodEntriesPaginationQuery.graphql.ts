/**
 * @generated SignedSource<<2acdf8142172d63ee4fb0580a6eddf7d>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type MessageList_moodEntriesPaginationQuery$variables = {
  after?: string | null | undefined;
  first?: number | null | undefined;
};
export type MessageList_moodEntriesPaginationQuery$data = {
  readonly " $fragmentSpreads": FragmentRefs<"MessageList_moodEntries">;
};
export type MessageList_moodEntriesPaginationQuery = {
  response: MessageList_moodEntriesPaginationQuery$data;
  variables: MessageList_moodEntriesPaginationQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "after"
  },
  {
    "defaultValue": 50,
    "kind": "LocalArgument",
    "name": "first"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "after",
    "variableName": "after"
  },
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
    "name": "MessageList_moodEntriesPaginationQuery",
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
    "name": "MessageList_moodEntriesPaginationQuery",
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
    "cacheID": "4cadef40e47d83ed84013f0521539346",
    "id": null,
    "metadata": {},
    "name": "MessageList_moodEntriesPaginationQuery",
    "operationKind": "query",
    "text": "query MessageList_moodEntriesPaginationQuery(\n  $after: String\n  $first: Int = 50\n) {\n  ...MessageList_moodEntries_2HEEH6\n}\n\nfragment MessageBubble_entry on MoodEntry {\n  id\n  content\n}\n\nfragment MessageList_moodEntries_2HEEH6 on Query {\n  moodEntries(first: $first, after: $after) {\n    edges {\n      node {\n        id\n        content\n        time\n        ...MessageRow_entry\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      hasNextPage\n      endCursor\n    }\n  }\n}\n\nfragment MessageMetadata_entry on MoodEntry {\n  id\n  time\n  content\n}\n\nfragment MessageRow_entry on MoodEntry {\n  id\n  ...MessageBubble_entry\n  ...MessageMetadata_entry\n}\n"
  }
};
})();

(node as any).hash = "77909e03c13de014a91dcaf73e3bc03a";

export default node;
