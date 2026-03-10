# Errors

Requests may fail due to different reasons such as HTTP errors, network issues, or timeouts.

Use standard `try/catch` handling to handle failures.

## Example

```ts
try {
  const users = await client.get('/users');
} catch (error) {
  console.error(error);
}
```

## Typical error types

- HTTP errors (non-2xx responses)
- network errors
- timeout errors

## Note

Handle errors close to the application logic that depends on the request result.
