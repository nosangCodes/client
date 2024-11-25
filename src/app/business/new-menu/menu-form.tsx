"use client"
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { newMenuSchema, NewMenuValues } from '@/lib/validations'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import Board from './board'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { columns } from '@/lib/data'
type Props = {}

export default function NewMenu({ }: Props) {
  const [categories, setCategories] = useState(columns)
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

  const hadnleAddNewCategory = () => {
    setCategories((prev) => ([
      ...prev, {
        color: "",
        column: "new",
        title: "New"
      }
    ]))
  }


  return (
    <div className='h-screen w-full'>
      <form>
        <Label>Menu Name</Label>
        <Input placeholder='eg: Jenny&apos;s Bakery' />
      </form>
      <Button className='mt-4' onClick={hadnleAddNewCategory}>Add new column</Button>
      <Board columns={categories} />
    </div>
  )
}