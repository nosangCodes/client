import React from 'react'
import NewMenu from '../new-menu/menu-form'

type Props = {
    params: {
        menuId: string
    }
}

export default function page({ params: {
    menuId
}}: Props) {
    return (
        <div className='p-4 h-full w-full'>
            <NewMenu menuId={menuId} />
        </div>
    )
}