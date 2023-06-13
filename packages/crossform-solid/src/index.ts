import { createSignal, JSX } from "solid-js";
import {
  createForm as createFormInternal,
  isDirty as isDirtyInternal,
  reset as resetInternal,
  DeepKeyOf,
  validateField,
  ValidationErrors,
  validateForm,
} from "@crossform/core";
import { deepGetProperty, deepSetProperty } from "@crossform/core/src/utils";
import { EvaluateKey } from "@crossform/core/src/utilTypes";

// export * from "@crossform/core/validators"
export { required, min, max, minLength, maxLength } from "@crossform/core";

type CreateFormParameters<TFormData extends object> = Parameters<
  typeof createFormInternal<TFormData>
>[0];

type HandlerType = "text" | "number";

export type RegisterHandlersFunction<
  TFormData extends object,
  TField extends DeepKeyOf<TFormData> = DeepKeyOf<TFormData>
> = (
  field: TField,
  type: HandlerType
) => {
  onInput: JSX.EventHandler<HTMLInputElement | HTMLTextAreaElement, InputEvent>;
  onBlur: JSX.EventHandler<HTMLInputElement | HTMLTextAreaElement, FocusEvent>;
  value: EvaluateKey<TFormData, TField>;
};

export const createForm = <TFormData extends object>(
  params: CreateFormParameters<TFormData>
) => {
  const [context, setContext] = createSignal(
    createFormInternal<TFormData>(params)
  );
  const [errors, setErrorsInternal] = createSignal<ValidationErrors<TFormData>>(
    {}
  );

  const handleSubmit =
    (onSubmit: (data: TFormData) => void | Promise<void>) => (event: Event) => {
      event.preventDefault();

      const validationErrors = validateForm(context());

      if (Object.keys(validationErrors).length) {
        setErrorsInternal(() => validationErrors);
        return;
      }

      onSubmit(context().data as TFormData);
    };

  const setErrors = (field: DeepKeyOf<TFormData>, errors: string[]) =>
    setErrorsInternal((e) => {
      const currentErrors = { ...e };
      if (errors.length) currentErrors[field] = errors;
      else delete currentErrors[field];

      return currentErrors;
    });

  const registerHandlers = (
    field: DeepKeyOf<TFormData>,
    type: HandlerType = "text"
  ) => {
    const onInput: JSX.EventHandler<
      HTMLInputElement | HTMLTextAreaElement,
      InputEvent
    > = (event) => {
      setContext((context) => {
        const data = context.data;
        const value = (
          { text: (v) => v, number: (v) => +v } satisfies Record<
            HandlerType,
            (v: string) => unknown
          >
        )[type](event.currentTarget.value);

        deepSetProperty(data, field, value);

        return { ...context, data };
      });
    };

    const onBlur: JSX.EventHandler<
      HTMLInputElement | HTMLTextAreaElement,
      FocusEvent
    > = (event) => {
      const validationErrors = validateField(context(), field);
      setErrors(field, validationErrors);
    };

    return {
      onInput,
      onBlur,
      name: field,
      value: deepGetProperty(context().data, field) ?? null,
    };
  };

  const isDirty = () => isDirtyInternal(context());

  const watch =
    <TField extends DeepKeyOf<TFormData>>(field: TField) =>
    (): EvaluateKey<TFormData, TField> =>
      deepGetProperty(context().data, field);

  const reset = (data?: Partial<TFormData>) => {
    setContext((context) => resetInternal(context, data));
    setErrorsInternal({});
  };

  return {
    handleSubmit,
    registerHandlers,
    errors,
    setErrors,
    isDirty,
    watch,
    reset,
  };
};
