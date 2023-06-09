import { EvaluateKey } from "./utilTypes";
import { deepGetProperty } from "./utils";
import deepEquals from "fast-deep-equal";

// https://stackoverflow.com/a/65333050
export type DeepKeyOf<TObj extends object> = {
  [TKey in keyof TObj & (string | number)]:
  TObj[TKey] extends any[] ? `${TKey}` :
  TObj[TKey] extends object
  ? `${TKey}` | `${TKey}.${DeepKeyOf<TObj[TKey]>}`
  : `${TKey}`;
}[keyof TObj & (string | number)];

export interface CreateFormProps<TFormData extends object> {
  initialData?: Partial<TFormData>;
  validation?: FormValidators<TFormData>
}

type ValidationResult = string | undefined;
type FieldValidator<T> = (field: T) => ValidationResult;

type FormValidators<TFormData extends object> = Partial<{
  [Field in DeepKeyOf<TFormData>]: FieldValidator<EvaluateKey<TFormData, Field>>[];
}>

export type ValidationErrors<TFormData extends object> = Partial<Record<DeepKeyOf<TFormData>, string[]>>;

export interface FormContext<TFormData extends object> {
  data: Partial<TFormData>;
  initialData: Partial<TFormData>;
  validation?: FormValidators<TFormData>;
}

export const createForm = <TFormData extends object>({ initialData, validation }: CreateFormProps<TFormData>): FormContext<TFormData> => {
  return { data: initialData ?? {}, initialData: initialData ?? {}, validation };
}

export const isDirty = <TFormData extends object>(context: FormContext<TFormData>) => !deepEquals(context.data, context.initialData);

export const reset = <TFormData extends object>(context: FormContext<TFormData>, data?: Partial<TFormData>) => {
  return { ...context, data: data ?? {}, initialData: data ?? {} }
}

export const validateField = <TFormData extends object>(context: FormContext<TFormData>, field: DeepKeyOf<TFormData>) => {
  return context.validation?.[field]?.map(validator => validator(deepGetProperty(context.data, field)))
    .filter((result): result is string => Boolean(result)) ?? [];
}

export const validateForm = <TFormData extends object>(context: FormContext<TFormData>): ValidationErrors<TFormData> => {
  if (!context.validation) return {};

  return Object.keys(context.validation).reduce((validationErrors, field) => {
    const errors = validateField(context, field as DeepKeyOf<TFormData>);

    if (errors.length) validationErrors[field as DeepKeyOf<TFormData>] = errors;

    return validationErrors;
  }, {} as ValidationErrors<TFormData>)
};

export * from "./validators";
