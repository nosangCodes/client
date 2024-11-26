"use client";
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useBusiness } from '@/providers/business-provider';
import kyInstance from '@/lib/ky-instance';
import { Loader2 } from 'lucide-react';
import { Menu } from '@/utils/types';
import { useRouter } from 'next/navigation';

type Props = {
    
}

export default function NewMenuForm({}: Props) {
  const {id, slug} = useBusiness();
  const [loading, setLoading] = useState(false)
  const router = useRouter();

  const handleSubmit =  async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget;
    const formData = new FormData(form)
    const obj = Object.fromEntries(formData);
    if(!id){
      console.error("missing business id")
      return
    }
    
    try {
      setLoading(true)
      const res = await kyInstance.post("api/business/create-menu", {
        headers: {
          'content-type': 'application/json'
        },
        json: {
          ...obj,
          businessId: id
        }
      })
      if(res.status === 200){
        const newMenu = await res.json<Menu>()
        if(newMenu?.slug){
          router.push(`${slug}/${newMenu.id}`)
        }

      }
      console.log(res)
    } catch (error) {
      console.error("failed to create menu", error)
    }finally {
      setLoading(false)
    }

  } 
  return (
    <form onSubmit={handleSubmit} className='flex flex-col gap-2 mt-4 mx-3'>
        <Label>Menu name</Label>
        <Input name='name' required placeholder='eg: Jenny&apos; Bakery' />
        <Button type='submit'>
          {
            loading ? <Loader2 className='animate-spin mx-auto' />
            :
            "Create Menu"
          }
          </Button>
    </form>
  )
}