"use strict";

const { createLogger, format, transports } = require("winston");
const { combine, timestamp, prettyPrint, colorize } = format;

const logger = createLogger({
  level: "info",
  format: combine(timestamp(), prettyPrint(), colorize()),
  transports: [new transports.Console()],
});

const EventEmitter = require("events");
const { logError } = require("sparse-merkle-tree");

const PROPOSE = 0;
const PREVOTE = 1;
const PRECOMMIT = 2;

export class Consensus extends EventEmitter {
  public signatory: number;
  public f: number;
  public initTimeoutPropose: number;
  public initTimeoutPrevote: number;
  public initTImeoutPrecommit: number;
  public timeoutDelta: number;
  public height: number;
  public round: number;
  public step: number;
  public decision: any;
  public messageLog: any;
  public lockedValue: number | null | string;
  public validValue: number | string | null;
  public lockedRound: number;
  public validRound: number;
  constructor({
    signatory = 0, // for now an actual number
    f = 0,
    initTimeoutPropose = 10000,
    initTimeoutPrevote = 2000,
    initTimeoutPrecommit = 2000,
    timeoutDelta = 500,
    valid = (value) => true,
  } = {}) {
    super();
    this.signatory = signatory;
    this.f = f;
    this.initTimeoutPropose = initTimeoutPropose;
    this.initTimeoutPrevote = initTimeoutPrevote;
    this.initTimeoutPrecommit = initTimeoutPrecommit;
    this.timeoutDelta = timeoutDelta;
    this.valid = valid;
    this.height = 0;
    this.round = 0;
    this.step = PROPOSE;
    this.decision = {};
    this.messageLog = {};
    this.lockedValue = null;
    this.validValue = null;
    this.lockedRound = -1;
    this.validRound = -1;
  }

  /**
   * Function should get the value to be included at this height.
   * @returns {*} Value proposed for block
   */
  getValue() {
    return 56; // TODO replace with actual value. Should call out to other function.
  }

  valid(value) {
    return true; //TODO FIX ME
  }

  proposer() {
    return "NODE2"; // TODO replace with actual proposer
  }
  id(value) {
    return 1;
  }

  /**
   *
   * @param {Array<T>} rule The list of rules to match against.
   * @param {object} logs The logs to key rule against.
   * @returns {boolean} Were logs found?
   */
  hasLogs(deepRule, logs) {
    let rule = deepRule.slice();
    let key;

    //logger.info(`Searching for <${rule}>`);

    for (var i = 0; i < rule.length - 1; i++) {
      key = rule[i];
      //logger.debug(`${key} - <${rule.slice(i+1)}>`);
      if (key === "*") {
        for (var log in logs) {
          let containsValue = this.hasLogs(rule.slice(i + 1), log);
          if (containsValue) return true;
        }
      } else {
        if (logs[key] === undefined) return false;
        logs = logs[key];
      }
    }

    if (rule[rule.length - 1] === logs || rule[rule.length - 1] === "*")
      return true;
    return false;
  }

  /***
   * Evaluates if a rule has been met by the minimum number of signatories
   * @param {Array<T>} rule The list of rules to match against
   * @param {number} minSignatories The minimum number of signatories for the function to evaluate true
   * @return {boolean} Success
   */
  sufficient(rule, minSignatories) {
    let count = Object.keys(this.messageLog).reduce(
      (voteCount, signatory) =>
        voteCount +
        Number(this.hasLogs(rule, this.messageLog[signatory] || {})),
      0
    );
    logger.debug(`Rule ${rule}: ${count}/${minSignatories} signers.`);
    return count >= minSignatories;
  }

  /*
  on(eventName, callback) {
    super.on(eventName, (...msg) => this.eventMiddleware(callback, eventName, ...msg));
  }
  */

  emit(eventName, ...msg) {
    let event;
    if (eventName == PROPOSE) event = "PROPOSE";
    if (eventName == PREVOTE) event = "PREVOTE";
    if (eventName == PRECOMMIT) event = "PRECOMMIT";
    logger.info(`EMIT: <${event},${msg}>`);
    super.emit(eventName, this.signatory, ...msg);
  }

  /*
  eventMiddleware(callback, eventName, signatory, ...msg) {
    this.logMessage(signatory, eventName, ...msg)
    callback.bind(this)(eventName, ...msg);
  }
  */

  start() {
    this.on(PROPOSE, (signatory, ...msg) => {
      this.logMessage(signatory, PROPOSE, ...msg);
    });
    this.on(PREVOTE, (signatory, ...msg) => {
      this.logMessage(signatory, PREVOTE, ...msg);
    });
    this.on(PRECOMMIT, (signatory, ...msg) => {
      this.logMessage(signatory, PRECOMMIT, ...msg);
    });

    this.on(PROPOSE, (sig, h, r, v, vr) => this.L22(v));
    this.on(PROPOSE, this.L28);
    this.on(PREVOTE, this.L34);
    this.on(PROPOSE, this.L36);
    this.on(PREVOTE, this.L44);
    this.on(PRECOMMIT, this.L47);
    this.on(PROPOSE, this.L49);

    this.on(PROPOSE, this.L55);
    this.on(PREVOTE, this.L55);
    this.on(PRECOMMIT, this.L55);

    this.startRound(0);
  }

  setLog(value, ...keys) {
    let logs = this.messageLog;
    while (keys.length - 1) {
      var key = keys.shift();
      if (!(key in logs)) logs[key] = {};
      logs = logs[key];
    }
    logs[keys[0]] = value;
  }

  logMessage(...msg) {
    logger.debug(`Logging Info: ${msg}`);
    let value = msg.pop();
    this.setLog(value, ...msg);
  }

  /**
   * ```
   *  Function StartRound(round):
   *    roundp ← round
   *    step ← propose
   *    if proposer(h, round) = p then
   *      if validValue != nil then
   *        proposal ← validValue
   *      else
   *        proposal ← getValue()
   *      broadcast ⟨PROPOSAL, h, round, proposal, validRound⟩
   *    else schedule OnTimeoutPropose(h,round) to be executed after timeoutPropose(round)
   *
   * ```
   * @param {number} round
   */
  startRound(round) {
    this.round = round;
    this.step = PROPOSE;

    logger.debug(
      `Starting consensus process on round ${this.round} at height ${this.height}`
    );

    if (this.signatory == (this.proposer as any)()) {
      this.value = this.validValue || this.getValue();
      this.emit(PROPOSE, this.height, this.round, this.value, this.validRound);
    } else {
      let height = this.height;
      let round = this.round;
      setTimeout(
        () => this.onTimeoutPropose(height, round),
        this.initTimeoutPropose + this.round * this.timeoutDelta
      );
    }
  }

  /**
   * ```
   *  upon ⟨PROPOSAL, h, round, v, −1⟩ from proposer(h, round) while step = propose do
   *    if valid(v) ∧ (lockedRound = −1 ∨ lockedValue = v) then
   *      broadcast ⟨PREVOTE, h, round, id(v)⟩
   *    else
   *      broadcast ⟨PREVOTE, h, round, nil⟩
   *    step ← prevote
   * ```
   */
  L22(value) {
    logger.debug("L22: <PROPOSAL, height, round, value, -1>");
    // <PROPOSAL, height, round, *, -1> from PROPOSER
    let rule = [PROPOSE, this.height, this.round, value, -1];
    if (!this.hasLogs(rule, this.messageLog?.[this.proposer()] || {})) return;
    if (this.step !== PROPOSE) return;

    const valueId =
      this.valid(value) && (this.lockedRound == -1 || this.lockedValue == value)
        ? this.id(value)
        : null;

    this.step = PREVOTE;
    logger.debug("L22: Completed.");
    this.emit(PREVOTE, this.height, this.round, valueId);
  }

  /**
   * ```
   * upon ⟨PROPOSAL, h, round, v, vr⟩ from proposer(h, round) AND 2f + 1 ⟨PREVOTE, h, vr, id(v)⟩ while step = propose∧(vr ≥ 0 ∧ vr < round) do
   *  if valid(v) ∧ (lockedRoundp ≤ vr ∨ lockedValue = v) then
   *    broadcast ⟨PREVOTE, h, round, id(v)⟩
   *  else
   *    broadcast ⟨PREVOTE, h, round, nil⟩
   *  step ← prevote
   * ```
   */
  L28() {
    logger.debug("L28: <PROPOSAL, height, round, value, validRound>");
    // <PROPOSAL, height, round, value, validRound> from PROPOSER
    let rule = [PROPOSE, this.height, this.round, this.value, this.validRound];
    if (!this.hasLogs(rule, this.messageLog?.[this.proposer()] || {})) return;

    // 2f + 1 <PREVOTE, height, validRound, id(value)>
    rule = [PREVOTE, this.height, this.validRound, this.id(this.value)];
    if (!this.sufficient(rule, 2 * this.f + 1)) return;

    if (
      !(
        this.step == PROPOSE &&
        this.validRound >= 0 &&
        this.validRound < this.round
      )
    )
      return;

    const valueId =
      this.valid(this.value) &&
      (this.lockedRound <= this.validRound || this.lockedValue == this.value)
        ? this.id(this.value)
        : null;

    this.step = PREVOTE;
    logger.debug("L28: Completed.");
    this.emit(PREVOTE, this.height, this.round, valueId);
  }

  /**
   * ```
   * upon 2f + 1 ⟨PREVOTE, h, round, ∗⟩ while step = prevote for the first time do
   *  schedule OnTimeoutPrevote(h,round) to be executed after timeoutPrevote(round)
   * ```
   */
  L34() {
    logger.debug("L34: MAJORITY (2f + 1) HAVE <PREVOTE, height, round, *>");
    if (
      this.messageLog?.L34?.[this.round] !== undefined ||
      this.step !== PREVOTE
    )
      return;
    this.setLog(true, "L34", this.round);

    // 2f + 1 ⟨PREVOTE, height, round, *⟩
    let rule = [PREVOTE, this.height, this.round, "*"];
    if (!this.sufficient(rule, 2 * this.f + 1)) return;

    let height = this.height;
    let round = this.round;
    logger.debug("L34: Completed.");
    setTimeout(
      () => this.onTimeoutPrevote(height, round),
      this.initTimeoutPrevote + this.round * this.timeoutDelta
    );
  }

  /**
   * ```
   * upon ⟨PROPOSAL, h, round, v, ∗⟩ from proposer(h, round) AND 2f + 1 ⟨PREVOTE, h, round, id(v)⟩ while valid(v) ∧ step ≥ prevote for the first time do
   *   if step = prevote then
   *    lockedValue ← v
   *    lockedRound ← round
   *    broadcast ⟨PRECOMMIT, h, round, id(v))⟩
   *    step ← precommit
   *  validValue ← v
   *  validRound ← round
   * ```
   */
  L36() {
    logger.debug("<PROPOSAL, height, round, value, *>");
    if (this.messageLog?.L36?.[this.round] !== undefined) return;
    this.setLog(true, "L36", this.round);

    let rule = [PROPOSE, this.height, this.round, this.value, "*"];
    if (!this.hasLogs(rule, this.messageLog?.[this.proposer()] || {})) return;

    if (!(this.valid(this.value) && this.step >= PREVOTE)) return;

    rule = [PREVOTE, this.height, this.round, this.id(this.value)];
    if (!this.sufficient(rule, 2 * this.f + 1)) return;

    if (this.step == PREVOTE) {
      this.lockedValue = this.value;
      this.lockedRound = this.round;
      this.validValue = this.value;
      this.validRound = this.round;
      this.step = PRECOMMIT;
      logger.debug("L36: Completed.");
      this.emit(PRECOMMIT, this.height, this.round, this.id(this.value));
    } else {
      this.validValue = this.value;
      this.validRound = this.round;
      logger.debug("L36: Completed.");
    }
  }

  /**
   * ```
   * upon 2f + 1 ⟨PREVOTE, h, round, nil⟩ while step = prevote do
   *  broadcast ⟨PRECOMMIT, h, round, nil⟩
   *  step ← precommit
   * ```
   */
  L44() {
    logger.debug("L44: MAJORITY (2f + 1) HAVE <PREVOTE, height, round, nil>");
    let rule = [PREVOTE, this.height, this.round, null];
    if (!this.sufficient(rule, 2 * this.f + 1)) return;

    if (this.step != PREVOTE) return;

    this.step = PRECOMMIT;
    logger.debug("L44: Completed.");

    this.emit(PRECOMMIT, this.height, this.round, null);
  }

  /**
   * ```
   * upon 2f + 1 ⟨PRECOMMIT, h, round, ∗⟩ for the first time do
   *  schedule OnTimeoutPrecommit(h,round) to be executed after timeoutPrecommit(round)
   * ```
   */
  L47() {
    logger.debug("L47: <2f + 1 <PRECOMMIT, height, round, *>");
    if (this.messageLog?.L47?.[this.round] !== undefined) return;
    this.setLog(true, "L47", this.round);

    let rule = [PRECOMMIT, this.height, this.round, "*"];
    if (!this.sufficient(rule, 2 * this.f + 1)) return;

    let height = this.height;
    let round = this.round;

    logger.debug("L47: Completed.");
    setTimeout(
      () => this.onTimeoutPrecommit(height, round),
      this.initTimeoutPrecommit + this.round * this.timeoutDelta
    );
  }

  /**
   * ```
   * upon ⟨PROPOSAL, h, r, v, ∗⟩ from proposer(h, r) AND 2f + 1 ⟨PRECOMMIT, h, r, id(v)⟩ while decision[h] = nil do
   *  if valid(v) then
   *    decision[h] = v
   *    h←h+1
   *    reset lockedRound, lockedValue, validRound and validValue to initial values and empty message log
   *    StartRound(0)
   *  ```
   */
  L49() {
    logger.info("L49: <PROPOSAL, height, round, value, *>");
    let rule = [PROPOSE, this.height, this.round, this.value, "*"];
    if (!this.hasLogs(rule, this.messageLog?.[this.proposer()] || {}))
      return logger.error(
        `<PROPOSE,${this.height},${this.round},${this.value},'*'> NOT DETECTED`
      );

    rule = [PRECOMMIT, this.height, this.round, this.id(this.value)];
    if (!this.sufficient(rule, 2 * this.f + 1))
      return logger.error(
        `MAJORITY (2f+1) <PRECOMMIT,${this.height},${this.round},${this.id(
          this.value
        )}> NOT DETECTED`
      );

    if (this.decision?.[this.height] !== undefined)
      return logger.error(`DECISION ALREADY EXISTS AT ${this.height}`);

    if (this.valid(this.value)) {
      this.decision[this.height] = this.value;
      this.height++;
      this.lockedRound = -1;
      this.lockedValue = null;
      this.validRound = -1;
      this.validValue = null;
      this.messageLog = {};
      this.startRound(0);
    }
    logger.debug("L49: Completed.");
  }

  /**
   * ```
   * upon f + 1 ⟨∗, h, round, ∗, ∗⟩ with round > roundp do
   *  StartRound(round)
   * ```
   */
  L55() {
    logger.debug("L55: f + 1 <*, height, round, *, *>");
    let rule = ["*", this.height, this.round + 1, "*", "*"];
    if (!this.sufficient(rule, this.f + 1)) return;
    logger.debug("L55: Completed.");
    this.startRound(this.round + 1);
  }

  /**
   * ```
   * Function OnTimeoutPropose(height, round):
   *  if height = heightp ∧ round = roundp ∧ step = propose then
   *    broadcast ⟨PREVOTE, height, round, nil⟩
   *    step ← prevote
   * ```
   * @param {number} height
   * @param {number} round
   */
  onTimeoutPropose(height, round) {
    if (height == this.height && round == this.round && this.step == PROPOSE) {
      logger.error("TIMEOUT: PROPOSE. Advancing to PREVOTE");
      this.step = PREVOTE;
      this.emit(PREVOTE, height, round, null);
    }
  }

  /**
   * Function OnTimeoutPrevote(height, round):
   *  if height = hp ∧ round = roundp ∧ step = prevote then
   *    broadcast ⟨PRECOMMIT, hp, roundp, nil⟩
   *    step ← precommit
   * @param {number} height
   * @param {number} round
   */
  onTimeoutPrevote(height, round) {
    if (height == this.height && round == this.round && this.step == PREVOTE) {
      logger.error("TIMEOUT: PREVOTE. Advancing to PRECOMMIT");
      this.step = PRECOMMIT;
      this.emit(PRECOMMIT, this.height, this.round, null);
    }
  }

  /**
   * Function OnTimeoutPrecommit(height, round) :
   *  if height = hp ∧ round = roundp then
   *    StartRound(roundp + 1)
   * @param number height
   * @param number round
   */
  onTimeoutPrecommit(height, round) {
    if (height == this.height && round == this.round) {
      logger.error("TIMEOUT: PRECOMMIT. Advancing to NEXT ROUND");
      this.startRound(this.round + 1);
    }
  }
}
