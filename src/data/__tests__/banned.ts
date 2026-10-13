/* Shared by the data tests. */
import { createHash } from 'node:crypto';

/* Names that must never reach the site: clients, employers, staff, agent personas, Neil's own
   product names and personal details. Stored as the first 16 hex characters of the SHA-256 of
   the lowercase name, so this public repo never spells them out. To add one, hash it:
   node -e "console.log(require('crypto').createHash('sha256').update('name').digest('hex').slice(0, 16))" */
export const BANNED = new Set([
    '26aea82ea8e340aa', '2a7faaf70333cde4', 'a50df7b74170f869', 'd53898dd9d364e4b', 'bd86b4fb69d1f40a', '85f8b09187f80d03',
    'f144a6907dc4284d', '0189ad245886a48a', 'eea8ec0d45087305', 'a5135a58dd30a113', '8dd95e5612bebb96', '12fb9ab0dc7b0f66',
    'cdb45f9179a7711e', 'e365ba4795f56bd4', 'e2462c7ff6254625', 'c953e18c8cfee30a', '2b61298763ec6749', 'f22cd80196676b81',
    'aefc0a09d33cec6b', '701e43e98f0c6128', '0e1b15e2310681a6', '61b33c7da8ac2d8f', '71d7ef001384bce4', '030ee5b9d848ce25',
    '7288d688d7b03712', '86bf4bd9f844b356', '57cdc044e88cb6bd', '789384cdd316bf0d', '06307dc6e7d7bb84', '44fc6786c24d8550',
    'd2653ff7cbb2d8ff', '0078be9d3eb30dd9', 'bf446ea38129b6f1', '7814459b3f23f455', '5e0176c9d2070a5a', 'dda820158d142a0b',
    'e2324f665ae42249', '4fa1a13ac468ac49', 'ff2e963ff6d0c33a', '7797993a4b232d64', '6f851dc660025ec0', 'a3c671ab8eab98dd',
    'fecad70a20cedce5', '3568edca25022faa', '7186b6e1e1384449', 'e5ba1146416c9c3b', '0f9a79acd620eca4', '7ee29bca117d5f53',
    'b54f08623ae4039f', 'a83a31320d921b88', 'c0b0109d9439de57',
]);
const hash = (s: string) => createHash('sha256').update(s).digest('hex').slice(0, 16);
/** True when any word, or run of two or three words, is on the hashed list. */
export function flagged(text: string): boolean {
  const words = text.toLowerCase().match(/[a-z0-9&']+/g) ?? [];
  for (let i = 0; i < words.length; i++) {
    for (let n = 1; n <= 3 && i + n <= words.length; n++) {
      if (BANNED.has(hash(words.slice(i, i + n).join(' ')))) return true;
    }
  }
  return false;
}
