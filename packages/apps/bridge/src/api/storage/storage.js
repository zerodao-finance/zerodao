import hash from "object-hash";

class IndexedDBPeristanceStrategy {
  strategy = window.indexedDB;
  objectStore = "Transactions";
  db = undefined;

  _loading = true;

  get loading() {
    return this._loading;
  }

  set loading(value) {
    if (value == this._loading) return;

    this._loading = value;
  }

  constructor(store_name, _version = undefined) {
    (async () => await this.open_store(store_name, _version))();
  }

  promiseReq(req) {
    return new Promise((resolve, reject) => {
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  async open_store(store_name, _version) {
    let dbReq;
    if (window !== "undefined") {
      let version = _version || processs.env.DB_VERSION;
      dbReq = await this.strategy.open(store_name, version);
      dbReq.onupgradeneeded = () => {
        let db = dbReq.result;
        let store = db.createObjectStore(this.objectStore, {
          autoIncrement: true,
          keyPath: "tx",
        });
        store.createIndex("date", "date");
        store.createIndex("data", "data");
        store.createIndex("status", "status");
      };
    }

    this.db = this.promiseReq(dbReq).then((value) => {
      this.loading = false;
      return value;
    });
  }

  async close_store() {
    this.db.close();
  }

  async put(key, data) {
    let tx = await this.db.transaction([this.objectStore], "readwrite");
    let store = tx.objectStore(this.objectStore);
    await store.put({
      tx: key,
      data: data.data,
      date: data.date,
      status: data.status,
    });
    await tx.complete;
  }

  async add_data(id, data, status) {
    let tx = (await this.db).transaction([this.objectStore], "readwrite");
    let store = tx.objectStore(this.objectStore);

    await store.put({
      tx: id,
      data: JSON.stringify(data),
      date: Date.now(),
      status: status,
    });

    await tx.complete;
  }

  async put_data(data, status) {
    let tx = await this.db;
    // let tx = await this.db.transaction([this.objectStore], "readwrite");
    let store = tx.objectStore(this.objectStore);

    await store.put({
      tx: hash(data),
      data: JSON.stringify(data),
      date: Date.now(),
      status: status,
    });
    await tx.complete;
  }

  async delete_data() {
    //TODO: ;
  }

  async get_data_by(query) {
    let tx = await this.db.transaction([this.objectStore], "readwrite");
    let store = tx.objectStore(this.objectStore);
    switch (query) {
      case "status:completed":
        return await this.promiseReq(await store.getAll("status")).filter(
          (obj) => obj.status === "completed"
        );
      case "status:pending":
        return await this.promiseReq(await store.getAll("status")).filter(
          (obj) => obj.status === "pending"
        );
      case "recent":
        return await this.promiseReq(await store.getAll("status")).filter(
          (obj) => obj.Date === "pending"
        );
      default:
        return await this.promiseReq(await store.getAll());
    }
  }

  async get_all_data() {
    if (this.db) {
      let tx = (await this.db).transaction([this.objectStore], "readwrite");
      let store = tx.objectStore(this.objectStore);

      return await this.promiseReq(await store.getAll());
    }
  }
}

const PersistanceStore = (window.PersistanceStore =
  new IndexedDBPeristanceStrategy("TRANSACTION_STORE", 1));
export { PersistanceStore };
