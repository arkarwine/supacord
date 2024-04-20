import { AdvancedImage } from '@cloudinary/react'
import { fill } from '@cloudinary/url-gen/actions/resize'
import { useCallback, useContext } from 'react'
import { CloudinaryContext } from '../providers/cloudinary'
type Props = {
    online?: boolean
    id: string | null
    fallback?: string
    fullname: string
    className?: string
}

function Avatar({ fallback, id, className, fullname, online }: Props) {
    const strToHslColor = useCallback((str: string) => {
        let hash = 0
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash)
        }

        let h = hash % 360

        return (
            'linear-gradient(to top right, hsl(' +
            h +
            ', ' +
            44 +
            '%, ' +
            55 +
            '%), hsl(' +
            h +
            ', ' +
            66 +
            '%, ' +
            77 +
            '%))'
        )
    }, [])
    const cld = useContext(CloudinaryContext)!

    const getAvatar = useCallback(
        (id: string) => {
            const avatar = cld.image(id)
            return avatar.resize(fill().width(250).height(250))
        },
        [id],
    )
    return (
        <section
            className={` relative center rounded-full shadow-sm ` + className}
            style={{
                height: 48,
                width: 48,
                background: strToHslColor(fullname),
            }}
        >
            {id === null ? (
                <p className="text-lg font-bold line-clamp-1 text-black dark:text-white">{fallback}</p>
            ) : (
                <div className="rounded-full overflow-hidden">
                    <AdvancedImage key={id} cldImg={getAvatar(id)} />
                </div>
            )}
            {online && (
                <div className="absolute rounded-full right-0 bottom-0 p-0.5 bg-primary dark:bg-dark-primary">
                    <div className="bg-green-400 h-2.5 w-2.5 rounded-full"></div>
                </div>
            )}
        </section>
    )
}
export default Avatar
