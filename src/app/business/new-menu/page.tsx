import React from 'react'
import NewMenu from './menu-form'

type Props = {}

export default function page({ }: Props) {
    return (
        <div className='p-4 h-full w-full'>
            <NewMenu />
        </div>
    )
}