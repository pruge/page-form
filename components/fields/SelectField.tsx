'use client'

import {RxDropdownMenu} from 'react-icons/rx'
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
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '../ui/select'
import {Separator} from '../ui/separator'
import {Button} from '../ui/button'
import {AiOutlineDelete, AiOutlinePlus} from 'react-icons/ai'

const type: ElementsType = 'SelectField'
const extraAttributes = {
  label: 'Select field',
  helperText: 'Helper text',
  required: false,
  placeholder: 'Value here...',
  options: [],
}

const propertiesSchema = z.object({
  label: z.string().min(2).max(50),
  helperText: z.string().max(200),
  required: z.boolean().default(false),
  placeholder: z.string().max(50),
  options: z.array(z.string()).default([]),
})

export const SelectFieldFormElement: FormElement = {
  type,
  construct: (id: string) => ({
    id,
    type,
    extraAttributes,
  }),
  designerBtnElement: {
    icon: RxDropdownMenu,
    label: 'Select Field',
  },
  designerComponent: DesignerComponent,
  formComponent: FormComponent,
  propertiesComponent: PropertiesComponent,
  validate: (formElement: FormElementInstance, currentValue: string) => {
    const value = formElement as CustomInstance
    if (!value.extraAttributes.required) return true
    return currentValue.length > 0
  },
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
      <Select>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder}></SelectValue>
        </SelectTrigger>
      </Select>
      {helperText && <p className="text-muted-foreground text=[0.8rem]">{helperText}</p>}
    </div>
  )
}

type propertiesFormSchemaType = z.infer<typeof propertiesSchema>
function PropertiesComponent({elementInstance}: {elementInstance: FormElementInstance}) {
  const element = elementInstance as CustomInstance
  const {updateElement, setSelectedElement} = useDesigner()
  const form = useForm<propertiesFormSchemaType>({
    resolver: zodResolver(propertiesSchema),
    mode: 'onSubmit',
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

        {/* options */}
        <Separator />
        <FormField
          control={form.control}
          name="options"
          render={({field}) => (
            <FormItem>
              <div className="flex justify-between items-center">
                <FormLabel>Options</FormLabel>
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={(e) => {
                    e.preventDefault()
                    form.setValue('options', [...field.value, 'New option'])
                  }}
                >
                  <AiOutlinePlus className="mr-2 w-4 h-4" />
                  Add
                </Button>
              </div>
              <div>
                {field.value.map((option, index) => {
                  return (
                    <div key={index} className="flex items-center justify-between gap-1">
                      <Input
                        placeholder=""
                        value={option}
                        onChange={(e) => {
                          field.value[index] = e.target.value
                          field.onChange(field.value)
                        }}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.preventDefault()
                          const newOptions = [...field.value]
                          newOptions.splice(index, 1)
                          field.onChange(newOptions)
                        }}
                      >
                        <AiOutlineDelete className="w-4 h-4" />
                      </Button>
                    </div>
                  )
                })}
              </div>

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
  const {label, required, placeholder, helperText, options} = element.extraAttributes
  const [value, setValue] = useState(defaultValue ?? '')
  const [error, setError] = useState(false)

  useEffect(() => {
    setError(isInvalid === true)
    // setValue(defaultValue ?? '')
  }, [isInvalid])

  console.log('defaultValue', defaultValue)
  console.log('value', value)

  return (
    <div className="flex flex-col gap-2 w-full">
      <Label className={cn(error ? 'text-red-500' : 'text-foreground')}>
        {label}
        {required && '*'}
      </Label>
      <Select
        value={defaultValue}
        onValueChange={(value) => {
          setValue(value)
          if (!submitValue) return
          const valid = SelectFieldFormElement.validate(element, value)
          setError(!valid)
          console.log('value', value)
          console.log('valid', valid)
          submitValue(element.id, value)
        }}
      >
        <SelectTrigger className={cn('w-full', error && 'border-red-500')}>
          <SelectValue placeholder={placeholder}></SelectValue>
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {helperText && <p className={cn(error ? 'text-red-500' : 'text-muted-foreground text=[0.8rem]')}>{helperText}</p>}
    </div>
  )
}
