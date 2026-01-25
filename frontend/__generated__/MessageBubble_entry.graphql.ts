/**
 * @generated SignedSource<<1cc3b5acd5382410212bf462f706f13d>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type MessageBubble_entry$data = {
  readonly content: string;
  readonly id: string;
  readonly " $fragmentType": "MessageBubble_entry";
};
export type MessageBubble_entry$key = {
  readonly " $data"?: MessageBubble_entry$data;
  readonly " $fragmentSpreads": FragmentRefs<"MessageBubble_entry">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "MessageBubble_entry",
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
    }
  ],
  "type": "MoodEntry",
  "abstractKey": null
};

(node as any).hash = "f7152b9dffd6eba89a66f3b47f5c68e2";

export default node;
