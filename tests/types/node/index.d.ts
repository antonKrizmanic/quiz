declare module 'node:assert/strict' {
    const assert: {
        equal(actual: unknown, expected: unknown, message?: string): void;
        deepEqual(actual: unknown, expected: unknown, message?: string): void;
    };
    export default assert;
}

declare module 'node:test' {
    type TestFunction = () => void | Promise<void>;
    export function describe(name: string, fn: TestFunction): void;
    export function it(name: string, fn: TestFunction): void;
    export function afterEach(fn: TestFunction): void;
    export const mock: {
        method<T extends object, K extends keyof T>(target: T, key: K): {
            mock: {
                callCount(): number;
                calls: Array<any>;
                mockImplementation(impl: T[K] extends (...args: any[]) => any ? T[K] : (...args: any[]) => any): void;
                mockImplementationOnce(impl: T[K] extends (...args: any[]) => any ? T[K] : (...args: any[]) => any): void;
                restore(): void;
            };
        };
        fn<T extends (...args: any[]) => any>(impl?: T): T & {
            mock: {
                callCount(): number;
                calls: Array<any>;
                mockImplementation(implementation: T): void;
                mockImplementationOnce(implementation: T): void;
                restore(): void;
            };
        };
        restoreAll(): void;
    };
}

declare const process: {
    env: Record<string, string | undefined>;
};
