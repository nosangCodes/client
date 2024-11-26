"use client"
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Column } from '@/utils/types'
import React from 'react'
import { useDeleteColumnMutation } from '../[menuId]/muration'

type Props = {
    open: boolean,
    onClose: ()=> void,
    column: Column
}

export default function DeleteColumnDialog({open, onClose, column}: Props) {
    const mutation = useDeleteColumnMutation();
    const handleDelete = () => {
        if(!column.id) return
        mutation.mutate(column.id, {
            onSuccess: () => {
                onClose()
            }
        })
    }
  return (
    <Dialog open={open} onOpenChange={onClose}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>
                    Are you sure you want to delete this column({column.name})?
                </DialogTitle>
                <DialogDescription>
                    All the items in this column will be deleted.
                </DialogDescription>
            </DialogHeader>
            <DialogFooter>
                <Button disabled={mutation.isPending} onClick={onClose} variant={"outline"}>Cancel</Button>
                <Button onClick={handleDelete} disabled={mutation.isPending} variant={"destructive"}>Delete</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
  )
}