// Wrap the application with the QueryClientProvider to provide the QueryClient to the application. Tha main purpose is to cache the data instead of making a call to the backend every time.
'use client'
import React from 'react'
import {QueryClientProvider, QueryClient} from '@tanstack/react-query'

type Props = {
    children: React.ReactNode;
}

const queryClient = new QueryClient();

const Providers = ({children}: Props) => {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>  
    );
};

export default Providers;