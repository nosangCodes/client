"use client"
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { toast } from '@/hooks/use-toast'
import { newMenuSchema, NewMenuValues } from '@/lib/validations'
import { zodResolver } from '@hookform/resolvers/zod'
import { CirclePlus, Trash } from 'lucide-react'
import React from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
type Props = {}

export default function NewMenu({ }: Props) {
  const form = useForm({
    resolver: zodResolver(newMenuSchema),
    defaultValues: {
      name: "",
      items: [{
        name: "",
        price: 0
      }]
    }
  })

  // Use useFieldArray to manage dynamic fields
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items", // Field array name matches the schema key
  });

  const handleSubmit = (values: NewMenuValues) => {
    console.log("new meny values", values)
  }
  return (
    <div className='mb-4'>
      <Form {...form}>
        <form className='flex flex-col gap-y-2' onSubmit={form.handleSubmit(handleSubmit)}>
          <FormField control={form.control} name='name' render={({ field }) => (
            <FormItem>
              <FormLabel>Menu name</FormLabel>
              <FormControl className='!mt-0'>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <div className='flex flex-row justify-between mt-2'>
            <p>Add items</p>
            <Button title='Add menu item' type='button' size={"sm"} onClick={() => append({
              name: "",
              price: 0
            })}>
              <CirclePlus className='size-6' />
            </Button>
          </div>
          <ScrollArea className='md:h-[500px] pr-4'>
            {
              fields.map((field, index) => (
                <div key={field.id} className='flex md:flex-row items-start gap-x-4'>
                  <p className='text-xs font-semibold mt-[1.5rem]'>{index + 1}</p>
                  <FormField control={form.control} name={`items.${index}.name`} render={({ field }) => (
                    <FormItem className='flex-1'>
                      <FormLabel>
                        Name
                      </FormLabel>
                      <FormControl className='!mt-0'>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name={`items.${index}.price`} render={({ field }) => (
                    <FormItem className='flex-1'>
                      <FormLabel>
                        Price
                      </FormLabel>
                      <FormControl className='!mt-0'>
                        <Input type='number' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <button
                  title='Delete item'
                    type="button"
                    className="text-destructive mt-[1.5rem]"
                    onClick={() => {
                      if (form.getValues("items").length < 2) {
                        toast({
                          title: "Must have atleast one item"
                        })
                      } else {
                        remove(index)
                      }
                    } // Remove the field at the current index
                    }
                  >
                    <Trash className="h-5 w-5" />
                  </button>
                </div>
              ))
            }
            <Button className='mt-8 ml-auto flex'>Generate Menu</Button>
          </ScrollArea>
        </form>
      </Form>
    </div>
  )
}