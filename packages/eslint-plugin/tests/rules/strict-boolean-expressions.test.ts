/* eslint-disable @typescript-eslint/no-deprecated -- TODO - migrate this test away from `batchedSingleLineTests` */

import * as path from 'node:path';

import { noFormat, RuleTester } from '@typescript-eslint/rule-tester';

import type {
  MessageId,
  Options,
} from '../../src/rules/strict-boolean-expressions';
import rule from '../../src/rules/strict-boolean-expressions';
import { batchedSingleLineTests, getFixturesRootDir } from '../RuleTester';

const rootPath = getFixturesRootDir();
const ruleTester = new RuleTester({
  languageOptions: {
    parserOptions: {
      tsconfigRootDir: rootPath,
      project: './tsconfig.json',
    },
  },
});

ruleTester.run('strict-boolean-expressions', rule, {
  valid: [
    // boolean in boolean context
    "true ? 'a' : 'b';",
    `
if (false) {
}
    `,
    'while (true) {}',
    'for (; false; ) {}',
    '!true;',
    'false || 123;',
    "true && 'foo';",
    '!(false || true);',
    'true && false ? true : false;',
    '(false && true) || false;',
    '(false && true) || [];',
    '(false && 1) || (true && 2);',
    `
declare const x: boolean;
if (x) {
}
    `,
    '(x: boolean) => !x;',
    '<T extends boolean>(x: T) => (x ? 1 : 0);',
    `
declare const x: never;
if (x) {
}
    `,

    // string in boolean context
    `
if ('') {
}
    `,
    "while ('x') {}",
    "for (; ''; ) {}",
    "('' && '1') || x;",
    `
declare const x: string;
if (x) {
}
    `,
    '(x: string) => !x;',
    '<T extends string>(x: T) => (x ? 1 : 0);',

    // number in boolean context
    `
if (0) {
}
    `,
    'while (1n) {}',
    'for (; Infinity; ) {}',
    '(0 / 0 && 1 + 2) || x;',
    `
declare const x: number;
if (x) {
}
    `,
    '(x: bigint) => !x;',
    '<T extends number>(x: T) => (x ? 1 : 0);',

    // nullable object in boolean context
    `
declare const x: null | object;
if (x) {
}
    `,
    '(x?: { a: any }) => !x;',
    '<T extends {} | null | undefined>(x: T) => (x ? 1 : 0);',

    // nullable boolean in boolean context
    {
      options: [{ allowNullableBoolean: true }],
      code: `
        declare const x: boolean | null;
        if (x) {
        }
      `,
    },
    {
      options: [{ allowNullableBoolean: true }],
      code: `
        (x?: boolean) => !x;
      `,
    },
    {
      options: [{ allowNullableBoolean: true }],
      code: `
        <T extends boolean | null | undefined>(x: T) => (x ? 1 : 0);
      `,
    },

    // nullable string in boolean context
    {
      options: [{ allowNullableString: true }],
      code: `
        declare const x: string | null;
        if (x) {
        }
      `,
    },
    {
      options: [{ allowNullableString: true }],
      code: `
        (x?: string) => !x;
      `,
    },
    {
      options: [{ allowNullableString: true }],
      code: `
        <T extends string | null | undefined>(x: T) => (x ? 1 : 0);
      `,
    },

    // nullable number in boolean context
    {
      options: [{ allowNullableNumber: true }],
      code: `
        declare const x: number | null;
        if (x) {
        }
      `,
    },
    {
      options: [{ allowNullableNumber: true }],
      code: `
        (x?: number) => !x;
      `,
    },
    {
      options: [{ allowNullableNumber: true }],
      code: `
        <T extends number | null | undefined>(x: T) => (x ? 1 : 0);
      `,
    },

    // any in boolean context
    {
      options: [{ allowAny: true }],
      code: `
        declare const x: any;
        if (x) {
        }
      `,
    },
    {
      options: [{ allowAny: true }],
      code: `
        x => !x;
      `,
    },
    {
      options: [{ allowAny: true }],
      code: `
        <T extends any>(x: T) => (x ? 1 : 0);
      `,
    },

    // logical operator
    {
      options: [{ allowString: true, allowNumber: true }],
      code: `
        1 && true && 'x' && {};
      `,
    },
    {
      options: [{ allowString: true, allowNumber: true }],
      code: `
        let x = 0 || false || '' || null;
      `,
    },
    {
      options: [{ allowString: true, allowNumber: true }],
      code: `
        if (1 && true && 'x') void 0;
      `,
    },
    {
      options: [{ allowString: true, allowNumber: true }],
      code: `
        if (0 || false || '') void 0;
      `,
    },
    {
      options: [{ allowString: true, allowNumber: true }],
      code: `
        1 && true && 'x' ? {} : null;
      `,
    },
    {
      options: [{ allowString: true, allowNumber: true }],
      code: `
        0 || false || '' ? null : {};
      `,
    },

    // nullable enum in boolean context
    {
      code: `
        enum ExampleEnum {
          This = 0,
          That = 1,
        }
        const rand = Math.random();
        let theEnum: ExampleEnum | null = null;
        if (rand < 0.3) {
          theEnum = ExampleEnum.This;
        }
        if (theEnum) {
        }
      `,
      options: [{ allowNullableEnum: true }],
    },
    {
      code: `
        enum ExampleEnum {
          This = 0,
          That = 1,
        }
        const rand = Math.random();
        let theEnum: ExampleEnum | null = null;
        if (rand < 0.3) {
          theEnum = ExampleEnum.This;
        }
        if (!theEnum) {
        }
      `,
      options: [{ allowNullableEnum: true }],
    },
    {
      code: `
        enum ExampleEnum {
          This = 1,
          That = 2,
        }
        const rand = Math.random();
        let theEnum: ExampleEnum | null = null;
        if (rand < 0.3) {
          theEnum = ExampleEnum.This;
        }
        if (!theEnum) {
        }
      `,
      options: [{ allowNullableEnum: true }],
    },
    {
      code: `
        enum ExampleEnum {
          This = 'one',
          That = 'two',
        }
        const rand = Math.random();
        let theEnum: ExampleEnum | null = null;
        if (rand < 0.3) {
          theEnum = ExampleEnum.This;
        }
        if (!theEnum) {
        }
      `,
      options: [{ allowNullableEnum: true }],
    },

    // nullable mixed enum in boolean context
    {
      // falsy number and truthy string
      code: `
        enum ExampleEnum {
          This = 0,
          That = 'one',
        }
        (value?: ExampleEnum) => (value ? 1 : 0);
      `,
      options: [{ allowNullableEnum: true }],
    },
    {
      // falsy string and truthy number
      code: `
        enum ExampleEnum {
          This = '',
          That = 1,
        }
        (value?: ExampleEnum) => (!value ? 1 : 0);
      `,
      options: [{ allowNullableEnum: true }],
    },
    {
      // truthy string and truthy number
      code: `
        enum ExampleEnum {
          This = 'this',
          That = 1,
        }
        (value?: ExampleEnum) => (!value ? 1 : 0);
      `,
      options: [{ allowNullableEnum: true }],
    },
    {
      // falsy string and falsy number
      code: `
        enum ExampleEnum {
          This = '',
          That = 0,
        }
        (value?: ExampleEnum) => (!value ? 1 : 0);
      `,
      options: [{ allowNullableEnum: true }],
    },

    {
      code: `
declare const x: string[] | null;
// eslint-disable-next-line
if (x) {
}
      `,
      options: [
        {
          allowRuleToRunWithoutStrictNullChecksIKnowWhatIAmDoing: true,
        },
      ],
      languageOptions: {
        parserOptions: {
          tsconfigRootDir: path.join(rootPath, 'unstrict'),
        },
      },
    },

    `
function f(arg: 'a' | null) {
  if (arg) console.log(arg);
}
    `,
    `
function f(arg: 'a' | 'b' | null) {
  if (arg) console.log(arg);
}
    `,
    {
      code: `
declare const x: 1 | null;
declare const y: 1;
if (x) {
}
if (y) {
}
      `,
      options: [
        {
          allowNumber: true,
        },
      ],
    },
    `
function f(arg: 1 | null) {
  if (arg) console.log(arg);
}
    `,
    `
function f(arg: 1 | 2 | null) {
  if (arg) console.log(arg);
}
    `,
    `
interface Options {
  readonly enableSomething?: true;
}

function f(opts: Options): void {
  if (opts.enableSomething) console.log('Do something');
}
    `,
    `
declare const x: true | null;
if (x) {
}
    `,
    {
      code: `
declare const x: 'a' | null;
declare const y: 'a';
if (x) {
}
if (y) {
}
      `,
      options: [
        {
          allowString: true,
        },
      ],
    },
    `
declare const foo: boolean & { __BRAND: 'Foo' };
if (foo) {
}
    `,
    `
declare const foo: true & { __BRAND: 'Foo' };
if (foo) {
}
    `,
    `
declare const foo: false & { __BRAND: 'Foo' };
if (foo) {
}
    `,
    `
declare function assert(a: number, b: unknown): asserts a;
declare const nullableString: string | null;
declare const boo: boolean;
assert(boo, nullableString);
    `,
    `
declare function assert(a: boolean, b: unknown): asserts b is string;
declare const nullableString: string | null;
declare const boo: boolean;
assert(boo, nullableString);
    `,
    `
declare function assert(a: number, b: unknown): asserts b;
declare const nullableString: string | null;
declare const boo: boolean;
assert(nullableString, boo);
    `,
    `
declare function assert(a: number, b: unknown): asserts b;
declare const nullableString: string | null;
declare const boo: boolean;
assert(...nullableString, nullableString);
    `,
    `
declare function assert(
  this: object,
  a: number,
  b?: unknown,
  c?: unknown,
): asserts c;
declare const nullableString: string | null;
declare const foo: number;
const o: { assert: typeof assert } = {
  assert,
};
o.assert(foo, nullableString);
    `,
    {
      code: `
declare function assert(x: unknown): x is string;
declare const nullableString: string | null;
assert(nullableString);
      `,
    },
    {
      code: `
class ThisAsserter {
  assertThis(this: unknown, arg2: unknown): asserts this {}
}

declare const lol: string | number | unknown | null;

const thisAsserter: ThisAsserter = new ThisAsserter();
thisAsserter.assertThis(lol);
      `,
    },
    {
      code: `
function assert(this: object, a: number, b: unknown): asserts b;
function assert(a: bigint, b: unknown): asserts b;
function assert(this: object, a: string, two: string): asserts two;
function assert(
  this: object,
  a: string,
  assertee: string,
  c: bigint,
  d: object,
): asserts assertee;
function assert(...args: any[]): void;

function assert(...args: any[]) {
  throw new Error('lol');
}

declare const nullableString: string | null;
assert(3 as any, nullableString);
      `,
    },
    // Intentional use of `any` to test a function call with no call signatures.
    `
declare const assert: any;
declare const nullableString: string | null;
assert(nullableString);
    `,
    // Coverage for absent "test expression".
    // Ensure that no crash or false positive occurs
    `
      for (let x = 0; ; x++) {
        break;
      }
    `,
  ],

  invalid: [
    // non-boolean in RHS of test expression
    ...batchedSingleLineTests<MessageId, Options>({
      options: [
        { allowString: false, allowNumber: false, allowNullableObject: false },
      ],
      code: noFormat`
        if (true && (1 + 1)) {}
        while (false || "a" + "b") {}
        (x: object) => true || false || x ? true : false;
      `,
      errors: [
        {
          messageId: 'conditionErrorNumber',
          line: 2,
          column: 14,
          suggestions: [
            {
              messageId: 'conditionFixCompareZero',
              output: 'if (true && ((1 + 1) !== 0)) {}',
            },
            {
              messageId: 'conditionFixCompareNaN',
              output: 'if (true && (!Number.isNaN((1 + 1)))) {}',
            },
            {
              messageId: 'conditionFixCastBoolean',
              output: 'if (true && (Boolean((1 + 1)))) {}',
            },
          ],
        },
        {
          messageId: 'conditionErrorString',
          line: 3,
          column: 25,
          suggestions: [
            {
              messageId: 'conditionFixCompareStringLength',
              output: '        while (false || (("a" + "b").length > 0)) {}',
            },
            {
              messageId: 'conditionFixCompareEmptyString',
              output: '        while (false || (("a" + "b") !== "")) {}',
            },
            {
              messageId: 'conditionFixCastBoolean',
              output: '        while (false || (Boolean(("a" + "b")))) {}',
            },
          ],
        },
        { messageId: 'conditionErrorObject', line: 4, column: 41 },
      ],
    }),

    // check if all and only the outermost operands are checked
    {
      options: [
        { allowString: false, allowNumber: false, allowNullableObject: false },
      ],
      code: noFormat`if (('' && {}) || (0 && void 0)) { }`,
      output: null,
      errors: [
        {
          messageId: 'conditionErrorString',
          line: 1,
          column: 6,
          suggestions: [
            {
              messageId: 'conditionFixCompareStringLength',
              output: `if (((''.length > 0) && {}) || (0 && void 0)) { }`,
            },
            {
              messageId: 'conditionFixCompareEmptyString',
              output: `if ((('' !== "") && {}) || (0 && void 0)) { }`,
            },
            {
              messageId: 'conditionFixCastBoolean',
              output: `if (((Boolean('')) && {}) || (0 && void 0)) { }`,
            },
          ],
        },
        { messageId: 'conditionErrorObject', line: 1, column: 12 },
        {
          messageId: 'conditionErrorNumber',
          line: 1,
          column: 20,
          suggestions: [
            {
              messageId: 'conditionFixCompareZero',
              output: `if (('' && {}) || ((0 !== 0) && void 0)) { }`,
            },
            {
              messageId: 'conditionFixCompareNaN',
              output: `if (('' && {}) || ((!Number.isNaN(0)) && void 0)) { }`,
            },
            {
              messageId: 'conditionFixCastBoolean',
              output: `if (('' && {}) || ((Boolean(0)) && void 0)) { }`,
            },
          ],
        },
        { messageId: 'conditionErrorNullish', line: 1, column: 25 },
      ],
    },
    {
      options: [
        { allowString: false, allowNumber: false, allowNullableObject: false },
      ],
      code: noFormat`
declare const foo: true & { __BRAND: 'Foo' };
if (('' && foo) || (0 && void 0)) { }
      `,
      output: null,
      errors: [
        {
          messageId: 'conditionErrorString',
          line: 3,
          column: 6,
          suggestions: [
            {
              messageId: 'conditionFixCompareStringLength',
              output: `
declare const foo: true & { __BRAND: 'Foo' };
if (((''.length > 0) && foo) || (0 && void 0)) { }
      `,
            },
            {
              messageId: 'conditionFixCompareEmptyString',
              output: `
declare const foo: true & { __BRAND: 'Foo' };
if ((('' !== "") && foo) || (0 && void 0)) { }
      `,
            },
            {
              messageId: 'conditionFixCastBoolean',
              output: `
declare const foo: true & { __BRAND: 'Foo' };
if (((Boolean('')) && foo) || (0 && void 0)) { }
      `,
            },
          ],
        },
        {
          messageId: 'conditionErrorNumber',
          line: 3,
          column: 21,
          suggestions: [
            {
              messageId: 'conditionFixCompareZero',
              output: `
declare const foo: true & { __BRAND: 'Foo' };
if (('' && foo) || ((0 !== 0) && void 0)) { }
      `,
            },
            {
              messageId: 'conditionFixCompareNaN',
              output: `
declare const foo: true & { __BRAND: 'Foo' };
if (('' && foo) || ((!Number.isNaN(0)) && void 0)) { }
      `,
            },
            {
              messageId: 'conditionFixCastBoolean',
              output: `
declare const foo: true & { __BRAND: 'Foo' };
if (('' && foo) || ((Boolean(0)) && void 0)) { }
      `,
            },
          ],
        },
        { messageId: 'conditionErrorNullish', line: 3, column: 26 },
      ],
    },
    {
      options: [
        { allowString: false, allowNumber: false, allowNullableObject: false },
      ],
      code: noFormat`
declare const foo: false & { __BRAND: 'Foo' };
if (('' && {}) || (foo && void 0)) { }
      `,
      output: null,
      errors: [
        {
          messageId: 'conditionErrorString',
          line: 3,
          column: 6,
          suggestions: [
            {
              messageId: 'conditionFixCompareStringLength',
              output: `
declare const foo: false & { __BRAND: 'Foo' };
if (((''.length > 0) && {}) || (foo && void 0)) { }
      `,
            },
            {
              messageId: 'conditionFixCompareEmptyString',
              output: `
declare const foo: false & { __BRAND: 'Foo' };
if ((('' !== "") && {}) || (foo && void 0)) { }
      `,
            },
            {
              messageId: 'conditionFixCastBoolean',
              output: `
declare const foo: false & { __BRAND: 'Foo' };
if (((Boolean('')) && {}) || (foo && void 0)) { }
      `,
            },
          ],
        },
        { messageId: 'conditionErrorObject', line: 3, column: 12 },
        { messageId: 'conditionErrorNullish', line: 3, column: 27 },
      ],
    },

    // shouldn't check last logical operand when used for control flow
    {
      options: [{ allowString: false, allowNumber: false }],
      code: "'asd' && 123 && [] && null;",
      output: null,
      errors: [
        {
          messageId: 'conditionErrorString',
          line: 1,
          column: 1,
          suggestions: [
            {
              messageId: 'conditionFixCompareStringLength',
              output: "('asd'.length > 0) && 123 && [] && null;",
            },
            {
              messageId: 'conditionFixCompareEmptyString',
              output: '(\'asd\' !== "") && 123 && [] && null;',
            },
            {
              messageId: 'conditionFixCastBoolean',
              output: "(Boolean('asd')) && 123 && [] && null;",
            },
          ],
        },
        {
          messageId: 'conditionErrorNumber',
          line: 1,
          column: 10,
          suggestions: [
            {
              messageId: 'conditionFixCompareZero',
              output: "'asd' && (123 !== 0) && [] && null;",
            },
            {
              messageId: 'conditionFixCompareNaN',
              output: "'asd' && (!Number.isNaN(123)) && [] && null;",
            },
            {
              messageId: 'conditionFixCastBoolean',
              output: "'asd' && (Boolean(123)) && [] && null;",
            },
          ],
        },
        {
          messageId: 'conditionErrorObject',
          line: 1,
          column: 17,
        },
      ],
    },
    {
      options: [{ allowString: false, allowNumber: false }],
      code: "'asd' || 123 || [] || null;",
      output: null,
      errors: [
        {
          messageId: 'conditionErrorString',
          line: 1,
          column: 1,
          suggestions: [
            {
              messageId: 'conditionFixCompareStringLength',
              output: "('asd'.length > 0) || 123 || [] || null;",
            },
            {
              messageId: 'conditionFixCompareEmptyString',
              output: '(\'asd\' !== "") || 123 || [] || null;',
            },
            {
              messageId: 'conditionFixCastBoolean',
              output: "(Boolean('asd')) || 123 || [] || null;",
            },
          ],
        },
        {
          messageId: 'conditionErrorNumber',
          line: 1,
          column: 10,
          suggestions: [
            {
              messageId: 'conditionFixCompareZero',
              output: "'asd' || (123 !== 0) || [] || null;",
            },
            {
              messageId: 'conditionFixCompareNaN',
              output: "'asd' || (!Number.isNaN(123)) || [] || null;",
            },
            {
              messageId: 'conditionFixCastBoolean',
              output: "'asd' || (Boolean(123)) || [] || null;",
            },
          ],
        },
        {
          messageId: 'conditionErrorObject',
          line: 1,
          column: 17,
        },
      ],
    },
    {
      options: [{ allowString: false, allowNumber: false }],
      code: "let x = (1 && 'a' && null) || 0 || '' || {};",
      output: null,
      errors: [
        {
          messageId: 'conditionErrorNumber',
          line: 1,
          column: 10,
          suggestions: [
            {
              messageId: 'conditionFixCompareZero',
              output: "let x = ((1 !== 0) && 'a' && null) || 0 || '' || {};",
            },
            {
              messageId: 'conditionFixCompareNaN',
              output:
                "let x = ((!Number.isNaN(1)) && 'a' && null) || 0 || '' || {};",
            },
            {
              messageId: 'conditionFixCastBoolean',
              output: "let x = ((Boolean(1)) && 'a' && null) || 0 || '' || {};",
            },
          ],
        },
        {
          messageId: 'conditionErrorString',
          line: 1,
          column: 15,
          suggestions: [
            {
              messageId: 'conditionFixCompareStringLength',
              output:
                "let x = (1 && ('a'.length > 0) && null) || 0 || '' || {};",
            },
            {
              messageId: 'conditionFixCompareEmptyString',
              output: "let x = (1 && ('a' !== \"\") && null) || 0 || '' || {};",
            },
            {
              messageId: 'conditionFixCastBoolean',
              output: "let x = (1 && (Boolean('a')) && null) || 0 || '' || {};",
            },
          ],
        },
        {
          messageId: 'conditionErrorNullish',
          line: 1,
          column: 22,
        },
        {
          messageId: 'conditionErrorNumber',
          line: 1,
          column: 31,
          suggestions: [
            {
              messageId: 'conditionFixCompareZero',
              output: "let x = (1 && 'a' && null) || (0 !== 0) || '' || {};",
            },
            {
              messageId: 'conditionFixCompareNaN',
              output:
                "let x = (1 && 'a' && null) || (!Number.isNaN(0)) || '' || {};",
            },
            {
              messageId: 'conditionFixCastBoolean',
              output: "let x = (1 && 'a' && null) || (Boolean(0)) || '' || {};",
            },
          ],
        },
        {
          messageId: 'conditionErrorString',
          line: 1,
          column: 36,
          suggestions: [
            {
              messageId: 'conditionFixCompareStringLength',
              output:
                "let x = (1 && 'a' && null) || 0 || (''.length > 0) || {};",
            },
            {
              messageId: 'conditionFixCompareEmptyString',
              output: "let x = (1 && 'a' && null) || 0 || ('' !== \"\") || {};",
            },
            {
              messageId: 'conditionFixCastBoolean',
              output: "let x = (1 && 'a' && null) || 0 || (Boolean('')) || {};",
            },
          ],
        },
      ],
    },
    {
      options: [{ allowString: false, allowNumber: false }],
      code: "return (1 || 'a' || null) && 0 && '' && {};",
      output: null,
      errors: [
        {
          messageId: 'conditionErrorNumber',
          line: 1,
          column: 9,
          suggestions: [
            {
              messageId: 'conditionFixCompareZero',
              output: "return ((1 !== 0) || 'a' || null) && 0 && '' && {};",
            },
            {
              messageId: 'conditionFixCompareNaN',
              output:
                "return ((!Number.isNaN(1)) || 'a' || null) && 0 && '' && {};",
            },
            {
              messageId: 'conditionFixCastBoolean',
              output: "return ((Boolean(1)) || 'a' || null) && 0 && '' && {};",
            },
          ],
        },
        {
          messageId: 'conditionErrorString',
          line: 1,
          column: 14,
          suggestions: [
            {
              messageId: 'conditionFixCompareStringLength',
              output:
                "return (1 || ('a'.length > 0) || null) && 0 && '' && {};",
            },
            {
              messageId: 'conditionFixCompareEmptyString',
              output: "return (1 || ('a' !== \"\") || null) && 0 && '' && {};",
            },
            {
              messageId: 'conditionFixCastBoolean',
              output: "return (1 || (Boolean('a')) || null) && 0 && '' && {};",
            },
          ],
        },
        {
          messageId: 'conditionErrorNullish',
          line: 1,
          column: 21,
        },
        {
          messageId: 'conditionErrorNumber',
          line: 1,
          column: 30,
          suggestions: [
            {
              messageId: 'conditionFixCompareZero',
              output: "return (1 || 'a' || null) && (0 !== 0) && '' && {};",
            },
            {
              messageId: 'conditionFixCompareNaN',
              output:
                "return (1 || 'a' || null) && (!Number.isNaN(0)) && '' && {};",
            },
            {
              messageId: 'conditionFixCastBoolean',
              output: "return (1 || 'a' || null) && (Boolean(0)) && '' && {};",
            },
          ],
        },
        {
          messageId: 'conditionErrorString',
          line: 1,
          column: 35,
          suggestions: [
            {
              messageId: 'conditionFixCompareStringLength',
              output:
                "return (1 || 'a' || null) && 0 && (''.length > 0) && {};",
            },
            {
              messageId: 'conditionFixCompareEmptyString',
              output: "return (1 || 'a' || null) && 0 && ('' !== \"\") && {};",
            },
            {
              messageId: 'conditionFixCastBoolean',
              output: "return (1 || 'a' || null) && 0 && (Boolean('')) && {};",
            },
          ],
        },
      ],
    },
    {
      options: [{ allowString: false, allowNumber: false }],
      code: "console.log((1 && []) || ('a' && {}));",
      output: null,
      errors: [
        {
          messageId: 'conditionErrorNumber',
          line: 1,
          column: 14,
          suggestions: [
            {
              messageId: 'conditionFixCompareZero',
              output: "console.log(((1 !== 0) && []) || ('a' && {}));",
            },
            {
              messageId: 'conditionFixCompareNaN',
              output: "console.log(((!Number.isNaN(1)) && []) || ('a' && {}));",
            },
            {
              messageId: 'conditionFixCastBoolean',
              output: "console.log(((Boolean(1)) && []) || ('a' && {}));",
            },
          ],
        },
        {
          messageId: 'conditionErrorObject',
          line: 1,
          column: 19,
        },
        {
          messageId: 'conditionErrorString',
          line: 1,
          column: 27,
          suggestions: [
            {
              messageId: 'conditionFixCompareStringLength',
              output: "console.log((1 && []) || (('a'.length > 0) && {}));",
            },
            {
              messageId: 'conditionFixCompareEmptyString',
              output: 'console.log((1 && []) || ((\'a\' !== "") && {}));',
            },
            {
              messageId: 'conditionFixCastBoolean',
              output: "console.log((1 && []) || ((Boolean('a')) && {}));",
            },
          ],
        },
      ],
    },

    // should check all logical operands when used in a condition
    {
      options: [{ allowString: false, allowNumber: false }],
      code: "if ((1 && []) || ('a' && {})) void 0;",
      output: null,
      errors: [
        {
          messageId: 'conditionErrorNumber',
          line: 1,
          column: 6,
          suggestions: [
            {
              messageId: 'conditionFixCompareZero',
              output: "if (((1 !== 0) && []) || ('a' && {})) void 0;",
            },
            {
              messageId: 'conditionFixCompareNaN',
              output: "if (((!Number.isNaN(1)) && []) || ('a' && {})) void 0;",
            },
            {
              messageId: 'conditionFixCastBoolean',
              output: "if (((Boolean(1)) && []) || ('a' && {})) void 0;",
            },
          ],
        },
        {
          messageId: 'conditionErrorObject',
          line: 1,
          column: 11,
        },
        {
          messageId: 'conditionErrorString',
          line: 1,
          column: 19,
          suggestions: [
            {
              messageId: 'conditionFixCompareStringLength',
              output: "if ((1 && []) || (('a'.length > 0) && {})) void 0;",
            },
            {
              messageId: 'conditionFixCompareEmptyString',
              output: 'if ((1 && []) || ((\'a\' !== "") && {})) void 0;',
            },
            {
              messageId: 'conditionFixCastBoolean',
              output: "if ((1 && []) || ((Boolean('a')) && {})) void 0;",
            },
          ],
        },
        {
          messageId: 'conditionErrorObject',
          line: 1,
          column: 26,
        },
      ],
    },
    {
      options: [{ allowString: false, allowNumber: false }],
      code: "let x = null || 0 || 'a' || [] ? {} : undefined;",
      output: null,
      errors: [
        {
          messageId: 'conditionErrorNullish',
          line: 1,
          column: 9,
        },
        {
          messageId: 'conditionErrorNumber',
          line: 1,
          column: 17,
          suggestions: [
            {
              messageId: 'conditionFixCompareZero',
              output:
                "let x = null || (0 !== 0) || 'a' || [] ? {} : undefined;",
            },
            {
              messageId: 'conditionFixCompareNaN',
              output:
                "let x = null || (!Number.isNaN(0)) || 'a' || [] ? {} : undefined;",
            },
            {
              messageId: 'conditionFixCastBoolean',
              output:
                "let x = null || (Boolean(0)) || 'a' || [] ? {} : undefined;",
            },
          ],
        },
        {
          messageId: 'conditionErrorString',
          line: 1,
          column: 22,
          suggestions: [
            {
              messageId: 'conditionFixCompareStringLength',
              output:
                "let x = null || 0 || ('a'.length > 0) || [] ? {} : undefined;",
            },
            {
              messageId: 'conditionFixCompareEmptyString',
              output:
                'let x = null || 0 || (\'a\' !== "") || [] ? {} : undefined;',
            },
            {
              messageId: 'conditionFixCastBoolean',
              output:
                "let x = null || 0 || (Boolean('a')) || [] ? {} : undefined;",
            },
          ],
        },
        {
          messageId: 'conditionErrorObject',
          line: 1,
          column: 29,
        },
      ],
    },
    {
      options: [{ allowString: false, allowNumber: false }],
      code: "return !(null || 0 || 'a' || []);",
      output: null,
      errors: [
        {
          messageId: 'conditionErrorNullish',
          line: 1,
          column: 10,
        },
        {
          messageId: 'conditionErrorNumber',
          line: 1,
          column: 18,
          suggestions: [
            {
              messageId: 'conditionFixCompareZero',
              output: "return !(null || (0 !== 0) || 'a' || []);",
            },
            {
              messageId: 'conditionFixCompareNaN',
              output: "return !(null || (!Number.isNaN(0)) || 'a' || []);",
            },
            {
              messageId: 'conditionFixCastBoolean',
              output: "return !(null || (Boolean(0)) || 'a' || []);",
            },
          ],
        },
        {
          messageId: 'conditionErrorString',
          line: 1,
          column: 23,
          suggestions: [
            {
              messageId: 'conditionFixCompareStringLength',
              output: "return !(null || 0 || ('a'.length > 0) || []);",
            },
            {
              messageId: 'conditionFixCompareEmptyString',
              output: 'return !(null || 0 || (\'a\' !== "") || []);',
            },
            {
              messageId: 'conditionFixCastBoolean',
              output: "return !(null || 0 || (Boolean('a')) || []);",
            },
          ],
        },
        {
          messageId: 'conditionErrorObject',
          line: 1,
          column: 30,
        },
      ],
    },

    // nullish in boolean context
    ...batchedSingleLineTests<MessageId, Options>({
      code: noFormat`
        null || {};
        undefined && [];
        declare const x: null; if (x) {}
        (x: undefined) => !x;
        <T extends null | undefined>(x: T) => x ? 1 : 0;
        <T extends null>(x: T) => x ? 1 : 0;
        <T extends undefined>(x: T) => x ? 1 : 0;
      `,
      errors: [
        { messageId: 'conditionErrorNullish', line: 2, column: 1 },
        { messageId: 'conditionErrorNullish', line: 3, column: 9 },
        { messageId: 'conditionErrorNullish', line: 4, column: 36 },
        { messageId: 'conditionErrorNullish', line: 5, column: 28 },
        { messageId: 'conditionErrorNullish', line: 6, column: 47 },
        { messageId: 'conditionErrorNullish', line: 7, column: 35 },
        { messageId: 'conditionErrorNullish', line: 8, column: 40 },
      ],
    }),

    // object in boolean context
    ...batchedSingleLineTests<MessageId, Options>({
      code: noFormat`
        [] || 1;
        ({}) && "a";
        declare const x: symbol; if (x) {}
        (x: () => void) => !x;
        <T extends object>(x: T) => x ? 1 : 0;
        <T extends Object | Function>(x: T) => x ? 1 : 0;
        <T extends { a: number }>(x: T) => x ? 1 : 0;
        <T extends () => void>(x: T) => x ? 1 : 0;
      `,
      errors: [
        { messageId: 'conditionErrorObject', line: 2, column: 1 },
        { messageId: 'conditionErrorObject', line: 3, column: 10 },
        { messageId: 'conditionErrorObject', line: 4, column: 38 },
        { messageId: 'conditionErrorObject', line: 5, column: 29 },
        { messageId: 'conditionErrorObject', line: 6, column: 37 },
        { messageId: 'conditionErrorObject', line: 7, column: 48 },
        { messageId: 'conditionErrorObject', line: 8, column: 44 },
        { messageId: 'conditionErrorObject', line: 9, column: 41 },
      ],
    }),

    // string in boolean context
    ...batchedSingleLineTests<MessageId, Options>({
      options: [{ allowString: false }],
      code: noFormat`
        while ("") {}
        for (; "foo";) {}
        declare const x: string; if (x) {}
        (x: string) => (!x);
        <T extends string>(x: T) => x ? 1 : 0;
      `,
      errors: [
        {
          messageId: 'conditionErrorString',
          line: 2,
          column: 8,
          suggestions: [
            {
              messageId: 'conditionFixCompareStringLength',
              output: `while ("".length > 0) {}`,
            },
            {
              messageId: 'conditionFixCompareEmptyString',
              output: `while ("" !== "") {}`,
            },
            {
              messageId: 'conditionFixCastBoolean',
              output: `while (Boolean("")) {}`,
            },
          ],
        },
        {
          messageId: 'conditionErrorString',
          line: 3,
          column: 16,
          suggestions: [
            {
              messageId: 'conditionFixCompareStringLength',
              output: `        for (; "foo".length > 0;) {}`,
            },
            {
              messageId: 'conditionFixCompareEmptyString',
              output: `        for (; "foo" !== "";) {}`,
            },
            {
              messageId: 'conditionFixCastBoolean',
              output: `        for (; Boolean("foo");) {}`,
            },
          ],
        },
        {
          messageId: 'conditionErrorString',
          line: 4,
          column: 38,
          suggestions: [
            {
              messageId: 'conditionFixCompareStringLength',
              output: `        declare const x: string; if (x.length > 0) {}`,
            },
            {
              messageId: 'conditionFixCompareEmptyString',
              output: `        declare const x: string; if (x !== "") {}`,
            },
            {
              messageId: 'conditionFixCastBoolean',
              output: `        declare const x: string; if (Boolean(x)) {}`,
            },
          ],
        },
        {
          messageId: 'conditionErrorString',
          line: 5,
          column: 26,
          suggestions: [
            {
              messageId: 'conditionFixCompareStringLength',
              output: `        (x: string) => (x.length === 0);`,
            },
            {
              messageId: 'conditionFixCompareEmptyString',
              output: `        (x: string) => (x === "");`,
            },
            {
              messageId: 'conditionFixCastBoolean',
              output: `        (x: string) => (!Boolean(x));`,
            },
          ],
        },
        {
          messageId: 'conditionErrorString',
          line: 6,
          column: 37,
          suggestions: [
            {
              messageId: 'conditionFixCompareStringLength',
              output: `        <T extends string>(x: T) => (x.length > 0) ? 1 : 0;`,
            },
            {
              messageId: 'conditionFixCompareEmptyString',
              output: `        <T extends string>(x: T) => (x !== "") ? 1 : 0;`,
            },
            {
              messageId: 'conditionFixCastBoolean',
              output: `        <T extends string>(x: T) => (Boolean(x)) ? 1 : 0;`,
            },
          ],
        },
      ],
    }),

    // number in boolean context
    ...batchedSingleLineTests<MessageId, Options>({
      options: [{ allowNumber: false }],
      code: noFormat`
        while (0n) {}
        for (; 123;) {}
        declare const x: number; if (x) {}
        (x: bigint) => !x;
        <T extends number>(x: T) => (x) ? 1 : 0;
        ![]["length"]; // doesn't count as array.length when computed
        declare const a: any[] & { notLength: number }; if (a.notLength) {}
      `,
      errors: [
        {
          messageId: 'conditionErrorNumber',
          line: 2,
          column: 8,
          suggestions: [
            {
              messageId: 'conditionFixCompareZero',
              // TODO: fix compare zero suggestion for bigint
              output: `while (0n !== 0) {}`,
            },
            {
              // TODO: remove check NaN suggestion for bigint
              messageId: 'conditionFixCompareNaN',
              output: `while (!Number.isNaN(0n)) {}`,
            },
            {
              messageId: 'conditionFixCastBoolean',
              output: `while (Boolean(0n)) {}`,
            },
          ],
        },
        {
          messageId: 'conditionErrorNumber',
          line: 3,
          column: 16,
          suggestions: [
            {
              messageId: 'conditionFixCompareZero',
              output: `        for (; 123 !== 0;) {}`,
            },
            {
              messageId: 'conditionFixCompareNaN',
              output: `        for (; !Number.isNaN(123);) {}`,
            },
            {
              messageId: 'conditionFixCastBoolean',
              output: `        for (; Boolean(123);) {}`,
            },
          ],
        },
        {
          messageId: 'conditionErrorNumber',
          line: 4,
          column: 38,
          suggestions: [
            {
              messageId: 'conditionFixCompareZero',
              output: `        declare const x: number; if (x !== 0) {}`,
            },
            {
              messageId: 'conditionFixCompareNaN',
              output: `        declare const x: number; if (!Number.isNaN(x)) {}`,
            },
            {
              messageId: 'conditionFixCastBoolean',
              output: `        declare const x: number; if (Boolean(x)) {}`,
            },
          ],
        },
        {
          messageId: 'conditionErrorNumber',
          line: 5,
          column: 25,
          suggestions: [
            {
              messageId: 'conditionFixCompareZero',
              // TODO: fix compare zero suggestion for bigint
              output: `        (x: bigint) => x === 0;`,
            },
            {
              // TODO: remove check NaN suggestion for bigint
              messageId: 'conditionFixCompareNaN',
              output: `        (x: bigint) => Number.isNaN(x);`,
            },
            {
              messageId: 'conditionFixCastBoolean',
              output: `        (x: bigint) => !Boolean(x);`,
            },
          ],
        },
        {
          messageId: 'conditionErrorNumber',
          line: 6,
          column: 38,
          suggestions: [
            {
              messageId: 'conditionFixCompareZero',
              output: `        <T extends number>(x: T) => (x !== 0) ? 1 : 0;`,
            },
            {
              messageId: 'conditionFixCompareNaN',
              output: `        <T extends number>(x: T) => (!Number.isNaN(x)) ? 1 : 0;`,
            },
            {
              messageId: 'conditionFixCastBoolean',
              output: `        <T extends number>(x: T) => (Boolean(x)) ? 1 : 0;`,
            },
          ],
        },
        {
          messageId: 'conditionErrorNumber',
          line: 7,
          column: 10,
          suggestions: [
            {
              messageId: 'conditionFixCompareZero',
              output: `        []["length"] === 0; // doesn't count as array.length when computed`,
            },
            {
              messageId: 'conditionFixCompareNaN',
              output: `        Number.isNaN([]["length"]); // doesn't count as array.length when computed`,
            },
            {
              messageId: 'conditionFixCastBoolean',
              output: `        !Boolean([]["length"]); // doesn't count as array.length when computed`,
            },
          ],
        },
        {
          messageId: 'conditionErrorNumber',
          line: 8,
          column: 61,
          suggestions: [
            {
              messageId: 'conditionFixCompareZero',
              output: `        declare const a: any[] & { notLength: number }; if (a.notLength !== 0) {}`,
            },
            {
              messageId: 'conditionFixCompareNaN',
              output: `        declare const a: any[] & { notLength: number }; if (!Number.isNaN(a.notLength)) {}`,
            },
            {
              messageId: 'conditionFixCastBoolean',
              output: `        declare const a: any[] & { notLength: number }; if (Boolean(a.notLength)) {}`,
            },
          ],
        },
      ],
    }),

    // number (array.length) in boolean context
    ...batchedSingleLineTests<MessageId, Options>({
      options: [{ allowNumber: false }],
      code: noFormat`
        if (![].length) {}
        (a: number[]) => a.length && "..."
        <T extends unknown[]>(...a: T) => a.length || "empty";
      `,
      errors: [
        { messageId: 'conditionErrorNumber', line: 2, column: 6 },
        { messageId: 'conditionErrorNumber', line: 3, column: 26 },
        { messageId: 'conditionErrorNumber', line: 4, column: 43 },
      ],
      output: `
        if ([].length === 0) {}
        (a: number[]) => (a.length > 0) && "..."
        <T extends unknown[]>(...a: T) => (a.length > 0) || "empty";
      `,
    }),

    // mixed `string | number` value in boolean context
    ...batchedSingleLineTests<MessageId, Options>({
      options: [{ allowString: true, allowNumber: true }],
      code: noFormat`
        declare const x: string | number; if (x) {}
        (x: bigint | string) => !x;
        <T extends number | bigint | string>(x: T) => x ? 1 : 0;
      `,
      errors: [
        { messageId: 'conditionErrorOther', line: 2, column: 39 },
        { messageId: 'conditionErrorOther', line: 3, column: 34 },
        { messageId: 'conditionErrorOther', line: 4, column: 55 },
      ],
    }),

    // nullable boolean in boolean context
    ...batchedSingleLineTests<MessageId, Options>({
      options: [{ allowNullableBoolean: false }],
      code: noFormat`
        declare const x: boolean | null; if (x) {}
        (x?: boolean) => !x;
        <T extends boolean | null | undefined>(x: T) => x ? 1 : 0;
      `,
      errors: [
        {
          messageId: 'conditionErrorNullableBoolean',
          line: 2,
          column: 38,
          suggestions: [
            {
              messageId: 'conditionFixDefaultFalse',
              output: `declare const x: boolean | null; if (x ?? false) {}`,
            },
            {
              messageId: 'conditionFixCompareTrue',
              output: `declare const x: boolean | null; if (x === true) {}`,
            },
          ],
        },
        {
          messageId: 'conditionErrorNullableBoolean',
          line: 3,
          column: 27,
          suggestions: [
            {
              messageId: 'conditionFixDefaultFalse',
              output: `        (x?: boolean) => !(x ?? false);`,
            },
            {
              messageId: 'conditionFixCompareFalse',
              output: `        (x?: boolean) => x === false;`,
            },
          ],
        },
        {
          messageId: 'conditionErrorNullableBoolean',
          line: 4,
          column: 57,
          suggestions: [
            {
              messageId: 'conditionFixDefaultFalse',
              output: `        <T extends boolean | null | undefined>(x: T) => (x ?? false) ? 1 : 0;`,
            },
            {
              messageId: 'conditionFixCompareTrue',
              output: `        <T extends boolean | null | undefined>(x: T) => (x === true) ? 1 : 0;`,
            },
          ],
        },
      ],
    }),

    // nullable object in boolean context
    ...batchedSingleLineTests<MessageId, Options>({
      options: [{ allowNullableObject: false }],
      code: noFormat`
        declare const x: object | null; if (x) {}
        (x?: { a: number }) => !x;
        <T extends {} | null | undefined>(x: T) => x ? 1 : 0;
      `,
      errors: [
        {
          messageId: 'conditionErrorNullableObject',
          line: 2,
          column: 37,
          suggestions: [
            {
              messageId: 'conditionFixCompareNullish',
              output: 'declare const x: object | null; if (x != null) {}',
            },
          ],
        },
        {
          messageId: 'conditionErrorNullableObject',
          line: 3,
          column: 33,
          suggestions: [
            {
              messageId: 'conditionFixCompareNullish',
              output: `        (x?: { a: number }) => x == null;`,
            },
          ],
        },
        {
          messageId: 'conditionErrorNullableObject',
          line: 4,
          column: 52,
          suggestions: [
            {
              messageId: 'conditionFixCompareNullish',
              output: `        <T extends {} | null | undefined>(x: T) => (x != null) ? 1 : 0;`,
            },
          ],
        },
      ],
    }),

    // nullable string in boolean context
    ...batchedSingleLineTests<MessageId, Options>({
      code: noFormat`
        declare const x: string | null; if (x) {}
        (x?: string) => !x;
        <T extends string | null | undefined>(x: T) => x ? 1 : 0;
        function foo(x: '' | 'bar' | null) { if (!x) {} }
      `,
      errors: [
        {
          messageId: 'conditionErrorNullableString',
          line: 2,
          column: 37,
          suggestions: [
            {
              messageId: 'conditionFixCompareNullish',
              output: 'declare const x: string | null; if (x != null) {}',
            },
            {
              messageId: 'conditionFixDefaultEmptyString',
              output: 'declare const x: string | null; if (x ?? "") {}',
            },
            {
              messageId: 'conditionFixCastBoolean',
              output: 'declare const x: string | null; if (Boolean(x)) {}',
            },
          ],
        },
        {
          messageId: 'conditionErrorNullableString',
          line: 3,
          column: 26,
          suggestions: [
            {
              messageId: 'conditionFixCompareNullish',
              output: '        (x?: string) => x == null;',
            },
            {
              messageId: 'conditionFixDefaultEmptyString',
              output: '        (x?: string) => !(x ?? "");',
            },
            {
              messageId: 'conditionFixCastBoolean',
              output: '        (x?: string) => !Boolean(x);',
            },
          ],
        },
        {
          messageId: 'conditionErrorNullableString',
          line: 4,
          column: 56,
          suggestions: [
            {
              messageId: 'conditionFixCompareNullish',
              output:
                '        <T extends string | null | undefined>(x: T) => (x != null) ? 1 : 0;',
            },
            {
              messageId: 'conditionFixDefaultEmptyString',
              output:
                '        <T extends string | null | undefined>(x: T) => (x ?? "") ? 1 : 0;',
            },
            {
              messageId: 'conditionFixCastBoolean',
              output:
                '        <T extends string | null | undefined>(x: T) => (Boolean(x)) ? 1 : 0;',
            },
          ],
        },
        {
          messageId: 'conditionErrorNullableString',
          line: 5,
          column: 51,
          suggestions: [
            {
              messageId: 'conditionFixCompareNullish',
              output:
                "        function foo(x: '' | 'bar' | null) { if (x == null) {} }",
            },
            {
              messageId: 'conditionFixDefaultEmptyString',
              output:
                "        function foo(x: '' | 'bar' | null) { if (!(x ?? \"\")) {} }",
            },
            {
              messageId: 'conditionFixCastBoolean',
              output:
                "        function foo(x: '' | 'bar' | null) { if (!Boolean(x)) {} }",
            },
          ],
        },
      ],
    }),

    // nullable number in boolean context
    ...batchedSingleLineTests<MessageId, Options>({
      code: noFormat`
        declare const x: number | null; if (x) {}
        (x?: number) => !x;
        <T extends number | null | undefined>(x: T) => x ? 1 : 0;
        function foo(x: 0 | 1 | null) { if (!x) {} }
      `,
      errors: [
        {
          messageId: 'conditionErrorNullableNumber',
          line: 2,
          column: 37,
          suggestions: [
            {
              messageId: 'conditionFixCompareNullish',
              output: 'declare const x: number | null; if (x != null) {}',
            },
            {
              messageId: 'conditionFixDefaultZero',
              output: 'declare const x: number | null; if (x ?? 0) {}',
            },
            {
              messageId: 'conditionFixCastBoolean',
              output: 'declare const x: number | null; if (Boolean(x)) {}',
            },
          ],
        },
        {
          messageId: 'conditionErrorNullableNumber',
          line: 3,
          column: 26,
          suggestions: [
            {
              messageId: 'conditionFixCompareNullish',
              output: '        (x?: number) => x == null;',
            },
            {
              messageId: 'conditionFixDefaultZero',
              output: '        (x?: number) => !(x ?? 0);',
            },
            {
              messageId: 'conditionFixCastBoolean',
              output: '        (x?: number) => !Boolean(x);',
            },
          ],
        },
        {
          messageId: 'conditionErrorNullableNumber',
          line: 4,
          column: 56,
          suggestions: [
            {
              messageId: 'conditionFixCompareNullish',
              output:
                '        <T extends number | null | undefined>(x: T) => (x != null) ? 1 : 0;',
            },
            {
              messageId: 'conditionFixDefaultZero',
              output:
                '        <T extends number | null | undefined>(x: T) => (x ?? 0) ? 1 : 0;',
            },
            {
              messageId: 'conditionFixCastBoolean',
              output:
                '        <T extends number | null | undefined>(x: T) => (Boolean(x)) ? 1 : 0;',
            },
          ],
        },
        {
          messageId: 'conditionErrorNullableNumber',
          line: 5,
          column: 46,
          suggestions: [
            {
              messageId: 'conditionFixCompareNullish',
              output:
                '        function foo(x: 0 | 1 | null) { if (x == null) {} }',
            },
            {
              messageId: 'conditionFixDefaultZero',
              output:
                '        function foo(x: 0 | 1 | null) { if (!(x ?? 0)) {} }',
            },
            {
              messageId: 'conditionFixCastBoolean',
              output:
                '        function foo(x: 0 | 1 | null) { if (!Boolean(x)) {} }',
            },
          ],
        },
      ],
    }),

    // nullable enum in boolean context
    {
      options: [{ allowNullableEnum: false }],
      code: `
        enum ExampleEnum {
          This = 0,
          That = 1,
        }
        const theEnum = Math.random() < 0.3 ? ExampleEnum.This : null;
        if (theEnum) {
        }
      `,
      errors: [
        {
          line: 7,
          column: 13,
          messageId: 'conditionErrorNullableEnum',
          endLine: 7,
          endColumn: 20,
        },
      ],
      output: `
        enum ExampleEnum {
          This = 0,
          That = 1,
        }
        const theEnum = Math.random() < 0.3 ? ExampleEnum.This : null;
        if (theEnum != null) {
        }
      `,
    },
    {
      options: [{ allowNullableEnum: false }],
      code: `
        enum ExampleEnum {
          This = 0,
          That = 1,
        }
        const theEnum = Math.random() < 0.3 ? ExampleEnum.This : null;
        if (!theEnum) {
        }
      `,
      errors: [
        {
          line: 7,
          column: 14,
          messageId: 'conditionErrorNullableEnum',
          endLine: 7,
          endColumn: 21,
        },
      ],
      output: `
        enum ExampleEnum {
          This = 0,
          That = 1,
        }
        const theEnum = Math.random() < 0.3 ? ExampleEnum.This : null;
        if (theEnum == null) {
        }
      `,
    },
    {
      options: [{ allowNullableEnum: false }],
      code: `
        enum ExampleEnum {
          This,
          That,
        }
        const theEnum = Math.random() < 0.3 ? ExampleEnum.This : null;
        if (!theEnum) {
        }
      `,
      errors: [
        {
          line: 7,
          column: 14,
          messageId: 'conditionErrorNullableEnum',
          endLine: 7,
          endColumn: 21,
        },
      ],
      output: `
        enum ExampleEnum {
          This,
          That,
        }
        const theEnum = Math.random() < 0.3 ? ExampleEnum.This : null;
        if (theEnum == null) {
        }
      `,
    },
    {
      options: [{ allowNullableEnum: false }],
      code: `
        enum ExampleEnum {
          This = '',
          That = 'a',
        }
        const theEnum = Math.random() < 0.3 ? ExampleEnum.This : null;
        if (!theEnum) {
        }
      `,
      errors: [
        {
          line: 7,
          column: 14,
          messageId: 'conditionErrorNullableEnum',
          endLine: 7,
          endColumn: 21,
        },
      ],
      output: `
        enum ExampleEnum {
          This = '',
          That = 'a',
        }
        const theEnum = Math.random() < 0.3 ? ExampleEnum.This : null;
        if (theEnum == null) {
        }
      `,
    },
    {
      options: [{ allowNullableEnum: false }],
      code: `
        enum ExampleEnum {
          This = '',
          That = 0,
        }
        const theEnum = Math.random() < 0.3 ? ExampleEnum.This : null;
        if (!theEnum) {
        }
      `,
      errors: [
        {
          line: 7,
          column: 14,
          messageId: 'conditionErrorNullableEnum',
          endLine: 7,
          endColumn: 21,
        },
      ],
      output: `
        enum ExampleEnum {
          This = '',
          That = 0,
        }
        const theEnum = Math.random() < 0.3 ? ExampleEnum.This : null;
        if (theEnum == null) {
        }
      `,
    },
    {
      options: [{ allowNullableEnum: false }],
      code: `
        enum ExampleEnum {
          This = 'one',
          That = 'two',
        }
        const theEnum = Math.random() < 0.3 ? ExampleEnum.This : null;
        if (!theEnum) {
        }
      `,
      errors: [
        {
          line: 7,
          column: 14,
          messageId: 'conditionErrorNullableEnum',
          endLine: 7,
          endColumn: 21,
        },
      ],
      output: `
        enum ExampleEnum {
          This = 'one',
          That = 'two',
        }
        const theEnum = Math.random() < 0.3 ? ExampleEnum.This : null;
        if (theEnum == null) {
        }
      `,
    },
    {
      options: [{ allowNullableEnum: false }],
      code: `
        enum ExampleEnum {
          This = 1,
          That = 2,
        }
        const theEnum = Math.random() < 0.3 ? ExampleEnum.This : null;
        if (!theEnum) {
        }
      `,
      errors: [
        {
          line: 7,
          column: 14,
          messageId: 'conditionErrorNullableEnum',
          endLine: 7,
          endColumn: 21,
        },
      ],
      output: `
        enum ExampleEnum {
          This = 1,
          That = 2,
        }
        const theEnum = Math.random() < 0.3 ? ExampleEnum.This : null;
        if (theEnum == null) {
        }
      `,
    },

    // nullable mixed enum in boolean context
    {
      // falsy number and truthy string
      options: [{ allowNullableEnum: false }],
      code: `
        enum ExampleEnum {
          This = 0,
          That = 'one',
        }
        (value?: ExampleEnum) => (value ? 1 : 0);
      `,
      errors: [
        {
          line: 6,
          column: 35,
          messageId: 'conditionErrorNullableEnum',
          endLine: 6,
          endColumn: 40,
        },
      ],
      output: `
        enum ExampleEnum {
          This = 0,
          That = 'one',
        }
        (value?: ExampleEnum) => ((value != null) ? 1 : 0);
      `,
    },
    {
      // falsy string and truthy number
      options: [{ allowNullableEnum: false }],
      code: `
        enum ExampleEnum {
          This = '',
          That = 1,
        }
        (value?: ExampleEnum) => (!value ? 1 : 0);
      `,
      errors: [
        {
          line: 6,
          column: 36,
          messageId: 'conditionErrorNullableEnum',
          endLine: 6,
          endColumn: 41,
        },
      ],
      output: `
        enum ExampleEnum {
          This = '',
          That = 1,
        }
        (value?: ExampleEnum) => ((value == null) ? 1 : 0);
      `,
    },
    {
      // truthy string and truthy number
      options: [{ allowNullableEnum: false }],
      code: `
        enum ExampleEnum {
          This = 'this',
          That = 1,
        }
        (value?: ExampleEnum) => (!value ? 1 : 0);
      `,
      errors: [
        {
          line: 6,
          column: 36,
          messageId: 'conditionErrorNullableEnum',
          endLine: 6,
          endColumn: 41,
        },
      ],
      output: `
        enum ExampleEnum {
          This = 'this',
          That = 1,
        }
        (value?: ExampleEnum) => ((value == null) ? 1 : 0);
      `,
    },
    {
      // falsy string and falsy number
      options: [{ allowNullableEnum: false }],
      code: `
        enum ExampleEnum {
          This = '',
          That = 0,
        }
        (value?: ExampleEnum) => (!value ? 1 : 0);
      `,
      errors: [
        {
          line: 6,
          column: 36,
          messageId: 'conditionErrorNullableEnum',
          endLine: 6,
          endColumn: 41,
        },
      ],
      output: `
        enum ExampleEnum {
          This = '',
          That = 0,
        }
        (value?: ExampleEnum) => ((value == null) ? 1 : 0);
      `,
    },

    // any in boolean context
    ...batchedSingleLineTests<MessageId, Options>({
      code: noFormat`
        if (x) {}
        x => !x;
        <T extends any>(x: T) => x ? 1 : 0;
        <T>(x: T) => x ? 1 : 0;
      `,
      errors: [
        {
          messageId: 'conditionErrorAny',
          line: 2,
          column: 5,
          suggestions: [
            {
              messageId: 'conditionFixCastBoolean',
              output: 'if (Boolean(x)) {}',
            },
          ],
        },
        {
          messageId: 'conditionErrorAny',
          line: 3,
          column: 15,
          suggestions: [
            {
              messageId: 'conditionFixCastBoolean',
              output: '        x => !(Boolean(x));',
            },
          ],
        },
        {
          messageId: 'conditionErrorAny',
          line: 4,
          column: 34,
          suggestions: [
            {
              messageId: 'conditionFixCastBoolean',
              output: '        <T extends any>(x: T) => (Boolean(x)) ? 1 : 0;',
            },
          ],
        },
        {
          messageId: 'conditionErrorAny',
          line: 5,
          column: 22,
          suggestions: [
            {
              messageId: 'conditionFixCastBoolean',
              output: '        <T>(x: T) => (Boolean(x)) ? 1 : 0;',
            },
          ],
        },
      ],
    }),

    // noStrictNullCheck
    {
      code: `
declare const x: string[] | null;
if (x) {
}
      `,
      output: null,
      errors: [
        {
          messageId: 'noStrictNullCheck',
          line: 0,
          column: 1,
        },
        {
          messageId: 'conditionErrorObject',
          line: 3,
          column: 5,
        },
      ],
      languageOptions: {
        parserOptions: {
          tsconfigRootDir: path.join(rootPath, 'unstrict'),
        },
      },
    },

    // automatic semicolon insertion test
    {
      options: [{ allowNullableObject: false }],
      code: noFormat`
        declare const obj: { x: number } | null;
        !obj ? 1 : 0
        !obj
        obj || 0
        obj && 1 || 0
      `,
      output: null,
      errors: [
        {
          messageId: 'conditionErrorNullableObject',
          line: 3,
          column: 10,
          suggestions: [
            {
              messageId: 'conditionFixCompareNullish',
              output: `
        declare const obj: { x: number } | null;
        (obj == null) ? 1 : 0
        !obj
        obj || 0
        obj && 1 || 0
      `,
            },
          ],
        },
        {
          messageId: 'conditionErrorNullableObject',
          line: 4,
          column: 10,
          suggestions: [
            {
              messageId: 'conditionFixCompareNullish',
              output: `
        declare const obj: { x: number } | null;
        !obj ? 1 : 0
        obj == null
        obj || 0
        obj && 1 || 0
      `,
            },
          ],
        },
        {
          messageId: 'conditionErrorNullableObject',
          line: 5,
          column: 9,
          suggestions: [
            {
              messageId: 'conditionFixCompareNullish',
              output: `
        declare const obj: { x: number } | null;
        !obj ? 1 : 0
        !obj
        ;(obj != null) || 0
        obj && 1 || 0
      `,
            },
          ],
        },
        {
          messageId: 'conditionErrorNullableObject',
          line: 6,
          column: 9,
          suggestions: [
            {
              messageId: 'conditionFixCompareNullish',
              output: `
        declare const obj: { x: number } | null;
        !obj ? 1 : 0
        !obj
        obj || 0
        ;(obj != null) && 1 || 0
      `,
            },
          ],
        },
      ],
    },
    {
      code: `
declare function assert(x: unknown): asserts x;
declare const nullableString: string | null;
assert(nullableString);
      `,
      output: null,
      errors: [
        {
          messageId: 'conditionErrorNullableString',
          line: 4,
          column: 8,
          suggestions: [
            {
              messageId: 'conditionFixCompareNullish',
              output: `
declare function assert(x: unknown): asserts x;
declare const nullableString: string | null;
assert(nullableString != null);
      `,
            },
            {
              messageId: 'conditionFixDefaultEmptyString',
              output: `
declare function assert(x: unknown): asserts x;
declare const nullableString: string | null;
assert(nullableString ?? "");
      `,
            },
            {
              messageId: 'conditionFixCastBoolean',
              output: `
declare function assert(x: unknown): asserts x;
declare const nullableString: string | null;
assert(Boolean(nullableString));
      `,
            },
          ],
        },
      ],
    },
    {
      code: `
declare function assert(a: number, b: unknown): asserts b;
declare const nullableString: string | null;
assert(foo, nullableString);
      `,
      output: null,
      errors: [
        {
          messageId: 'conditionErrorNullableString',
          line: 4,
          column: 13,
          suggestions: [
            {
              messageId: 'conditionFixCompareNullish',
              output: `
declare function assert(a: number, b: unknown): asserts b;
declare const nullableString: string | null;
assert(foo, nullableString != null);
      `,
            },
            {
              messageId: 'conditionFixDefaultEmptyString',
              output: `
declare function assert(a: number, b: unknown): asserts b;
declare const nullableString: string | null;
assert(foo, nullableString ?? "");
      `,
            },
            {
              messageId: 'conditionFixCastBoolean',
              output: `
declare function assert(a: number, b: unknown): asserts b;
declare const nullableString: string | null;
assert(foo, Boolean(nullableString));
      `,
            },
          ],
        },
      ],
    },
    {
      code: `
declare function assert(a: number, b: unknown): asserts b;
declare function assert(one: number, two: unknown): asserts two;
declare const nullableString: string | null;
assert(foo, nullableString);
      `,
      output: null,
      errors: [
        {
          messageId: 'conditionErrorNullableString',
          line: 5,
          column: 13,
          suggestions: [
            {
              messageId: 'conditionFixCompareNullish',
              output: `
declare function assert(a: number, b: unknown): asserts b;
declare function assert(one: number, two: unknown): asserts two;
declare const nullableString: string | null;
assert(foo, nullableString != null);
      `,
            },
            {
              messageId: 'conditionFixDefaultEmptyString',
              output: `
declare function assert(a: number, b: unknown): asserts b;
declare function assert(one: number, two: unknown): asserts two;
declare const nullableString: string | null;
assert(foo, nullableString ?? "");
      `,
            },
            {
              messageId: 'conditionFixCastBoolean',
              output: `
declare function assert(a: number, b: unknown): asserts b;
declare function assert(one: number, two: unknown): asserts two;
declare const nullableString: string | null;
assert(foo, Boolean(nullableString));
      `,
            },
          ],
        },
      ],
    },
    {
      code: `
declare function assert(this: object, a: number, b: unknown): asserts b;
declare const nullableString: string | null;
assert(foo, nullableString);
      `,
      output: null,
      errors: [
        {
          messageId: 'conditionErrorNullableString',
          line: 4,
          column: 13,
          suggestions: [
            {
              messageId: 'conditionFixCompareNullish',
              output: `
declare function assert(this: object, a: number, b: unknown): asserts b;
declare const nullableString: string | null;
assert(foo, nullableString != null);
      `,
            },
            {
              messageId: 'conditionFixDefaultEmptyString',
              output: `
declare function assert(this: object, a: number, b: unknown): asserts b;
declare const nullableString: string | null;
assert(foo, nullableString ?? "");
      `,
            },
            {
              messageId: 'conditionFixCastBoolean',
              output: `
declare function assert(this: object, a: number, b: unknown): asserts b;
declare const nullableString: string | null;
assert(foo, Boolean(nullableString));
      `,
            },
          ],
        },
      ],
    },
    {
      // This should be checkable, but the TS API doesn't currently report
      // `someAssert(maybeString)` as a type predicate call, which appears to be
      // a bug.
      //
      // See https://github.com/microsoft/TypeScript/issues/59707
      skip: true,
      code: `
function asserts1(x: string | number | undefined): asserts x {}
function asserts2(x: string | number | undefined): asserts x {}

const maybeString = Math.random() ? 'string'.slice() : undefined;

const someAssert: typeof asserts1 | typeof asserts2 =
  Math.random() > 0.5 ? asserts1 : asserts2;

someAssert(maybeString);
      `,
      output: null,
      errors: [
        {
          messageId: 'conditionErrorNullableString',
          suggestions: [
            {
              messageId: 'conditionFixCompareNullish',
              output: `
function asserts1(x: string | number | undefined): asserts x {}
function asserts2(x: string | number | undefined): asserts x {}

const maybeString = Math.random() ? 'string'.slice() : undefined;

const someAssert: typeof asserts1 | typeof asserts2 =
  Math.random() > 0.5 ? asserts1 : asserts2;

someAssert(maybeString != null);
      `,
            },
            {
              messageId: 'conditionFixDefaultEmptyString',
              output: `
function asserts1(x: string | number | undefined): asserts x {}
function asserts2(x: string | number | undefined): asserts x {}

const maybeString = Math.random() ? 'string'.slice() : undefined;

const someAssert: typeof asserts1 | typeof asserts2 =
  Math.random() > 0.5 ? asserts1 : asserts2;

someAssert(maybeString ?? "");
      `,
            },
            {
              messageId: 'conditionFixCastBoolean',
              output: `
function asserts1(x: string | number | undefined): asserts x {}
function asserts2(x: string | number | undefined): asserts x {}

const maybeString = Math.random() ? 'string'.slice() : undefined;

const someAssert: typeof asserts1 | typeof asserts2 =
  Math.random() > 0.5 ? asserts1 : asserts2;

someAssert(Boolean(maybeString));
      `,
            },
          ],
        },
      ],
    },
    {
      // The implementation signature doesn't count towards the call signatures
      code: `
function assert(this: object, a: number, b: unknown): asserts b;
function assert(a: bigint, b: unknown): asserts b;
function assert(this: object, a: string, two: string): asserts two;
function assert(
  this: object,
  a: string,
  assertee: string,
  c: bigint,
  d: object,
): asserts assertee;

function assert(...args: any[]) {
  throw new Error('lol');
}

declare const nullableString: string | null;
assert(3 as any, nullableString);
      `,
      output: null,
      errors: [
        {
          messageId: 'conditionErrorNullableString',
          line: 18,
          column: 18,
          suggestions: [
            {
              messageId: 'conditionFixCompareNullish',
              output: `
function assert(this: object, a: number, b: unknown): asserts b;
function assert(a: bigint, b: unknown): asserts b;
function assert(this: object, a: string, two: string): asserts two;
function assert(
  this: object,
  a: string,
  assertee: string,
  c: bigint,
  d: object,
): asserts assertee;

function assert(...args: any[]) {
  throw new Error('lol');
}

declare const nullableString: string | null;
assert(3 as any, nullableString != null);
      `,
            },
            {
              messageId: 'conditionFixDefaultEmptyString',
              output: `
function assert(this: object, a: number, b: unknown): asserts b;
function assert(a: bigint, b: unknown): asserts b;
function assert(this: object, a: string, two: string): asserts two;
function assert(
  this: object,
  a: string,
  assertee: string,
  c: bigint,
  d: object,
): asserts assertee;

function assert(...args: any[]) {
  throw new Error('lol');
}

declare const nullableString: string | null;
assert(3 as any, nullableString ?? "");
      `,
            },
            {
              messageId: 'conditionFixCastBoolean',
              output: `
function assert(this: object, a: number, b: unknown): asserts b;
function assert(a: bigint, b: unknown): asserts b;
function assert(this: object, a: string, two: string): asserts two;
function assert(
  this: object,
  a: string,
  assertee: string,
  c: bigint,
  d: object,
): asserts assertee;

function assert(...args: any[]) {
  throw new Error('lol');
}

declare const nullableString: string | null;
assert(3 as any, Boolean(nullableString));
      `,
            },
          ],
        },
      ],
    },
    {
      // The implementation signature doesn't count towards the call signatures
      code: `
function assert(this: object, a: number, b: unknown): asserts b;
function assert(a: bigint, b: unknown): asserts b;
function assert(this: object, a: string, two: string): asserts two;
function assert(
  this: object,
  a: string,
  assertee: string,
  c: bigint,
  d: object,
): asserts assertee;
function assert(a: any, two: unknown, ...rest: any[]): asserts two;

function assert(...args: any[]) {
  throw new Error('lol');
}

declare const nullableString: string | null;
assert(3 as any, nullableString, 'more', 'args', 'afterwards');
      `,
      output: null,
      errors: [
        {
          messageId: 'conditionErrorNullableString',
          line: 19,
          column: 18,
          suggestions: [
            {
              messageId: 'conditionFixCompareNullish',
              output: `
function assert(this: object, a: number, b: unknown): asserts b;
function assert(a: bigint, b: unknown): asserts b;
function assert(this: object, a: string, two: string): asserts two;
function assert(
  this: object,
  a: string,
  assertee: string,
  c: bigint,
  d: object,
): asserts assertee;
function assert(a: any, two: unknown, ...rest: any[]): asserts two;

function assert(...args: any[]) {
  throw new Error('lol');
}

declare const nullableString: string | null;
assert(3 as any, nullableString != null, 'more', 'args', 'afterwards');
      `,
            },
            {
              messageId: 'conditionFixDefaultEmptyString',
              output: `
function assert(this: object, a: number, b: unknown): asserts b;
function assert(a: bigint, b: unknown): asserts b;
function assert(this: object, a: string, two: string): asserts two;
function assert(
  this: object,
  a: string,
  assertee: string,
  c: bigint,
  d: object,
): asserts assertee;
function assert(a: any, two: unknown, ...rest: any[]): asserts two;

function assert(...args: any[]) {
  throw new Error('lol');
}

declare const nullableString: string | null;
assert(3 as any, nullableString ?? "", 'more', 'args', 'afterwards');
      `,
            },
            {
              messageId: 'conditionFixCastBoolean',
              output: `
function assert(this: object, a: number, b: unknown): asserts b;
function assert(a: bigint, b: unknown): asserts b;
function assert(this: object, a: string, two: string): asserts two;
function assert(
  this: object,
  a: string,
  assertee: string,
  c: bigint,
  d: object,
): asserts assertee;
function assert(a: any, two: unknown, ...rest: any[]): asserts two;

function assert(...args: any[]) {
  throw new Error('lol');
}

declare const nullableString: string | null;
assert(3 as any, Boolean(nullableString), 'more', 'args', 'afterwards');
      `,
            },
          ],
        },
      ],
    },
    {
      code: `
declare function assert(a: boolean, b: unknown): asserts b;
declare function assert({ a }: { a: boolean }, b: unknown): asserts b;
declare const nullableString: string | null;
declare const boo: boolean;
assert(boo, nullableString);
      `,
      output: null,
      errors: [
        {
          line: 6,
          messageId: 'conditionErrorNullableString',
          suggestions: [
            {
              messageId: 'conditionFixCompareNullish',
              output: `
declare function assert(a: boolean, b: unknown): asserts b;
declare function assert({ a }: { a: boolean }, b: unknown): asserts b;
declare const nullableString: string | null;
declare const boo: boolean;
assert(boo, nullableString != null);
      `,
            },
            {
              messageId: 'conditionFixDefaultEmptyString',
              output: `
declare function assert(a: boolean, b: unknown): asserts b;
declare function assert({ a }: { a: boolean }, b: unknown): asserts b;
declare const nullableString: string | null;
declare const boo: boolean;
assert(boo, nullableString ?? "");
      `,
            },

            {
              messageId: 'conditionFixCastBoolean',
              output: `
declare function assert(a: boolean, b: unknown): asserts b;
declare function assert({ a }: { a: boolean }, b: unknown): asserts b;
declare const nullableString: string | null;
declare const boo: boolean;
assert(boo, Boolean(nullableString));
      `,
            },
          ],
        },
      ],
    },
    {
      // This report matches TS's analysis, which selects the assertion overload.
      code: `
function assert(one: unknown): asserts one;
function assert(one: unknown, two: unknown): asserts two;
function assert(...args: unknown[]) {
  throw new Error('not implemented');
}
declare const nullableString: string | null;
assert(nullableString);
      `,
      errors: [
        {
          messageId: 'conditionErrorNullableString',
          line: 8,
          suggestions: [
            {
              messageId: 'conditionFixCompareNullish',
              output: `
function assert(one: unknown): asserts one;
function assert(one: unknown, two: unknown): asserts two;
function assert(...args: unknown[]) {
  throw new Error('not implemented');
}
declare const nullableString: string | null;
assert(nullableString != null);
      `,
            },
            {
              messageId: 'conditionFixDefaultEmptyString',
              output: `
function assert(one: unknown): asserts one;
function assert(one: unknown, two: unknown): asserts two;
function assert(...args: unknown[]) {
  throw new Error('not implemented');
}
declare const nullableString: string | null;
assert(nullableString ?? "");
      `,
            },
            {
              messageId: 'conditionFixCastBoolean',
              output: `
function assert(one: unknown): asserts one;
function assert(one: unknown, two: unknown): asserts two;
function assert(...args: unknown[]) {
  throw new Error('not implemented');
}
declare const nullableString: string | null;
assert(Boolean(nullableString));
      `,
            },
          ],
        },
      ],
    },
  ],
});
