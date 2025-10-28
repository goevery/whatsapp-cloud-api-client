export function loadRequiredEnvVar(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Environment variable ${name} is required but not set.`);
  }

  return value;
}
