import type { RequestHandler } from "express";
import type { ZodType } from "zod";

import {
  collectFieldErrors,
  flattenIssues,
  toFieldError,
  type FieldError,
} from "../utils/validation.utils.js";

type Schema = ZodType;

type Validate = {
  body?: Schema;
  params?: Schema;
  query?: Schema;
};

const TARGETS: Array<keyof Validate> = ["body", "params", "query"];

export const validate = (schemas: Validate): RequestHandler => {
  return async (req, res, next) => {
    try {
      const activeTargets = TARGETS.filter((target) => schemas[target]);

      if (activeTargets.length === 0) {
        throw new Error("Schema not defined");
      }

      const allErrors: FieldError[] = [];

      for (const target of activeTargets) {
        const schema = schemas[target]!;
        const result = await schema.safeParseAsync(req[target]);

        if (!result.success) {
          const errors = collectFieldErrors(
            flattenIssues(result.error.issues),
            (issue) => toFieldError(issue, target),
          );
          allErrors.push(...errors);
        } else {
          req[target] = result.data;
        }
      }

      if (allErrors.length > 0) {
        res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: allErrors,
        });

        return;
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

// import type { RequestHandler } from "express";
// import type { ZodType } from "zod";

// type Schema = ZodType;

// type Validate = {
//   body?: Schema;
// };

// export type FieldError = {
//   field: string;
//   message: string;
// };

// type IssueLike = {
//   path: readonly PropertyKey[];
//   message: string;
//   errors?: readonly (readonly IssueLike[])[]; // invalid_union
//   issues?: readonly IssueLike[]; // invalid_key / invalid_element
// };

// const MAX_FIELD_ERRORS = 20;

// // FieldError object বানায়
// const toFieldError = (field: string, message: string): FieldError => ({
//   field: field || "body",
//   message,
// });

// // nested issue tree -> flat leaf issues (lazy generator)
// function* flattenIssues(
//   issues: readonly IssueLike[],
//   prefix: readonly PropertyKey[] = [],
// ): Generator<IssueLike> {
//   for (const issue of issues) {
//     const path = [...prefix, ...issue.path];
//     const nested = [...(issue.errors?.flat() ?? []), ...(issue.issues ?? [])];

//     if (nested.length > 0) {
//       yield* flattenIssues(nested, path); // নিচে নামো
//     } else {
//       yield { ...issue, path }; // leaf
//     }
//   }
// }

// // duplicate বাদ + MAX_FIELD_ERRORS পর্যন্ত collect
// function collectFieldErrors<T>(
//   items: Iterable<T>,
//   toError: (item: T) => FieldError,
// ): FieldError[] {
//   const seen = new Set<string>();
//   const errors: FieldError[] = [];

//   for (const item of items) {
//     const error = toError(item);
//     const key = `${error.field}\u0000${error.message}`;
//     if (seen.has(key)) continue;
//     seen.add(key);
//     errors.push(error);
//     if (errors.length === MAX_FIELD_ERRORS) break; // generator-ও এখানে থেমে যায়
//   }

//   return errors;
// }

// // validation middleware
// export const validate = (schemas: Validate): RequestHandler => {
//   if (!schemas.body) {
//     throw new Error("Schema not defined");
//   }
//   const bodySchema = schemas.body;

//   return async (req, res, next) => {
//     try {
//       const result = await bodySchema.safeParseAsync(req.body);

//       if (!result.success) {
//         const errors = collectFieldErrors(
//           flattenIssues(result.error.issues as readonly IssueLike[]),
//           (issue) =>
//             toFieldError(issue.path.map(String).join("."), issue.message),
//         );
//         res.status(400).json({ message: "Validation failed", errors });
//         return;
//       }

//       req.body = result.data; // parsed + typed data
//       next();
//     } catch (err) {
//       next(err);
//     }
//   };
// };
