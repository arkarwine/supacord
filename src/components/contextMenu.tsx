import React from 'react'

type ContextMenuProps = {
    children: React.ReactNode
    menuRef?: React.LegacyRef<HTMLDivElement>
    visible: boolean
}

export function ContextMenu({ children, menuRef, visible }: ContextMenuProps) {
    return (
        <div
            ref={menuRef}
            onContextMenu={(e) => e.preventDefault()}
            className={`${visible ? 'opacity-100' : 'opacity-0 pointer-events-none'} overflow-hidden w-40 rounded-lg m-1 transition-opacity fixed bg-white/60 backdrop-blur-sm shadow-md z-[200] flex flex-col`}
        >
            {children}
        </div>
    )
}
type ContextMenuItemsProps = {
    icon: any
    label: any
    onClick: React.MouseEventHandler<HTMLButtonElement>
}

export function ContextMenuItem({ icon, label, onClick }: ContextMenuItemsProps) {
    return (
        <button className="transition-all flex items-center hover:bg-[#80808020] py-2" onClick={onClick}>
            {icon}
            <p>{label}</p>
        </button>
    )
}
