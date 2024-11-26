"use client";
import { Business } from '@/utils/types';
import React, { createContext, PropsWithChildren, useContext } from 'react'


export const BusinessContext = createContext<Partial<Business> | null>(null)

export default function BusinessProvider({children, id, name, slug}: PropsWithChildren<Business>) {
  const value = {
    id, name, slug
  }
    return (
    <BusinessContext.Provider value={value}>{children}</BusinessContext.Provider>
  )
}

export const useBusiness = () => {
    const context = useContext(BusinessContext);
    if (!context) {
        throw new Error("useBusiness must be used within a BusinessProvider.");
      }
    return context
}