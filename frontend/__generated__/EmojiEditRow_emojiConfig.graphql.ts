/**
 * @generated SignedSource<<2823604041d281e4ea91498bf87c4e8b>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type EmojiEditRow_emojiConfig$data = {
  readonly content: string;
  readonly createdAt: string;
  readonly id: string;
  readonly updatedAt: string;
  readonly userId: string;
  readonly " $fragmentType": "EmojiEditRow_emojiConfig";
};
export type EmojiEditRow_emojiConfig$key = {
  readonly " $data"?: EmojiEditRow_emojiConfig$data;
  readonly " $fragmentSpreads": FragmentRefs<"EmojiEditRow_emojiConfig">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "EmojiEditRow_emojiConfig",
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
      "name": "userId",
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
  "type": "EmojiConfig",
  "abstractKey": null
};

(node as any).hash = "416c24a8912064fe20e9814ca60261b5";

export default node;
