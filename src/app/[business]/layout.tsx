import kyInstance from '@/lib/ky-instance'
import BusinessProvider from '@/providers/business-provider'
import { Business } from '@/utils/types'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import React, { cache, PropsWithChildren } from 'react'

type Props = {
  params: {
    business: string
  }
}

export const getBusiness = cache(async (slug: string) => {
  try {
    const response = await kyInstance.get(`api/business/${slug}`);

    if (response.status === 200) {
      const business = await response.json<Business>();
      if (!business) {
        return notFound();
      }
      return business;
    } else {
      // If the status is not 200, handle the error case
      console.error(`Failed to fetch business. Status: ${response.status}`);
      return notFound();
    }
  } catch (error) {
    // Handle network or unexpected errors
    console.error('Error fetching business data:', error);
    return notFound();
  }
});

export async function generateMetadata({
  params: { business },
}: Props): Promise<Metadata> {
  const businessData = await getBusiness(business)
  return {
    title: businessData.name,
  };
}

export default async function layout({ children, params: { business } }: PropsWithChildren & Props) {
  console.log(business);
  const businessData = await getBusiness(business);
  return (
    <section className='min-h-screen'>
      <div className='bg-primary px-4 py-2'>
        <h1 className='text-2xl font-semibold text-secondary'>{businessData.name}</h1>
      </div>
      <BusinessProvider {...businessData}>
        {children}
      </BusinessProvider>
    </section>
  )
}