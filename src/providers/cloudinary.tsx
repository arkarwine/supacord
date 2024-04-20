import { Cloudinary } from '@cloudinary/url-gen'
import { createContext } from 'react'

export const CloudinaryContext = createContext<Cloudinary | null>(null)

function CloudinaryProvider({ children }: React.PropsWithChildren) {
    const cld = new Cloudinary({
        cloud: {
            cloudName: 'doiynq1dh',
        },
    })
    return <CloudinaryContext.Provider value={cld}>{children}</CloudinaryContext.Provider>
}

export default CloudinaryProvider
