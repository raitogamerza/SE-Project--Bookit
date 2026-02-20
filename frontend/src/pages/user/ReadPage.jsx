import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Settings, Type, List } from 'lucide-react'

const ReadPage = () => {
    const { id } = useParams()

    return (
        <div className="fixed inset-0 bg-[#FDFBF7] z-50 flex flex-col">
            {/* Reader Controls */}
            <header className="px-4 py-3 bg-[var(--color-surface)] border-b border-[var(--color-secondary)]/20 flex items-center justify-between shadow-sm">
                <Link to="/my-library" className="p-2 hover:bg-[var(--color-secondary)]/10 rounded-full transition-colors">
                    <ArrowLeft className="w-6 h-6 text-[var(--color-text-main)]" />
                </Link>
                <div className="flex flex-col items-center">
                    <h1 className="font-bold text-sm text-[var(--color-text-main)]">Sakura Memories</h1>
                    <span className="text-xs text-[var(--color-text-light)]">Chapter 1: The Beginning</span>
                </div>
                <div className="flex gap-2">
                    <button className="p-2 hover:bg-[var(--color-secondary)]/10 rounded-full text-[var(--color-text-light)]">
                        <Type className="w-5 h-5" />
                    </button>
                    <button className="p-2 hover:bg-[var(--color-secondary)]/10 rounded-full text-[var(--color-text-light)]">
                        <List className="w-5 h-5" />
                    </button>
                    <button className="p-2 hover:bg-[var(--color-secondary)]/10 rounded-full text-[var(--color-text-light)]">
                        <Settings className="w-5 h-5" />
                    </button>
                </div>
            </header>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-6 md:p-12 max-w-3xl mx-auto w-full prose prose-lg prose-brown">
                <p>
                    The cherry blossoms were falling like snow that day. It was appropriate, she thought, for the end of something beautiful.
                </p>
                <p>
                    "Are you sure about this?" Kenji asked, his voice barely audible over the wind.
                </p>
                <p>
                    Aiko nodded, clutching the small wooden box tighter to her chest. "It's the only way. To remember, we have to forget first."
                </p>
                <p>
                    They walked in silence towards the old shrine, the path littered with pink petals. The air smelled of rain and incense. This place had always been their sanctuary, a hidden world away from the noise of Tokyo.
                </p>
                <p>
                    As they reached the torii gate, Aiko stopped. She looked back at the city skyline, a blur of lights and concrete. "Do you think we'll find our way back?"
                </p>
                <p>
                    Kenji took her hand, his fingers warm against hers. "We found each other once. We can do it again."
                </p>
                <div className="flex justify-center py-8 text-[var(--color-text-light)] text-sm">
                    - Page 1 / 320 -
                </div>
            </div>

            {/* Footer / Progress */}
            <footer className="px-6 py-4 bg-[var(--color-surface)] border-t border-[var(--color-secondary)]/20">
                <div className="w-full bg-[var(--color-secondary)]/10 rounded-full h-1 mb-2">
                    <div className="bg-[var(--color-primary)] h-full rounded-full w-[1%]"></div>
                </div>
                <div className="flex justify-between text-xs text-[var(--color-text-light)]">
                    <span>1% completed</span>
                    <span>1 min left in chapter</span>
                </div>
            </footer>
        </div>
    )
}

export default ReadPage
