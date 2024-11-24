import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

type Props = {}

export default function page({ }: Props) {
    return (
        <div>
            <Link href={"/business/new-menu"}>
                <Button>Create Menu</Button>
            </Link>
        </div>
    )
}