import { TypedPackValue } from "@renproject/utils";
export declare const unmarshalRenVMTransaction: <Input = any, Output = any, TypedInput extends TypedPackValue<import("@renproject/utils").PackTypeDefinition, any> = TypedPackValue<import("@renproject/utils").PackTypeDefinition, any>, TypedOutput extends TypedPackValue<import("@renproject/utils").PackTypeDefinition, any> = TypedPackValue<import("@renproject/utils").PackTypeDefinition, any>>(tx: any) => {
    version: number;
    hash: any;
    selector: any;
    in: any;
    out: any;
};
