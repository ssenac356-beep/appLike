

export default function ({ children, text }) {
    return (
        <a className="flex items-center gap-3 text-sm font-semibold text-zinc-200 hover:text-red-500 transition-colors" >
            {children}
            {text}
        </a>
    )
}