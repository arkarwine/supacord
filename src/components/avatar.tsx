import { useCallback, useState } from 'react'
type Props = {
    online?: boolean
    src: string
    fallback?: string
    fullname: string
    className?: string
}

function Avatar({ fallback, src, className = '', fullname, online = false }: Props) {
    const strToHslColor = useCallback((str: string) => {
        let hash = 0
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash)
        }

        let h = hash % 360
        return 'hsl(' + h + ', ' + 44 + '%, ' + 55 + '%)'
    }, [])
    const [error, setError] = useState(false)

    return (
        <section
            className={` relative flex justify-center items-center rounded-full shadow-sm ` + className}
            style={{
                height: 48,
                width: 48,
                backgroundColor: strToHslColor(fullname),
            }}
        >
            {error ? (
                <p className="text-lg font-bold line-clamp-1 text-slate-800">{fallback}</p>
            ) : (
                <img key={src} src={src} onError={() => setError(true)} referrerPolicy="no-referrer" />
            )}
            {online && <div className="bg-green-400 h-3 w-3 absolute rounded-full right-0 bottom-0"></div>}
        </section>
    )
}
export default Avatar
