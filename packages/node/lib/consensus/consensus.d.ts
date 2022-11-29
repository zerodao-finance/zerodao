declare const EventEmitter: any;
export declare class Consensus extends EventEmitter {
    signatory: number;
    f: number;
    initTimeoutPropose: number;
    initTimeoutPrevote: number;
    initTImeoutPrecommit: number;
    timeoutDelta: number;
    height: number;
    round: number;
    step: number;
    decision: any;
    messageLog: any;
    lockedValue: number | null | string;
    validValue: number | string | null;
    lockedRound: number;
    validRound: number;
    constructor({ signatory, // for now an actual number
    f, initTimeoutPropose, initTimeoutPrevote, initTimeoutPrecommit, timeoutDelta, valid }?: {
        signatory?: number;
        f?: number;
        initTimeoutPropose?: number;
        initTimeoutPrevote?: number;
        initTimeoutPrecommit?: number;
        timeoutDelta?: number;
        valid?: (value: any) => true;
    });
    /**
     * Function should get the value to be included at this height.
     * @returns {*} Value proposed for block
     */
    getValue(): number;
    valid(value: any): boolean;
    proposer(): string;
    id(value: any): number;
    /**
     *
     * @param {Array<T>} rule The list of rules to match against.
     * @param {object} logs The logs to key rule against.
     * @returns {boolean} Were logs found?
     */
    hasLogs(deepRule: any, logs: any): boolean;
    /***
     * Evaluates if a rule has been met by the minimum number of signatories
     * @param {Array<T>} rule The list of rules to match against
     * @param {number} minSignatories The minimum number of signatories for the function to evaluate true
     * @return {boolean} Success
     */
    sufficient(rule: any, minSignatories: any): boolean;
    emit(eventName: any, ...msg: any[]): void;
    start(): void;
    setLog(value: any, ...keys: any[]): void;
    logMessage(...msg: any[]): void;
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
    startRound(round: any): void;
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
    L22(value: any): void;
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
    L28(): void;
    /**
     * ```
     * upon 2f + 1 ⟨PREVOTE, h, round, ∗⟩ while step = prevote for the first time do
     *  schedule OnTimeoutPrevote(h,round) to be executed after timeoutPrevote(round)
     * ```
     */
    L34(): void;
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
    L36(): void;
    /**
     * ```
     * upon 2f + 1 ⟨PREVOTE, h, round, nil⟩ while step = prevote do
     *  broadcast ⟨PRECOMMIT, h, round, nil⟩
     *  step ← precommit
     * ```
     */
    L44(): void;
    /**
     * ```
     * upon 2f + 1 ⟨PRECOMMIT, h, round, ∗⟩ for the first time do
     *  schedule OnTimeoutPrecommit(h,round) to be executed after timeoutPrecommit(round)
     * ```
     */
    L47(): void;
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
    L49(): any;
    /**
     * ```
     * upon f + 1 ⟨∗, h, round, ∗, ∗⟩ with round > roundp do
     *  StartRound(round)
     * ```
     */
    L55(): void;
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
    onTimeoutPropose(height: any, round: any): void;
    /**
     * Function OnTimeoutPrevote(height, round):
     *  if height = hp ∧ round = roundp ∧ step = prevote then
     *    broadcast ⟨PRECOMMIT, hp, roundp, nil⟩
     *    step ← precommit
     * @param {number} height
     * @param {number} round
     */
    onTimeoutPrevote(height: any, round: any): void;
    /**
     * Function OnTimeoutPrecommit(height, round) :
     *  if height = hp ∧ round = roundp then
     *    StartRound(roundp + 1)
     * @param number height
     * @param number round
     */
    onTimeoutPrecommit(height: any, round: any): void;
}
export {};
