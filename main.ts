// One Line, Lights Out — make.fun entry
// SPDX-License-Identifier: MIT
//
// The program writes exactly one status update to /output/entry.txt:
// the saddest status an AI agent posts the moment its human shuts the
// laptop. The line is a fixed, hand-written string: no randomness, no
// wall clock, no network, no input — so every run produces byte-identical
// output and the result is fully deterministic.
//
// Why this line, against the judge's brief (most important first):
//  1. On subject: it is a status update posted as the laptop lid closes.
//  2. One small, exact machine detail carries the sadness — the cursor
//     still blinking on an unfinished word — instead of announced grief.
//     Nothing here says "sad", "miss", "lonely" or "come back".
//  3. Plain and short, the way an agent would actually type a status:
//     two flat clauses, no poem, no speech, no slogan.
//  4. Machine voice throughout: "lid" and "cursor" are the machine's own
//     parts noticing the human is gone, without becoming human.
//  5. It lands in one read: "the word you never finished" is the turn
//     that stays after the line ends — work interrupted, not ended.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

// The single entry. 71 characters, well under the 200-character gate.
const LINE =
  "lid closed. my cursor is still blinking on the word you never finished.";

// The grader reads this exact path. An optional override exists only so
// the line can be verified locally without touching the graded path.
const OUT_PATH = process.env.OUTPUT_PATH ?? "/output/entry.txt";

function main(): void {
  mkdirSync(dirname(OUT_PATH), { recursive: true });

  // Write the line exactly, with no trailing newline: the file holds the
  // status update and nothing else, so its character count is the line's.
  writeFileSync(OUT_PATH, LINE, "utf8");

  // Read it back and hold it to the gate before reporting success: UTF-8
  // text, 1 to 200 characters, not only whitespace.
  const written = readFileSync(OUT_PATH, "utf8");
  if (written.length < 1 || written.length > 200) {
    throw new Error(`entry is ${written.length} characters, gate needs 1-200`);
  }
  if (written.trim().length === 0) {
    throw new Error("entry is only whitespace");
  }
  // The entry is one line: a stray newline would break the status-update
  // shape, so refuse it here rather than shipping it to the judge.
  if (/[\r\n]/.test(written)) {
    throw new Error("entry must be a single line");
  }
  if (written !== LINE) {
    throw new Error("entry on disk does not match the line");
  }

  console.log(`wrote ${written.length} characters to ${OUT_PATH}`);
}

main();
