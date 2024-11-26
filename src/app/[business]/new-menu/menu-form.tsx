"use client"
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React, { useEffect, useRef, useState } from 'react'
import Board from './board'
import { Button } from '@/components/ui/button'
import useDebounce from '@/hooks/use-debounce'
import kyInstance from '@/lib/ky-instance'
import { Column, Menu } from '@/utils/types'
import { useQuery } from '@tanstack/react-query'
import { useAddColumnMutation } from '../[menuId]/muration'
type Props = {
  menuId: string
}

export default function NewMenu({ menuId}: Props) {
  const [menuName, setMenuName] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const {data, status, isFetching} = useQuery({
    queryKey: ["columns"], queryFn: () => kyInstance.get(`api/business/menu/${menuId}/columns`).json<Array<Column>>()
  })

  const columns = data ?? []

  const mutation = useAddColumnMutation();

  const hadnleAddNewColumn = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = formData.get("name")?.toString();
    if(!name) return;
    mutation.mutate({
      name,
      menuId: Number(menuId),
    }, {
      onSuccess: () => {
        form.reset()
      }
   })
  }

  useEffect(() => {
    if(menuId){
      kyInstance.get(`api/business/menu/${menuId}`).then(async (res) => {
        const menu = await res.json<Menu>();
        if(!menu.id){
          console.error("menu not found")
          return
        }
        setMenuName(menu.name)
      }).catch((err) => [
        console.error("failed to fetch menu")
      ])
    }
  }, [menuId])

  // const hadnleUpdateMenuName = () => {
  //   await kyInstance.post("") 
  // }

  useDebounce(() => {
    if(menuName.trim().length !== 0 && document.activeElement === inputRef.current){
      console.log("saving menu name....")
    }
  }, 1000, [menuName])


  if(status === "pending"){
    return <p>Loading...</p>
  }
  if(status === "error"){
    return <p className='text-destructive'>Error occured</p>
  }


  return (
    <div className='h-screen w-full'>
      <Label>Menu Name</Label>
      <Input ref={inputRef} value={menuName} onChange={(e) => setMenuName(e.target.value)} placeholder='eg: Jenny&apos;s Bakery' />
        <hr className='my-2' />
      <form onSubmit={hadnleAddNewColumn} className='flex mt-3 gap-2 flex-row items-center'>
          <Input name='name' required placeholder='Column name' />
          <Button>Add new column</Button>
      </form>
      <Board menuId={menuId} columns={columns} />
    </div>
  )
}