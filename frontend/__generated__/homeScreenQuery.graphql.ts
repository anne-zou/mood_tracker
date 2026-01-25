/**
 * @generated SignedSource<<95c3f4954f51d22a160f124e7a4d727f>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type homeScreenQuery$variables = {
  first: number;
};
export type homeScreenQuery$data = {
  readonly " $fragmentSpreads": FragmentRefs<"home_moodEntries">;
};
export type homeScreenQuery = {
  response: homeScreenQuery$data;
  variables: homeScreenQuery$variables;
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
    "name": "homeScreenQuery",
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
    "name": "homeScreenQuery",
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
    "cacheID": "0af288d08d6489a121de329e8983d7f4",
    "id": null,
    "metadata": {},
    "name": "homeScreenQuery",
    "operationKind": "query",
    "text": "query homeScreenQuery(\n  $first: Int!\n) {\n  ...home_moodEntries_3ASum4\n}\n\nfragment MessageBubble_entry on MoodEntry {\n  id\n  content\n}\n\nfragment MessageMetadata_entry on MoodEntry {\n  id\n  time\n}\n\nfragment MessageRow_entry on MoodEntry {\n  id\n  ...MessageBubble_entry\n  ...MessageMetadata_entry\n}\n\nfragment home_moodEntries_3ASum4 on Query {\n  moodEntries(first: $first) {\n    edges {\n      node {\n        id\n        content\n        time\n        ...MessageRow_entry\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      hasNextPage\n      endCursor\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "c642e0545caafd720df98a03bb257b58";

export default node;
