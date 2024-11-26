import { items } from '@/lib/data'
import React, { useState } from 'react'
import { MenuItemValues } from '@/lib/validations'
import { Flame, Trash } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Column as ColumnType, MenuItem } from '@/utils/types'
import Column from './column'
import { useQuery } from '@tanstack/react-query'
import kyInstance from '@/lib/ky-instance'

type Props = {
    columns: Array<ColumnType>,
    menuId: string
}

export default function Board({ columns, menuId }: Props) {
    const { data, status, isFetching} = useQuery({
        queryKey: ["menu-items"],
        queryFn: () => kyInstance.get(`api/business/menu/${menuId}/items`).json<Array<MenuItem>>()
    })
    const cards = data ?? []

    if(status === "pending"){
        return <p>Loading...</p>
      }
      if(status === "error"){
        return <p className='text-destructive'>Error occured</p>
      }
    

    return (
        <div className='h-full w-full flex p-3 overflow-scroll'>
            {
                columns.map((column) => (
                    <Column key={column.id} cards={cards} {...column} />
                ))
            }
            <DeleteZone className='ml-4' />
        </div>
    )
}

function DeleteZone({ setCards, className }: {
    setCards: React.Dispatch<React.SetStateAction<Array<MenuItemValues>>>,
    className?: string
}) {
    const [active, setActive] = useState(false)
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        setActive(true)
    }

    const handleDragLeave = () => {
        setActive(false)
    }
    const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        const id = parseInt(e.dataTransfer.getData("cardId"));
        setCards((prev) => prev.filter((item) => item.id !== id))
        setActive(false)

    }
    return <div onDragOver={handleDragOver} onDrop={onDrop} onDragLeave={handleDragLeave} className={cn('w-60 h-52 flex justify-center items-center shrink-0 mt-10 rounded-sm ', active ? "bg-red-500/20 border border-red-800/50" : "bg-neutral-100 border-neutral-800/70", className)}>
        {
            active ? <Flame className='animate-bounce size-8 text-red-700' />
                :
                <Trash className='text-neutral-800/60' />
        }
    </div>
}