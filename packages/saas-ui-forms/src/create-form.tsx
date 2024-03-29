import React, { ForwardedRef } from 'react'
import { forwardRef } from '@chakra-ui/react'

import { FieldsProvider } from './fields-context'
import { Form, FieldValues, FormProps, GetResolver } from './form'
import { GetBaseField, WithFields } from './types'
import { objectFieldResolver } from './field-resolver'
import { GetFieldResolver } from './field-resolver'

export interface CreateFormProps<
  FieldDefs,
  TGetBaseField extends GetBaseField = GetBaseField,
> {
  resolver?: GetResolver
  fieldResolver?: GetFieldResolver
  fields?: FieldDefs extends Record<string, React.FC<any>> ? FieldDefs : never
  getBaseField?: TGetBaseField
}

export type FormType<
  FieldDefs,
  ExtraProps = object,
  ExtraFieldProps extends object = object,
  ExtraOverrides = object,
> = (<
  TSchema = unknown,
  TFieldValues extends FieldValues = FieldValues,
  TContext extends object = object,
>(
  props: WithFields<
    FormProps<TSchema, TFieldValues, TContext, ExtraFieldProps>,
    FieldDefs,
    ExtraOverrides
  > & {
    ref?: React.ForwardedRef<HTMLFormElement>
  } & ExtraProps
) => React.ReactElement) & {
  displayName?: string
  id?: string
}

export function createForm<
  FieldDefs,
  TGetBaseField extends GetBaseField<any> = GetBaseField<any>,
>({
  resolver,
  fieldResolver = objectFieldResolver,
  fields,
  getBaseField,
}: CreateFormProps<FieldDefs, TGetBaseField> = {}) {
  type ExtraFieldProps =
    TGetBaseField extends GetBaseField<infer ExtraFieldProps>
      ? ExtraFieldProps
      : object

  const DefaultForm = forwardRef(
    <
      TSchema = any,
      TFieldValues extends FieldValues = FieldValues,
      TContext extends object = object,
    >(
      props: WithFields<
        FormProps<TSchema, TFieldValues, TContext, ExtraFieldProps>,
        FieldDefs
      >,
      ref: ForwardedRef<HTMLFormElement>
    ) => {
      const {
        schema,
        resolver: resolverProp,
        fieldResolver: fieldResolverProp,
        ...rest
      } = props

      return (
        <FieldsProvider value={{ fields, getBaseField }}>
          <Form
            ref={ref}
            resolver={resolverProp ?? resolver?.(props.schema)}
            fieldResolver={fieldResolverProp ?? fieldResolver?.(schema)}
            {...rest}
          />
        </FieldsProvider>
      )
    }
  ) as FormType<FieldDefs, object, ExtraFieldProps>

  DefaultForm.displayName = 'Form'
  DefaultForm.id = 'Form'

  return DefaultForm
}
