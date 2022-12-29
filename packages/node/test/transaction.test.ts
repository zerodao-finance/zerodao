/* import { expect } from "chai";
import { StateTrie } from "../src.ts/trie/trie";
import { TransactionEngine, validateTransaction } from "../src.ts/transaction";
import { Account } from "@zerodao/protobuf";

describe("TransactionEngine", () => {
  let trie: StateTrie;
  let engine: TransactionEngine;

  beforeEach(() => {
    trie = new StateTrie();
    engine = new TransactionEngine(trie);
  });

  const validTx = {
    from: "0x123",
    to: "0x456",
    amount: "10",
    signature: "valid signature",
  };

  const invalidTx = {
    from: "0x123",
    to: "0x456",
    amount: "10",
    signature: "invalid signature",
  };

  const txs = [validTx, invalidTx];

  it("should run a block of transactions", async () => {
    await engine.runBlock(txs);
    expect(((await trie.getAccount(validTx.from)) as Account).balance).to.equal(
      "-10"
    );
    expect(((await trie.getAccount(validTx.to)) as Account).balance).to.equal(
      "10"
    );
  });

  it("should validate a transaction", async () => {
    const validTBuf = "valid transaction buffer";
    const invalidTBuf = "invalid transaction buffer";
    await validateTransaction(validTBuf);
    try {
      await validateTransaction(invalidTBuf);
    } catch (error) {
      expect(error).to.exist;
    }
  });
});
 */
