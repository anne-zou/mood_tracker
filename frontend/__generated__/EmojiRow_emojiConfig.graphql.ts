/**
 * @generated SignedSource<<e187fbf7664a23f484372d3a1964e6b6>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type EmojiRow_emojiConfig$data = {
  readonly content: string;
  readonly id: string;
  readonly " $fragmentType": "EmojiRow_emojiConfig";
};
export type EmojiRow_emojiConfig$key = {
  readonly " $data"?: EmojiRow_emojiConfig$data;
  readonly " $fragmentSpreads": FragmentRefs<"EmojiRow_emojiConfig">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "EmojiRow_emojiConfig",
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
  "type": "EmojiConfig",
  "abstractKey": null
};

(node as any).hash = "3658b8f5d40e4e4f17d2f694a70bcd4f";

export default node;
