"use client";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { createMenuItem, CreateMenuItemValues, menuItem, MenuItemValues } from '@/lib/validations';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react'
import { useForm } from 'react-hook-form';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button';
import { useAddItemMutation } from '../[menuId]/muration';

type Props = {
    columnId: number,
    column: string
    open: boolean,
    onClose: () => void,
    setCards: React.Dispatch<React.SetStateAction<Array<MenuItemValues>>>
}
export default function AddItem({ columnId,column, setCards, onClose, open }: Props) {
    const form = useForm({
        resolver: zodResolver(createMenuItem),
        defaultValues: {
            name: "",
            description: "",
            price: 0
        }
    })

    const mutation = useAddItemMutation();

    const onSubmit = (values: CreateMenuItemValues) => {
        mutation.mutate({...values, columnId}, {
            onSuccess: () => {
                form.reset();
                onClose()
            }
        })
    }

    return <Dialog open={open} onOpenChange={onClose}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Add to {column}</DialogTitle>
            </DialogHeader>
            <Form {...form} >
                <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-y-2'>
                    <FormField control={form.control} name="name" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl className='!mt-0'>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="description" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl className='!mt-0'>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="price" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Price</FormLabel>
                            <FormControl className='!mt-0'>
                                <Input type='number' {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <DialogFooter className='mt-2'>
                        <Button disabled={mutation.isPending} type='button' onClick={onClose} variant={"outline"}>Cancel</Button>
                        <Button disabled={mutation.isPending}>Add</Button>
                    </DialogFooter>
                </form>
            </Form>
        </DialogContent>
    </Dialog>
}