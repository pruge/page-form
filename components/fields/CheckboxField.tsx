'use client'

import {IoMdCheckbox} from 'react-icons/io'
import {ElementsType, FormElement, FormElementInstance, SubmitFunction} from '../FormElement'
import {Label} from '../ui/label'
import {Input} from '../ui/input'
import {z} from 'zod'
import {useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import {useEffect, useState} from 'react'
import useDesigner from '../hooks/useDesigner'
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from '../ui/form'
import {Switch} from '../ui/switch'
import {cn} from '@/lib/utils'
import {Checkbox} from '../ui/checkbox'

const type: ElementsType = 'CheckboxField'
const extraAttributes = {
  label: 'Checkbox field',
  helperText: 'Helper text',
  required: false,
}

const propertiesSchema = z.object({
  label: z.string().min(2).max(50),
  helperText: z.string().max(200),
  required: z.boolean().default(false),
})

export const CheckboxFieldFormElement: FormElement = {
  type,
  construct: (id: string) => ({
    id,
    type,
    extraAttributes,
  }),
  designerBtnElement: {
    icon: IoMdCheckbox,
    label: 'Checkbox Field',
  },
  designerComponent: DesignerComponent,
  formComponent: FormComponent,
  propertiesComponent: PropertiesComponent,
  validate: (formElement: FormElementInstance, currentValue: string) => {
    const value = formElement as CustomInstance
    if (!value.extraAttributes.required) return true
    console.log('currentValue', currentValue, currentValue === 'true')
    return currentValue === 'true'
  },
}

type CustomInstance = FormElementInstance & {
  extraAttributes: typeof extraAttributes
}

function DesignerComponent({elementInstance}: {elementInstance: FormElementInstance}) {
  const element = elementInstance as CustomInstance
  const {label, required, helperText} = element.extraAttributes
  const id = `checkbox-${element.id}`

  return (
    <div className="flex items-start space-x-2">
      <Checkbox id={id} />
      <div className="grid gap-1.5 leading-none">
        <Label htmlFor={id}>
          {label}
          {required && '*'}
        </Label>
        {helperText && <p className="text-muted-foreground text=[0.8rem]">{helperText}</p>}
      </div>
    </div>
  )
}

type propertiesFormSchemaType = z.infer<typeof propertiesSchema>
function PropertiesComponent({elementInstance}: {elementInstance: FormElementInstance}) {
  const element = elementInstance as CustomInstance
  const {updateElement} = useDesigner()
  const form = useForm<propertiesFormSchemaType>({
    resolver: zodResolver(propertiesSchema),
    mode: 'onBlur',
    defaultValues: {
      ...element.extraAttributes,
    },
  })

  useEffect(() => {
    form.reset(element.extraAttributes)
  }, [element, form])

  function applyChanges(values: propertiesFormSchemaType) {
    updateElement(element.id, {
      ...element,
      extraAttributes: values,
    })
  }

  return (
    <Form {...form}>
      <form onBlur={form.handleSubmit(applyChanges)} onSubmit={(e) => e.preventDefault()} className="space-y-3">
        {/* label */}
        <FormField
          control={form.control}
          name="label"
          render={({field}) => (
            <FormItem>
              <FormLabel>Label</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      e.currentTarget.blur()
                    }
                  }}
                />
              </FormControl>
              <FormDescription>
                The label of the field. <br />
                It will be displaced above the field.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* helper text */}
        <FormField
          control={form.control}
          name="helperText"
          render={({field}) => (
            <FormItem>
              <FormLabel>Helper text</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      e.currentTarget.blur()
                    }
                  }}
                />
              </FormControl>
              <FormDescription>
                The helper text of the field. <br />
                It will be displayed below the field.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* required */}
        <FormField
          control={form.control}
          name="required"
          render={({field}) => (
            <FormItem>
              <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                  <FormLabel>Required</FormLabel>
                  <FormDescription>
                    The helper text of the field. <br />
                    It will be displayed below the field.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}

function FormComponent({
  elementInstance,
  submitValue,
  isInvalid,
  defaultValue,
}: {
  elementInstance: FormElementInstance
  submitValue?: SubmitFunction
  isInvalid?: boolean
  defaultValue?: string
}) {
  const element = elementInstance as CustomInstance
  const {label, required, placeholder, helperText} = element.extraAttributes
  const [value, setValue] = useState<boolean>(defaultValue === 'true' ? true : false)
  const [error, setError] = useState(false)
  const id = `checkbox-${element.id}`

  useEffect(() => {
    setError(isInvalid === true)
    // setValue(defaultValue ?? '')
  }, [isInvalid])

  // console.log('value', value)

  return (
    <div className="flex items-start space-x-2">
      <Checkbox
        id={id}
        checked={value}
        className={cn(error && 'border-red-500')}
        onCheckedChange={(checked) => {
          let value = false
          if (checked) value = true
          setValue(value)

          if (!submitValue) return
          submitValue(element.id, value.toString())
        }}
      />
      <div className="grid gap-1.5 leading-none">
        <Label htmlFor={id} className={cn(error && 'text-red-500')}>
          {label}
          {required && '*'}
        </Label>
        {helperText && (
          <p className={cn(error ? 'text-red-500' : 'text-muted-foreground', 'text=[0.8rem]')}>{helperText}</p>
        )}
      </div>
    </div>
  )
}
