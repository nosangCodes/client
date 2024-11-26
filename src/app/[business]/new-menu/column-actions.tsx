"use client";

import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Ellipsis, Pen, Trash2 } from 'lucide-react'
import React, { useState } from 'react'
import DeleteColumnDialog from './delete-column-dialog';
import { Column } from '@/utils/types';

type Props = {
  className?:string,
  column: Column
}

export default function ColumnActions({className, column}: Props) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  return (
    <>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button  className={className} size={"icon"} variant={"ghost"}>
              <Ellipsis />
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem className='cursor-pointer' onClick={() => setShowDeleteDialog(true)}>
            <span className="flex text-sm items-center gap-3 text-neutral-800">
              <Pen className="size-4" />
              Edit
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem className='cursor-pointer' onClick={() => setShowDeleteDialog(true)}>
            <span className="flex text-sm items-center gap-3 text-destructive">
              <Trash2 className="size-4" />
              Delete
            </span>
          </DropdownMenuItem>
        </DropdownMenuContent>
        </DropdownMenu>
        <DeleteColumnDialog column={column} open={showDeleteDialog} onClose={() => setShowDeleteDialog(false)} />
    </>
  )
}