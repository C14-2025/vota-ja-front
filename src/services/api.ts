export async function getData(
  id: string
): Promise<{ id: string; value: string }> {
  // placeholder for real fetch/axios call
  return Promise.resolve({ id, value: `value-for-${id}` });
}

export default { getData };
