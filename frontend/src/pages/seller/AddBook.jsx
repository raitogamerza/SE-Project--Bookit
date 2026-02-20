import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Save, Upload, DollarSign, BookOpen, Image as ImageIcon, FileText, AlertCircle } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../services/supabase'

const AddBook = () => {
    const navigate = useNavigate()
    const { user } = useAuth()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const [demoFile, setDemoFile] = useState(null)
    const [coverFile, setCoverFile] = useState(null)

    const [formData, setFormData] = useState({
        title: '',
        author: '',
        description: '',
        price: '',
        genre: 'Fantasy',
        coverUrl: '',
        demoFileUrl: ''
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            // Validate inputs
            if (!formData.title || !formData.author || !formData.price) {
                throw new Error("Please fill in all required fields.")
            }

            let finalDemoUrl = formData.demoFileUrl;
            let finalCoverUrl = formData.coverUrl;

            // Upload PDF if selected
            if (demoFile) {
                const fileExt = demoFile.name.split('.').pop();
                const fileName = `book_${Date.now()}.${fileExt}`;
                const filePath = `${user.id}/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('books')
                    .upload(filePath, demoFile);

                if (uploadError) throw new Error(`PDF upload failed: ${uploadError.message}`);

                const { data } = supabase.storage.from('books').getPublicUrl(filePath);
                finalDemoUrl = data.publicUrl;
            }

            // Upload Cover if selected
            if (coverFile) {
                const fileExt = coverFile.name.split('.').pop();
                const fileName = `cover_${Date.now()}.${fileExt}`;
                const filePath = `${user.id}/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('books')
                    .upload(filePath, coverFile);

                if (uploadError) throw new Error(`Cover upload failed: ${uploadError.message}`);

                const { data } = supabase.storage.from('books').getPublicUrl(filePath);
                finalCoverUrl = data.publicUrl;
            }

            // Get the current user's session token to pass to the backend
            const { data: { session } } = await supabase.auth.getSession();
            const token = session?.access_token;

            // Call the Node.js Express backend
            const response = await fetch('http://localhost:5000/api/books', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    title: formData.title,
                    author: formData.author,
                    description: formData.description,
                    price: formData.price,
                    genre: formData.genre,
                    coverUrl: finalCoverUrl,
                    demoFileUrl: finalDemoUrl,
                    sellerId: user.id
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to add book.");
            }

            console.log("Submitted book via backend:", data)

            alert("Book added successfully!")
            navigate('/seller')
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-orange-50/30 pb-12">
            {/* Header */}
            <header className="bg-[var(--color-surface)] border-b border-[var(--color-secondary)]/10 sticky top-0 z-30">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link to="/seller" className="p-2 hover:bg-orange-50 rounded-full text-[var(--color-text-light)] transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <h1 className="text-xl font-bold text-[var(--color-text-main)]">Add New Book</h1>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    {error && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 flex items-center gap-3 border border-red-100">
                            <AlertCircle className="w-5 h-5" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Info */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-[var(--color-surface)] rounded-2xl shadow-sm border border-[var(--color-secondary)]/10 p-6">
                                <h2 className="text-lg font-bold text-[var(--color-text-main)] mb-4 flex items-center gap-2">
                                    <BookOpen className="w-5 h-5 text-orange-600" />
                                    Book Details
                                </h2>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-[var(--color-text-main)] mb-1">Book Title</label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 rounded-xl border border-[var(--color-secondary)]/20 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all"
                                            placeholder="e.g., The Lost Kingdom"
                                            required
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-[var(--color-text-main)] mb-1">Author Name</label>
                                            <input
                                                type="text"
                                                name="author"
                                                value={formData.author}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 rounded-xl border border-[var(--color-secondary)]/20 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all"
                                                placeholder="e.g., Jane Doe"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-[var(--color-text-main)] mb-1">Genre</label>
                                            <select
                                                name="genre"
                                                value={formData.genre}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 rounded-xl border border-[var(--color-secondary)]/20 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all bg-[var(--color-surface)]"
                                            >
                                                <option value="Fantasy">Fantasy</option>
                                                <option value="Sci-Fi">Sci-Fi</option>
                                                <option value="Romance">Romance</option>
                                                <option value="Adventure">Adventure</option>
                                                <option value="Mystery">Mystery</option>
                                                <option value="Non-Fiction">Non-Fiction</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-[var(--color-text-main)] mb-1">Description</label>
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleChange}
                                            rows="5"
                                            className="w-full px-4 py-2 rounded-xl border border-[var(--color-secondary)]/20 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all resize-none"
                                            placeholder="Write a compelling summary..."
                                        ></textarea>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-[var(--color-surface)] rounded-2xl shadow-sm border border-[var(--color-secondary)]/10 p-6">
                                <h2 className="text-lg font-bold text-[var(--color-text-main)] mb-4 flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-orange-600" />
                                    Content
                                </h2>

                                <div>
                                    <label className="block text-sm font-medium text-[var(--color-text-main)] mb-1">Book File (PDF/EPUB)</label>
                                    <input
                                        type="file"
                                        accept=".pdf,.epub"
                                        onChange={(e) => setDemoFile(e.target.files[0])}
                                        className="w-full px-4 py-3 rounded-xl border border-[var(--color-secondary)]/20 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 cursor-pointer"
                                    />
                                    {demoFile && <p className="text-sm text-green-600 mt-2 font-medium">Selected: {demoFile.name}</p>}

                                    <div className="mt-4">
                                        <p className="text-xs text-[var(--color-text-light)] mb-1">Or provide a direct URL instead:</p>
                                        <input
                                            type="url"
                                            name="demoFileUrl"
                                            value={formData.demoFileUrl}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 rounded-xl border border-[var(--color-secondary)]/20 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all text-sm"
                                            placeholder="https://..."
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar Info */}
                        <div className="space-y-6">
                            <div className="bg-[var(--color-surface)] rounded-2xl shadow-sm border border-[var(--color-secondary)]/10 p-6">
                                <h2 className="text-lg font-bold text-[var(--color-text-main)] mb-4 flex items-center gap-2">
                                    <DollarSign className="w-5 h-5 text-orange-600" />
                                    Pricing
                                </h2>

                                <div>
                                    <label className="block text-sm font-medium text-[var(--color-text-main)] mb-1">Price (USD)</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-2 text-[var(--color-text-light)]">$</span>
                                        <input
                                            type="number"
                                            name="price"
                                            value={formData.price}
                                            onChange={handleChange}
                                            min="0"
                                            step="0.01"
                                            className="w-full pl-8 pr-4 py-2 rounded-xl border border-[var(--color-secondary)]/20 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all font-bold text-lg text-[var(--color-text-main)]"
                                            placeholder="0.00"
                                            required
                                        />
                                    </div>
                                    <p className="text-xs text-[var(--color-text-light)] mt-2">You will earn 70% of each sale.</p>
                                </div>
                            </div>

                            <div className="bg-[var(--color-surface)] rounded-2xl shadow-sm border border-[var(--color-secondary)]/10 p-6">
                                <h2 className="text-lg font-bold text-[var(--color-text-main)] mb-4 flex items-center gap-2">
                                    <ImageIcon className="w-5 h-5 text-orange-600" />
                                    Cover Image
                                </h2>

                                <div className="space-y-4">
                                    <div className="aspect-[2/3] bg-[var(--color-secondary)]/10 rounded-xl overflow-hidden border border-[var(--color-secondary)]/20 flex items-center justify-center relative group">
                                        {(coverFile || formData.coverUrl) ? (
                                            <img src={coverFile ? URL.createObjectURL(coverFile) : formData.coverUrl} alt="Preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="text-center p-4">
                                                <ImageIcon className="w-8 h-8 text-[var(--color-secondary)] mx-auto mb-2" />
                                                <p className="text-xs text-[var(--color-text-light)]">No image selected</p>
                                            </div>
                                        )}
                                    </div>

                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setCoverFile(e.target.files[0])}
                                        className="w-full px-2 py-2 rounded-xl border border-[var(--color-secondary)]/20 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 cursor-pointer text-sm"
                                    />

                                    <div>
                                        <p className="text-xs text-[var(--color-text-light)] mb-1">Or direct URL:</p>
                                        <input
                                            type="url"
                                            name="coverUrl"
                                            value={formData.coverUrl}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 rounded-xl border border-[var(--color-secondary)]/20 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all text-sm"
                                            placeholder="https://..."
                                        />
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 bg-orange-600 text-[var(--color-text-inverse)] rounded-xl font-bold hover:bg-orange-700 transition-all shadow-lg hover:shadow-xl active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2"
                            >
                                <Save className="w-5 h-5" />
                                {loading ? 'Publishing...' : 'Publish Book'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default AddBook
