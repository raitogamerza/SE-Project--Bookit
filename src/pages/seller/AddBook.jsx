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

            // In a real app, we would upload files to Supabase Storage here
            // and then insert a record into the 'books' table.

            // Simulation of API call
            await new Promise(resolve => setTimeout(resolve, 1500))

            // For now, just log the data and redirect
            console.log("Submitting book:", { ...formData, seller_id: user.id })

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
            <header className="bg-white border-b border-orange-100 sticky top-0 z-30">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link to="/seller" className="p-2 hover:bg-orange-50 rounded-full text-gray-500 transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <h1 className="text-xl font-bold text-gray-800">Add New Book</h1>
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
                            <div className="bg-white rounded-2xl shadow-sm border border-orange-100 p-6">
                                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <BookOpen className="w-5 h-5 text-orange-600" />
                                    Book Details
                                </h2>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Book Title</label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all"
                                            placeholder="e.g., The Lost Kingdom"
                                            required
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Author Name</label>
                                            <input
                                                type="text"
                                                name="author"
                                                value={formData.author}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all"
                                                placeholder="e.g., Jane Doe"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Genre</label>
                                            <select
                                                name="genre"
                                                value={formData.genre}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all bg-white"
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
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleChange}
                                            rows="5"
                                            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all resize-none"
                                            placeholder="Write a compelling summary..."
                                        ></textarea>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl shadow-sm border border-orange-100 p-6">
                                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-orange-600" />
                                    Content
                                </h2>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Book File (PDF/EPUB)</label>
                                    <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer group">
                                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2 group-hover:text-orange-500 transition-colors" />
                                        <p className="text-sm text-gray-500 group-hover:text-gray-700">Click to upload or drag and drop</p>
                                        <p className="text-xs text-gray-400 mt-1">Max file size: 50MB</p>
                                    </div>
                                    {/* Mock input field for now */}
                                    <input
                                        type="url"
                                        name="demoFileUrl"
                                        value={formData.demoFileUrl}
                                        onChange={handleChange}
                                        className="mt-4 w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all"
                                        placeholder="Or enter direct file URL"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Sidebar Info */}
                        <div className="space-y-6">
                            <div className="bg-white rounded-2xl shadow-sm border border-orange-100 p-6">
                                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <DollarSign className="w-5 h-5 text-orange-600" />
                                    Pricing
                                </h2>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Price (USD)</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-2 text-gray-500">$</span>
                                        <input
                                            type="number"
                                            name="price"
                                            value={formData.price}
                                            onChange={handleChange}
                                            min="0"
                                            step="0.01"
                                            className="w-full pl-8 pr-4 py-2 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all font-bold text-lg text-gray-800"
                                            placeholder="0.00"
                                            required
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2">You will earn 70% of each sale.</p>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl shadow-sm border border-orange-100 p-6">
                                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <ImageIcon className="w-5 h-5 text-orange-600" />
                                    Cover Image
                                </h2>

                                <div className="space-y-4">
                                    <div className="aspect-[2/3] bg-gray-100 rounded-xl overflow-hidden border border-gray-200 flex items-center justify-center relative group">
                                        {formData.coverUrl ? (
                                            <img src={formData.coverUrl} alt="Preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="text-center p-4">
                                                <ImageIcon className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                                                <p className="text-xs text-gray-400">No image selected</p>
                                            </div>
                                        )}
                                    </div>

                                    <input
                                        type="url"
                                        name="coverUrl"
                                        value={formData.coverUrl}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all text-sm"
                                        placeholder="Image URL (https://...)"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700 transition-all shadow-lg hover:shadow-xl active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2"
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
