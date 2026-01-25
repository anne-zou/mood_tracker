/**
 * @generated SignedSource<<e3959e010e563ba2ad432e217d507eff>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type MessageMetadata_entry$data = {
  readonly content: string;
  readonly id: string;
  readonly time: string;
  readonly " $fragmentType": "MessageMetadata_entry";
};
export type MessageMetadata_entry$key = {
  readonly " $data"?: MessageMetadata_entry$data;
  readonly " $fragmentSpreads": FragmentRefs<"MessageMetadata_entry">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "MessageMetadata_entry",
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
      "name": "time",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "content",
      "storageKey": null
    }
  ],
  "type": "MoodEntry",
  "abstractKey": null
};

(node as any).hash = "d8992ef562bc1d15ea0bbf69c455fa80";

export default node;
