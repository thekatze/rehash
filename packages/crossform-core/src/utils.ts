export const deepSetProperty = (object: any, path: string, value: any) => {
  const parts = path.split('.');
  // navigate n-1 deep into the object
  for (let i = 0; i < parts.length - 1; i++) {
    const key = parts[i];
    object = object[key] ?? (object[key] = {});
  }

  const key = parts[parts.length - 1];
  object[key] = value;
};

export const deepGetProperty = (object: any, path: string) => path.split('.').reduce((value, part) => value?.[part], object);
