/**
 * Validates `values` with a zod schema. Returns `{ data }` on success or `{ errors }` mapping
 * each field name to its first message (the shape the shared input components expect).
 */
export function validateForm(schema, values) {
  const result = schema.safeParse(values);
  if (result.success) return { data: result.data };
  const errors = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0];
    if (field !== undefined && !errors[field]) errors[field] = issue.message;
  }
  return { errors };
}
