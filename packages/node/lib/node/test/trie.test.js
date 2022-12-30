/* import { LevelDB } from "../src.ts/trie/level";
import { Level } from "level";
import { Trie } from "@ethereumjs/trie";

describe("trie", () => {
  it("should test the trie", async () => {
    const trie = new Trie({
      db: new LevelDB(new Level("../../db")),
      useRootPersistence: true,
    });
    const key = Buffer.from("testKey");
    const value = Buffer.from("testValue");
    await trie.put(key, value); // We update (using "put") the trie with the key-value pair "testKey": "testValue"
    const valuePre = await trie.get(key); // We retrieve (using "get") the value at key "testKey"
    console.log(
      "Value (String): ",
      valuePre?.toString() || "null value for testKey"
    ); // We retrieve our value
    console.log("Updated trie root:", trie.root()); // The new trie root

    await trie.del(key);
    const valuePost = await trie.get(key); // We try to retrieve the value at (deleted) key "testKey"
    console.log('Value at key "testKey": ', valuePost); // Key not found. Value is therefore null.
    console.log("Trie root after deletion:", trie.root()); // Our trie root is back to its initial value
  });
});
 */
//# sourceMappingURL=trie.test.js.map