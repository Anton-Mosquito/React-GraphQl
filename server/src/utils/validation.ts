import { GraphQLError } from 'graphql';

/**
 * Custom GraphQL validation error
 * Used for user input validation errors
 */
export class ValidationError extends GraphQLError {
  constructor(message: string, field?: string) {
    super(message, {
      extensions: {
        code: 'BAD_USER_INPUT',
        field,
      },
    });
  }
}
