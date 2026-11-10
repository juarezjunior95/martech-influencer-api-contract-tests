export const createQueryFn =
  <TArg, TResult>(fn: (arg: TArg) => Promise<TResult>) =>
  async (arg: TArg) => {
    try {
      const data = await fn(arg);
      return { data };
    } catch (err) {
      return { error: { data: err } };
    }
  };
