import { LoaderCircle } from 'lucide-react'

export const Loading = () => {
    return <div className="flex justify-center items-center w-full h-screen"><LoaderCircle className='size-6 animate-spin stroke-indigo-400' /></div>
}