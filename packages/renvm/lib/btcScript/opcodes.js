"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Opcode = void 0;
var Opcode;
(function (Opcode) {
    Opcode[Opcode["OP_FALSE"] = 0] = "OP_FALSE";
    Opcode[Opcode["OP_0"] = 0] = "OP_0";
    Opcode[Opcode["OP_PUSHDATA1"] = 76] = "OP_PUSHDATA1";
    Opcode[Opcode["OP_PUSHDATA2"] = 77] = "OP_PUSHDATA2";
    Opcode[Opcode["OP_PUSHDATA4"] = 78] = "OP_PUSHDATA4";
    Opcode[Opcode["OP_1NEGATE"] = 79] = "OP_1NEGATE";
    Opcode[Opcode["OP_RESERVED"] = 80] = "OP_RESERVED";
    Opcode[Opcode["OP_TRUE"] = 81] = "OP_TRUE";
    Opcode[Opcode["OP_1"] = 81] = "OP_1";
    Opcode[Opcode["OP_2"] = 82] = "OP_2";
    Opcode[Opcode["OP_3"] = 83] = "OP_3";
    Opcode[Opcode["OP_4"] = 84] = "OP_4";
    Opcode[Opcode["OP_5"] = 85] = "OP_5";
    Opcode[Opcode["OP_6"] = 86] = "OP_6";
    Opcode[Opcode["OP_7"] = 87] = "OP_7";
    Opcode[Opcode["OP_8"] = 88] = "OP_8";
    Opcode[Opcode["OP_9"] = 89] = "OP_9";
    Opcode[Opcode["OP_10"] = 90] = "OP_10";
    Opcode[Opcode["OP_11"] = 91] = "OP_11";
    Opcode[Opcode["OP_12"] = 92] = "OP_12";
    Opcode[Opcode["OP_13"] = 93] = "OP_13";
    Opcode[Opcode["OP_14"] = 94] = "OP_14";
    Opcode[Opcode["OP_15"] = 95] = "OP_15";
    Opcode[Opcode["OP_16"] = 96] = "OP_16";
    Opcode[Opcode["OP_NOP"] = 97] = "OP_NOP";
    Opcode[Opcode["OP_VER"] = 98] = "OP_VER";
    Opcode[Opcode["OP_IF"] = 99] = "OP_IF";
    Opcode[Opcode["OP_NOTIF"] = 100] = "OP_NOTIF";
    Opcode[Opcode["OP_VERIF"] = 101] = "OP_VERIF";
    Opcode[Opcode["OP_VERNOTIF"] = 102] = "OP_VERNOTIF";
    Opcode[Opcode["OP_ELSE"] = 103] = "OP_ELSE";
    Opcode[Opcode["OP_ENDIF"] = 104] = "OP_ENDIF";
    Opcode[Opcode["OP_VERIFY"] = 105] = "OP_VERIFY";
    Opcode[Opcode["OP_RETURN"] = 106] = "OP_RETURN";
    Opcode[Opcode["OP_TOALTSTACK"] = 107] = "OP_TOALTSTACK";
    Opcode[Opcode["OP_FROMALTSTACK"] = 108] = "OP_FROMALTSTACK";
    Opcode[Opcode["OP_2DROP"] = 109] = "OP_2DROP";
    Opcode[Opcode["OP_2DUP"] = 110] = "OP_2DUP";
    Opcode[Opcode["OP_3DUP"] = 111] = "OP_3DUP";
    Opcode[Opcode["OP_2OVER"] = 112] = "OP_2OVER";
    Opcode[Opcode["OP_2ROT"] = 113] = "OP_2ROT";
    Opcode[Opcode["OP_2SWAP"] = 114] = "OP_2SWAP";
    Opcode[Opcode["OP_IFDUP"] = 115] = "OP_IFDUP";
    Opcode[Opcode["OP_DEPTH"] = 116] = "OP_DEPTH";
    Opcode[Opcode["OP_DROP"] = 117] = "OP_DROP";
    Opcode[Opcode["OP_DUP"] = 118] = "OP_DUP";
    Opcode[Opcode["OP_NIP"] = 119] = "OP_NIP";
    Opcode[Opcode["OP_OVER"] = 120] = "OP_OVER";
    Opcode[Opcode["OP_PICK"] = 121] = "OP_PICK";
    Opcode[Opcode["OP_ROLL"] = 122] = "OP_ROLL";
    Opcode[Opcode["OP_ROT"] = 123] = "OP_ROT";
    Opcode[Opcode["OP_SWAP"] = 124] = "OP_SWAP";
    Opcode[Opcode["OP_TUCK"] = 125] = "OP_TUCK";
    Opcode[Opcode["OP_CAT"] = 126] = "OP_CAT";
    Opcode[Opcode["OP_SUBSTR"] = 127] = "OP_SUBSTR";
    Opcode[Opcode["OP_LEFT"] = 128] = "OP_LEFT";
    Opcode[Opcode["OP_RIGHT"] = 129] = "OP_RIGHT";
    Opcode[Opcode["OP_SIZE"] = 130] = "OP_SIZE";
    Opcode[Opcode["OP_INVERT"] = 131] = "OP_INVERT";
    Opcode[Opcode["OP_AND"] = 132] = "OP_AND";
    Opcode[Opcode["OP_OR"] = 133] = "OP_OR";
    Opcode[Opcode["OP_XOR"] = 134] = "OP_XOR";
    Opcode[Opcode["OP_EQUAL"] = 135] = "OP_EQUAL";
    Opcode[Opcode["OP_EQUALVERIFY"] = 136] = "OP_EQUALVERIFY";
    Opcode[Opcode["OP_RESERVED1"] = 137] = "OP_RESERVED1";
    Opcode[Opcode["OP_RESERVED2"] = 138] = "OP_RESERVED2";
    Opcode[Opcode["OP_1ADD"] = 139] = "OP_1ADD";
    Opcode[Opcode["OP_1SUB"] = 140] = "OP_1SUB";
    Opcode[Opcode["OP_2MUL"] = 141] = "OP_2MUL";
    Opcode[Opcode["OP_2DIV"] = 142] = "OP_2DIV";
    Opcode[Opcode["OP_NEGATE"] = 143] = "OP_NEGATE";
    Opcode[Opcode["OP_ABS"] = 144] = "OP_ABS";
    Opcode[Opcode["OP_NOT"] = 145] = "OP_NOT";
    Opcode[Opcode["OP_0NOTEQUAL"] = 146] = "OP_0NOTEQUAL";
    Opcode[Opcode["OP_ADD"] = 147] = "OP_ADD";
    Opcode[Opcode["OP_SUB"] = 148] = "OP_SUB";
    Opcode[Opcode["OP_MUL"] = 149] = "OP_MUL";
    Opcode[Opcode["OP_DIV"] = 150] = "OP_DIV";
    Opcode[Opcode["OP_MOD"] = 151] = "OP_MOD";
    Opcode[Opcode["OP_LSHIFT"] = 152] = "OP_LSHIFT";
    Opcode[Opcode["OP_RSHIFT"] = 153] = "OP_RSHIFT";
    Opcode[Opcode["OP_BOOLAND"] = 154] = "OP_BOOLAND";
    Opcode[Opcode["OP_BOOLOR"] = 155] = "OP_BOOLOR";
    Opcode[Opcode["OP_NUMEQUAL"] = 156] = "OP_NUMEQUAL";
    Opcode[Opcode["OP_NUMEQUALVERIFY"] = 157] = "OP_NUMEQUALVERIFY";
    Opcode[Opcode["OP_NUMNOTEQUAL"] = 158] = "OP_NUMNOTEQUAL";
    Opcode[Opcode["OP_LESSTHAN"] = 159] = "OP_LESSTHAN";
    Opcode[Opcode["OP_GREATERTHAN"] = 160] = "OP_GREATERTHAN";
    Opcode[Opcode["OP_LESSTHANOREQUAL"] = 161] = "OP_LESSTHANOREQUAL";
    Opcode[Opcode["OP_GREATERTHANOREQUAL"] = 162] = "OP_GREATERTHANOREQUAL";
    Opcode[Opcode["OP_MIN"] = 163] = "OP_MIN";
    Opcode[Opcode["OP_MAX"] = 164] = "OP_MAX";
    Opcode[Opcode["OP_WITHIN"] = 165] = "OP_WITHIN";
    Opcode[Opcode["OP_RIPEMD160"] = 166] = "OP_RIPEMD160";
    Opcode[Opcode["OP_SHA1"] = 167] = "OP_SHA1";
    Opcode[Opcode["OP_SHA256"] = 168] = "OP_SHA256";
    Opcode[Opcode["OP_HASH160"] = 169] = "OP_HASH160";
    Opcode[Opcode["OP_HASH256"] = 170] = "OP_HASH256";
    Opcode[Opcode["OP_CODESEPARATOR"] = 171] = "OP_CODESEPARATOR";
    Opcode[Opcode["OP_CHECKSIG"] = 172] = "OP_CHECKSIG";
    Opcode[Opcode["OP_CHECKSIGVERIFY"] = 173] = "OP_CHECKSIGVERIFY";
    Opcode[Opcode["OP_CHECKMULTISIG"] = 174] = "OP_CHECKMULTISIG";
    Opcode[Opcode["OP_CHECKMULTISIGVERIFY"] = 175] = "OP_CHECKMULTISIGVERIFY";
    Opcode[Opcode["OP_CHECKLOCKTIMEVERIFY"] = 177] = "OP_CHECKLOCKTIMEVERIFY";
    Opcode[Opcode["OP_CHECKSEQUENCEVERIFY"] = 178] = "OP_CHECKSEQUENCEVERIFY";
    Opcode[Opcode["OP_NOP1"] = 176] = "OP_NOP1";
    Opcode[Opcode["OP_NOP2"] = 177] = "OP_NOP2";
    Opcode[Opcode["OP_NOP3"] = 178] = "OP_NOP3";
    Opcode[Opcode["OP_NOP4"] = 179] = "OP_NOP4";
    Opcode[Opcode["OP_NOP5"] = 180] = "OP_NOP5";
    Opcode[Opcode["OP_NOP6"] = 181] = "OP_NOP6";
    Opcode[Opcode["OP_NOP7"] = 182] = "OP_NOP7";
    Opcode[Opcode["OP_NOP8"] = 183] = "OP_NOP8";
    Opcode[Opcode["OP_NOP9"] = 184] = "OP_NOP9";
    Opcode[Opcode["OP_NOP10"] = 185] = "OP_NOP10";
    Opcode[Opcode["OP_PUBKEYHASH"] = 253] = "OP_PUBKEYHASH";
    Opcode[Opcode["OP_PUBKEY"] = 254] = "OP_PUBKEY";
    Opcode[Opcode["OP_INVALIDOPCODE"] = 255] = "OP_INVALIDOPCODE";
})(Opcode = exports.Opcode || (exports.Opcode = {}));
//# sourceMappingURL=opcodes.js.map