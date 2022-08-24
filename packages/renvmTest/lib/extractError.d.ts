export declare const hasOwnProperty: <T>(object: any, property: keyof T) => object is T;
export declare const invalidError: (errorMessage: string) => boolean;
/**
 * Attempt to extract a more meaningful error from a thrown error, such as
 * the body of a network response.
 */
export declare const extractError: (error: unknown) => string;
//# sourceMappingURL=extractError.d.ts.map