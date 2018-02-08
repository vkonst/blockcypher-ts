export const getEnvParam = (params: string[], byDefault: string = ""): string => {
  const key = params.find( (param) => !! process.env[param] );
  const value = !!key ? process.env[key] : "";
  return value || byDefault;
};
