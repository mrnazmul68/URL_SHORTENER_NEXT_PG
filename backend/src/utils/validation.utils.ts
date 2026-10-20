import type { z } from "zod";

export type FieldError = {
  field: string;
  message: string;
};

// Structural type for nested Zod issues
type IssueNode = {
  path: PropertyKey[];
  message: string;
  errors?: IssueNode[][];
  issues?: IssueNode[];
};

const MAX_FIELD_ERRORS = 50;

// Convert nested issues into leaf issues
export function* flattenIssues(
  issues: readonly IssueNode[],
  prefix: PropertyKey[] = [],
): Generator<IssueNode> {
  for (const issue of issues) {
    const path = [...prefix, ...issue.path];

    const nested = [...(issue.errors?.flat() ?? []), ...(issue.issues ?? [])];

    if (nested.length > 0) {
      yield* flattenIssues(nested, path);
    } else {
      yield { ...issue, path };
    }
  }
}

// Convert one issue into a field error
export function toFieldError(
  issue: IssueNode,
  fallbackField: string = "_root",
): FieldError {
  return {
    field: issue.path.map(String).join(".") || fallbackField,
    message: issue.message,
  };
}

// Deduplicate errors and limit the output
export function collectFieldErrors(
  items: Iterable<IssueNode>,
  convert: (issue: IssueNode) => FieldError,
): FieldError[] {
  const seen = new Set<string>();
  const errors: FieldError[] = [];

  for (const issue of items) {
    const error = convert(issue);
    const key = JSON.stringify([error.field, error.message]);

    if (seen.has(key)) continue;

    seen.add(key);
    errors.push(error);

    if (errors.length >= MAX_FIELD_ERRORS) break;
  }

  return errors;
}
