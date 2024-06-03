import type { Identifier } from '../expression/Identifier/spec';
import type { MemberExpression } from '../expression/MemberExpression/spec';
import type { TSAsExpression } from '../expression/TSAsExpression/spec';
import type { TSInstantiationExpression } from '../expression/TSInstantiationExpression/spec';
import type { TSNonNullExpression } from '../expression/TSNonNullExpression/spec';
import type { TSSatisfiesExpression } from '../expression/TSSatisfiesExpression/spec';
import type { TSTypeAssertion } from '../expression/TSTypeAssertion/spec';
import type { ArrayPattern } from '../parameter/ArrayPattern/spec';
import type { ObjectPattern } from '../parameter/ObjectPattern/spec';

export type AssignmentTarget =
  | ArrayPattern
  | Identifier
  | MemberExpression
  | ObjectPattern
  | TSAsExpression
  | TSInstantiationExpression
  | TSNonNullExpression
  | TSSatisfiesExpression
  | TSTypeAssertion;
