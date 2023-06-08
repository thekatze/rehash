export const required = (error: string) => (value: unknown) => {
  if (typeof value !== "number" && !value) return error;
};

export const minLength = (minLength: number, error: string) => (value?: string) => {
  if (!value || value.length < minLength) return error;
}

export const maxLength = (maxLength: number, error: string) => (value?: string) => {
  if (!value || value.length > maxLength) return error;
}

export const min = (min: number, error: string) => (value?: string) => {
  if (!value || +value < min) return error;
}

export const max = (max: number, error: string) => (value?: string) => {
  if (!value || +value > max) return error;
}

