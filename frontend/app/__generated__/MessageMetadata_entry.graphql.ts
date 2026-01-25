/**
 * @generated SignedSource<<88a31ebd5a4726ae0c1fd7c721f3be9a>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type MessageMetadata_entry$data = {
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
    }
  ],
  "type": "MoodEntry",
  "abstractKey": null
};

(node as any).hash = "110848a02df5d3a6629a5d354be8123e";

export default node;
