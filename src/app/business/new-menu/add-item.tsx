"use client";

import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { createMenuItem, menuItem, MenuItemValues } from '@/lib/validations';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button';

type Props = {
    column: string,
    open: boolean,
    onClose: () => void,
    setCards: React.Dispatch<React.SetStateAction<Array<MenuItemValues>>>
}
export default function AddItem({ column, setCards, onClose, open }: Props) {
    const form = useForm({
        resolver: zodResolver(createMenuItem),
        defaultValues: {
            name: "",
            description: "",
            column: column,
            price: 0
        }
    })
    return <Dialog open={open} onOpenChange={onClose}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Add to {column}</DialogTitle>
            </DialogHeader>
            <Form {...form}>
                <form className='flex flex-col gap-y-2'>
                    <FormField control={form.control} name="name" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl className='!mt-0'>
                                <Input {...field} />
                            </FormControl>
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="description" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl className='!mt-0'>
                                <Input {...field} />
                            </FormControl>
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="price" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Price</FormLabel>
                            <FormControl className='!mt-0'>
                                <Input type='number' {...field} />
                            </FormControl>
                        </FormItem>
                    )} />
                    <DialogFooter className='mt-2'>
                        <Button type='button' onClick={onClose} variant={"outline"}>Cancel</Button>
                        <Button>Add</Button>
                    </DialogFooter>
                </form>
            </Form>
        </DialogContent>
    </Dialog>
}