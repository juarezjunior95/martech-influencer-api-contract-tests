/**
 * Base Use Case Interface
 * All use cases should extend this interface
 */
export interface IUseCase<Input, Output> {
  execute(input: Input): Promise<Output>;
}
