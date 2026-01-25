/**
 * @generated SignedSource<<0f41c835ff568802994fc03f96ea4592>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type MessageRow_entry$data = {
  readonly id: string;
  readonly " $fragmentSpreads": FragmentRefs<"MessageBubble_entry" | "MessageMetadata_entry">;
  readonly " $fragmentType": "MessageRow_entry";
};
export type MessageRow_entry$key = {
  readonly " $data"?: MessageRow_entry$data;
  readonly " $fragmentSpreads": FragmentRefs<"MessageRow_entry">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "MessageRow_entry",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "id",
      "storageKey": null
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "MessageBubble_entry"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "MessageMetadata_entry"
    }
  ],
  "type": "MoodEntry",
  "abstractKey": null
};

(node as any).hash = "7bb6732e3dc719ba3b18cde202e06392";

export default node;
