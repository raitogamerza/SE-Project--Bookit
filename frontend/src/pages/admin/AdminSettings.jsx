import { useState, useEffect } from 'react'
import { Settings, Palette, Save, CheckCircle, Info } from 'lucide-react'

const themes = [
    {
        name: '☕ Coffee (Default)',
        light: {
            '--color-primary': '#8B5E3C',
            '--color-primary-light': '#A07855',
            '--color-primary-dark': '#6F4B30',
            '--color-secondary': '#D4B996',
            '--color-accent': '#E8D5B5',
            '--color-background': '#F5F0E6',
            '--color-surface': '#FDFBF7',
            '--color-surface-hover': '#E8D5B5',
            '--color-text-main': '#4A3B32',
            '--color-text-light': '#8C7B70',
        },
        dark: {
            '--color-primary': '#E8D5B5',
            '--color-primary-light': '#D4B996',
            '--color-primary-dark': '#A07855',
            '--color-secondary': '#8B5E3C',
            '--color-accent': '#5C3D26',
            '--color-background': '#1A1412',
            '--color-surface': '#2A211E',
            '--color-surface-hover': '#3a2e2a',
            '--color-text-main': '#FDFBF7',
            '--color-text-light': '#D4B996',
        }
    },
    {
        name: '🌊 Ocean Breeze',
        light: {
            '--color-primary': '#0284c7',
            '--color-primary-light': '#38bdf8',
            '--color-primary-dark': '#0369a1',
            '--color-secondary': '#bae6fd',
            '--color-accent': '#e0f2fe',
            '--color-background': '#f0f9ff',
            '--color-surface': '#ffffff',
            '--color-surface-hover': '#e0f2fe',
            '--color-text-main': '#0c4a6e',
            '--color-text-light': '#7dd3fc',
        },
        dark: {
            '--color-primary': '#38bdf8',
            '--color-primary-light': '#7dd3fc',
            '--color-primary-dark': '#0284c7',
            '--color-secondary': '#0c4a6e',
            '--color-accent': '#082f49',
            '--color-background': '#082f49',
            '--color-surface': '#0c4a6e',
            '--color-surface-hover': '#075985',
            '--color-text-main': '#f0f9ff',
            '--color-text-light': '#bae6fd',
        }
    },
    {
        name: '🍃 Minty Forest',
        light: {
            '--color-primary': '#059669',
            '--color-primary-light': '#34d399',
            '--color-primary-dark': '#047857',
            '--color-secondary': '#a7f3d0',
            '--color-accent': '#d1fae5',
            '--color-background': '#ecfdf5',
            '--color-surface': '#ffffff',
            '--color-surface-hover': '#d1fae5',
            '--color-text-main': '#064e3b',
            '--color-text-light': '#6ee7b7',
        },
        dark: {
            '--color-primary': '#34d399',
            '--color-primary-light': '#6ee7b7',
            '--color-primary-dark': '#059669',
            '--color-secondary': '#064e3b',
            '--color-accent': '#022c22',
            '--color-background': '#022c22',
            '--color-surface': '#064e3b',
            '--color-surface-hover': '#065f46',
            '--color-text-main': '#ecfdf5',
            '--color-text-light': '#a7f3d0',
        }
    },
    {
        name: '🌌 Midnight Neon',
        light: {
            '--color-primary': '#9333ea',
            '--color-primary-light': '#c084fc',
            '--color-primary-dark': '#7e22ce',
            '--color-secondary': '#e9d5ff',
            '--color-accent': '#f3e8ff',
            '--color-background': '#faf5ff',
            '--color-surface': '#ffffff',
            '--color-surface-hover': '#f3e8ff',
            '--color-text-main': '#3b0764',
            '--color-text-light': '#d8b4fe',
        },
        dark: {
            '--color-primary': '#c084fc',
            '--color-primary-light': '#d8b4fe',
            '--color-primary-dark': '#9333ea',
            '--color-secondary': '#3b0764',
            '--color-accent': '#2e1065',
            '--color-background': '#2e1065',
            '--color-surface': '#3b0764',
            '--color-surface-hover': '#4c1d95',
            '--color-text-main': '#faf5ff',
            '--color-text-light': '#e9d5ff',
        }
    }
]

export const applyGlobalTheme = (themeConfig) => {
    let styleEl = document.getElementById('dynamic-admin-theme');
    if (!styleEl) {
        styleEl = document.createElement('style');
        styleEl.id = 'dynamic-admin-theme';
        document.head.appendChild(styleEl);
    }

    const buildCssRules = (selector, colors) => {
        return `${selector} { \n` + Object.entries(colors).map(([k, v]) => `  ${k}: ${v};`).join('\n') + `\n}`;
    }

    styleEl.innerHTML = `
        ${buildCssRules(':root', themeConfig.light)}
        ${buildCssRules('.dark', themeConfig.dark)}
    `;
    
    // Cleanup any lingering inline styles that might block the classes
    const root = document.documentElement;
    Object.keys(themeConfig.light).forEach(k => root.style.removeProperty(k));
}

export const getAvailableThemes = () => themes;

const AdminSettings = () => {
    const [activeTheme, setActiveTheme] = useState('☕ Coffee (Default)')
    const [saved, setSaved] = useState(false)

    useEffect(() => {
        const savedThemeName = localStorage.getItem('bookit_admin_theme')
        if (savedThemeName) {
            const foundTheme = getAvailableThemes().find(t => t.name === savedThemeName)
            if (foundTheme) {
                setActiveTheme(savedThemeName)
                applyGlobalTheme(foundTheme)
            }
        }
    }, [])

    const handleThemeSelect = (theme) => {
        setActiveTheme(theme.name)
        applyGlobalTheme(theme)
        setSaved(false)
    }

    const handleSave = () => {
        localStorage.setItem('bookit_admin_theme', activeTheme)
        
        // Indicate saving success
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
    }

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <header className="mb-8">
                <h1 className="text-3xl font-black text-[var(--color-primary-dark)] flex items-center gap-3">
                    <Settings className="w-8 h-8" /> Platform Settings
                </h1>
                <p className="text-[var(--color-text-light)] mt-2">Manage the visual appearance and globally applied configurations of the Bookit platform.</p>
            </header>

            <div className="bg-[var(--color-surface)] rounded-2xl shadow-sm border border-[var(--color-secondary)]/20 overflow-hidden">
                <div className="p-6 border-b border-[var(--color-secondary)]/20 flex items-center gap-3">
                    <Palette className="w-5 h-5 text-[var(--color-primary)]" />
                    <h2 className="text-xl font-bold text-[var(--color-text-main)]">Theme Customization</h2>
                </div>

                <div className="p-8">
                    <div className="bg-blue-50 text-blue-800 p-4 rounded-xl mb-8 flex gap-3 text-sm">
                        <Info className="w-5 h-5 flex-shrink-0" />
                        <p><strong>Note:</strong> Currently, themes are applied and saved locally in your browser to demonstrate the UI capabilities. To apply a theme globally to all users on the internet, a Database Settings table must be implemented.</p>
                    </div>

                    <h3 className="text-sm font-bold text-[var(--color-text-light)] uppercase tracking-wider mb-4">Select Global Theme Palette</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                        {themes.map((theme) => (
                            <button
                                key={theme.name}
                                onClick={() => handleThemeSelect(theme)}
                                className={`text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                                    activeTheme === theme.name 
                                        ? 'border-[var(--color-primary)] ring-4 ring-[var(--color-primary)]/10 bg-[var(--color-background)]' 
                                        : 'border-[var(--color-secondary)]/30 hover:border-[var(--color-secondary)]/80 hover:bg-[var(--color-background)]/50'
                                }`}
                            >
                                <div className="font-bold text-[var(--color-text-main)] mb-3 flex items-center justify-between">
                                    {theme.name}
                                    {activeTheme === theme.name && <CheckCircle className="w-5 h-5 text-[var(--color-primary)]" />}
                                </div>
                                <div className="flex gap-2">
                                    <div className="w-8 h-8 rounded-full shadow-sm" style={{ backgroundColor: theme.light['--color-primary'] }}></div>
                                    <div className="w-8 h-8 rounded-full shadow-sm" style={{ backgroundColor: theme.light['--color-secondary'] }}></div>
                                    <div className="w-8 h-8 rounded-full shadow-sm" style={{ backgroundColor: theme.light['--color-accent'] }}></div>
                                    <div className="w-8 h-8 rounded-full shadow-sm border border-[var(--color-secondary)]/30" style={{ backgroundColor: theme.light['--color-background'] }}></div>
                                </div>
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-4 pt-4 border-t border-[var(--color-secondary)]/20">
                        <button 
                            onClick={handleSave}
                            className="flex items-center gap-2 px-6 py-3 bg-[var(--color-primary)] text-[var(--color-text-inverse)] font-bold rounded-xl hover:bg-[var(--color-primary-dark)] transition-all shadow-md active:scale-95"
                        >
                            <Save className="w-5 h-5" />
                            {saved ? 'Saved!' : 'Save Configuration'}
                        </button>
                        {saved && (
                            <span className="text-sm font-bold text-green-600 animate-pulse flex items-center gap-1">
                                <CheckCircle className="w-4 h-4" /> Theme preferences saved
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminSettings
