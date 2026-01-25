/**
 * @generated SignedSource<<d49f674f01b33086bb49d46fd55f1738>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type home_moodEntriesPaginationQuery$variables = {
  after?: string | null | undefined;
  first?: number | null | undefined;
};
export type home_moodEntriesPaginationQuery$data = {
  readonly " $fragmentSpreads": FragmentRefs<"home_moodEntries">;
};
export type home_moodEntriesPaginationQuery = {
  response: home_moodEntriesPaginationQuery$data;
  variables: home_moodEntriesPaginationQuery$variables;
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
    "name": "home_moodEntriesPaginationQuery",
    "selections": [
      {
        "args": (v1/*: any*/),
        "kind": "FragmentSpread",
        "name": "home_moodEntries"
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "home_moodEntriesPaginationQuery",
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
        "key": "home_moodEntries",
        "kind": "LinkedHandle",
        "name": "moodEntries"
      }
    ]
  },
  "params": {
    "cacheID": "9e433613872bcaf284daba901df08429",
    "id": null,
    "metadata": {},
    "name": "home_moodEntriesPaginationQuery",
    "operationKind": "query",
    "text": "query home_moodEntriesPaginationQuery(\n  $after: String\n  $first: Int = 50\n) {\n  ...home_moodEntries_2HEEH6\n}\n\nfragment MessageBubble_entry on MoodEntry {\n  id\n  content\n}\n\nfragment MessageMetadata_entry on MoodEntry {\n  id\n  time\n}\n\nfragment MessageRow_entry on MoodEntry {\n  id\n  ...MessageBubble_entry\n  ...MessageMetadata_entry\n}\n\nfragment home_moodEntries_2HEEH6 on Query {\n  moodEntries(first: $first, after: $after) {\n    edges {\n      node {\n        id\n        content\n        time\n        ...MessageRow_entry\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      hasNextPage\n      endCursor\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "d2609a4407d421be942ac5a9ecb22834";

export default node;
