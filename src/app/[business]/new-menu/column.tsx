"use client"
import { MenuItemValues } from '@/lib/validations'
import React, { useState } from 'react'
import { motion } from "framer-motion"
import AddItem from './add-item'
import { Pen, Plus, Save } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import {Column as ColumnType, MenuItem} from "@/utils/types"

type Props = {
    cards: Array<MenuItem>
    setCards?: React.Dispatch<React.SetStateAction<Array<MenuItemValues>>>
} & ColumnType

export default function Column({  cards, id, name, setCards }: Props) {
    const [openAddModal, setOpenAddModal] = useState(false)
    const [editName, setEditName] = useState(false)
    const [active, setActive] = useState(false)

    const filteredCards = cards.filter((card) => card.columnId === id)

    const handleDragStart = (e: React.DragEvent<HTMLDivElement> | MouseEvent | TouchEvent | PointerEvent, id: number) => {
        //@ts-ignore
        if (e.dataTransfer) {
            //@ts-ignore
            e.dataTransfer.setData("cardId", String(id))
        }
    }
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        highlightIndicator(e)
        setActive(true)
    }

    function highlightIndicator(e: React.DragEvent<HTMLDivElement>) {
        const indicators = getIndicators()
        clearHighlights(indicators);
        const el = getNearestIndicators(e, indicators)
        el.element.classList.add("opacity-100")
    }


    function clearHighlights(els?: HTMLElement[]) {
        const indicators = els || getIndicators();
        indicators.forEach((indicator) => {
            indicator.classList.add("opacity-0")
            indicator.classList.remove("opacity-100")
        })
    }

    function getIndicators() {
        return Array.from(document.querySelectorAll(`[data-column=${column}]`)) as HTMLElement[]
    }

    function getNearestIndicators(e: React.DragEvent<HTMLDivElement>, indicators: HTMLElement[]) {
        const DISTANCE_OFFSET = 50;
        const el = indicators.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = e.clientY - (box.top + DISTANCE_OFFSET)

            if (offset < 0 && offset > closest.offset) {
                return {
                    offset, element: child
                }
            } else {
                return closest;
            }
        }, {
            offset: Number.NEGATIVE_INFINITY,
            element: indicators[indicators.length - 1]
        })

        return el
    }

    const handleDragLeave = () => {
        setActive(false)
        clearHighlights()
    }
    const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
        setActive(false)
        clearHighlights()
        const cardId = e.dataTransfer.getData("cardId")
        const indicators = getIndicators();
        const { element, offset } = getNearestIndicators(e, indicators)
        const before = element.dataset.before || "-1"

        if (before !== cardId) {
            let copy = [...cards];
            let cardToTransfer = copy.find((c) => c.id === Number(cardId))
            if (!cardToTransfer) return

            cardToTransfer = { ...cardToTransfer, column }
            copy = copy.filter((cp) => cp.id !== Number(cardId))

            const moveToBack = before === "-1"
            if (moveToBack) {
                copy.push(cardToTransfer)
            } else {
                const insertAtIndex = copy.findIndex((cp) => cp.id == Number(before))
                if (insertAtIndex === undefined) return
                copy.splice(insertAtIndex, 0, cardToTransfer);
            }
            setCards(copy)
        }
    }
    return (
        <>
            <div draggable={true} className={cn('w-60 shrink-0 bg-white p-3 transition-colors cursor-grab active:cursor-grabbing', active && " bg-neutral-400/20")}>
                <div className='flex mb-2 flex-row items-center justify-between'>
                    {
                        editName ?
                            <form>
                                <Input autoFocus value={name} className='py-1' />
                            </form>
                            :
                            <h3 className={`font-semibold`}>{name}</h3>
                    }
                    {
                        editName ? <button onClick={() => setEditName(false)}>
                            <Save className='size-4 text-primary' />
                        </button>
                            :
                            <button onClick={() => setEditName(true)}>
                                <Pen className='size-4' />
                            </button>
                    }
                </div>
                <div
                    // onDragOver={handleDragOver}
                    // onDragLeave={handleDragLeave}
                    // onDrop={handleDragEnd}
                    className={cn('w-full h-full transition-colors rounded-sm', !name && "mt-10",)}>
                    {
                        filteredCards.map((item) => (
                            <Card key={item.itemId} {...item} handleDragStart={handleDragStart} />
                        ))
                    }
                    <DropIndicator beforeId={-1} column={String(id)} />
                    <motion.button onClick={() => setOpenAddModal(true)} layout className='flex items-center my-2 gap-0.5 text-neutral-900/80 hover:text-neutral-900 text-sm'><span>Add Item</span> <Plus className='size-4' /></motion.button>
                </div>
            </div>
            <AddItem column={name} columnId={id} open={openAddModal} onClose={() => setOpenAddModal(false)} />
        </>
    )
}
function Card({ columnId, itemId, itemDescription, itemName, itemPrice, handleDragStart }: MenuItem & {
    handleDragStart: (e: React.DragEvent<HTMLDivElement> | MouseEvent | TouchEvent | PointerEvent, cardId: number) => void
}) {
    return <>
        <DropIndicator beforeId={itemId} column={String(columnId)} />
        <motion.div layout layoutId={String(itemId)} draggable={true} onDragStart={(event) => handleDragStart(event, itemId)} className='cursor-grab active:cursor-grabbing rounded-sm p-3 border border-neutral-400 bg-white'>
            <p className='text-sm font-semibold text-neutral-900'>{itemName}</p>
            <p className='text-xs mt-0.5'>{itemDescription}</p>
            <p className='text-xs'>${Number(itemPrice).toFixed(2)}</p>
        </motion.div>
    </>
}

function DropIndicator({ beforeId, column }: {
    beforeId: number,
    column: string
}) {
    return (
        <div data-before={beforeId || "-1"} data-column={column} className='my-0.5 h-0.5 w-full bg-violet-500 opacity-0' />
    )
}