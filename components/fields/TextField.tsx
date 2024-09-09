'use client'

import {MdTextFields} from 'react-icons/md'
import {ElementsType, FormElement, FormElementInstance} from '../FormElement'
import {Label} from '../ui/label'
import {Input} from '../ui/input'
import {z} from 'zod'
import {useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import {useEffect} from 'react'
import useDesigner from '../hooks/useDesigner'
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from '../ui/form'
import {Switch} from '../ui/switch'

const type: ElementsType = 'TextField'
const extraAttributes = {
  label: 'Text field',
  helperText: 'Helper text',
  required: false,
  placeholder: 'Value here...',
}

const propertiesSchema = z.object({
  label: z.string().min(2).max(50),
  helperText: z.string().max(200),
  required: z.boolean().default(false),
  placeholder: z.string().max(50),
})

export const TextFieldFormElement: FormElement = {
  type,
  construct: (id: string) => ({
    id,
    type,
    extraAttributes,
  }),
  designerBtnElement: {
    icon: MdTextFields,
    label: 'Text Field',
  },
  designerComponent: DesignerComponent,
  formComponent: FormComponent,
  propertiesComponent: PropertiesComponent,
}

type CustomInstance = FormElementInstance & {
  extraAttributes: typeof extraAttributes
}

function DesignerComponent({elementInstance}: {elementInstance: FormElementInstance}) {
  const element = elementInstance as CustomInstance
  const {label, required, placeholder, helperText} = element.extraAttributes

  return (
    <div className="flex flex-col gap-2 w-full">
      <Label className="text-foreground">
        {label}
        {required && '*'}
      </Label>
      <Input readOnly disabled placeholder={placeholder} />
      {helperText && <p className="text-muted-foreground text=[0.8rem]">{helperText}</p>}
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

        {/* placeholer */}
        <FormField
          control={form.control}
          name="placeholder"
          render={({field}) => (
            <FormItem>
              <FormLabel>Placeholder</FormLabel>
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
              <FormDescription>The placeholder of the field.</FormDescription>
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

function FormComponent({elementInstance}: {elementInstance: FormElementInstance}) {
  const element = elementInstance as CustomInstance
  const {label, required, placeholder, helperText} = element.extraAttributes

  return (
    <div className="flex flex-col gap-2 w-full">
      <Label className="text-foreground">
        {label}
        {required && '*'}
      </Label>
      <Input placeholder={placeholder} />
      {helperText && <p className="text-muted-foreground text=[0.8rem]">{helperText}</p>}
    </div>
  )
}
