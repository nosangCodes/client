import React from 'react'
import NewMenu from './menu-form'

type Props = {}

export default function page({ }: Props) {
    return (
        <div className='bg-card shadow-md rounded-md p-4 min-h-[500px]'>
            <NewMenu />
        </div>
    )
}