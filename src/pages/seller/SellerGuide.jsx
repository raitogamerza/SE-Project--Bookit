import { Link } from 'react-router-dom'
import { BookOpen, ShieldCheck, DollarSign, CheckCircle, ArrowRight } from 'lucide-react'

const SellerGuide = () => {
    return (
        <div className="min-h-screen bg-orange-50/30 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Become a Bookit Seller</h1>
                    <p className="text-xl text-gray-600">Share your stories with the world and earn from your creativity.</p>
                </div>

                {/* Benefits Section */}
                <div className="grid md:grid-cols-3 gap-8 mb-16">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-orange-100 text-center hover:-translate-y-1 transition-transform duration-300">
                        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <BookOpen className="w-6 h-6 text-orange-600" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-800 mb-2">Easy Publishing</h3>
                        <p className="text-gray-500 text-sm">Upload your e-books in PDF or EPUB formats with simple steps.</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-orange-100 text-center hover:-translate-y-1 transition-transform duration-300">
                        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <ShieldCheck className="w-6 h-6 text-orange-600" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-800 mb-2">Copyright Protection</h3>
                        <p className="text-gray-500 text-sm">We take piracy seriously. Your content is secure with our DRM protection.</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-orange-100 text-center hover:-translate-y-1 transition-transform duration-300">
                        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <DollarSign className="w-6 h-6 text-orange-600" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-800 mb-2">Fair Earnings</h3>
                        <p className="text-gray-500 text-sm">Receive up to 70% royalties on every sale directly to your account.</p>
                    </div>
                </div>

                {/* Rules & Copyright Section */}
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-12 border border-orange-200">
                    <div className="bg-orange-600 p-8 text-white">
                        <h2 className="text-2xl font-bold mb-2">Selling Rules & Copyright Policy</h2>
                        <p className="opacity-90">Please review these guidelines before proceeding.</p>
                    </div>
                    <div className="p-8 space-y-6">
                        <div className="space-y-4">
                            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                <span className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm">1</span>
                                Content Ownership
                            </h3>
                            <p className="text-gray-600 pl-10">
                                You must hold the necessary rights to any content you upload. We have a zero-tolerance policy for plagiarism and copyright infringement.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                <span className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm">2</span>
                                Prohibited Content
                            </h3>
                            <p className="text-gray-600 pl-10">
                                Content that promotes illegal acts, hate speech, or explicit violence is strictly prohibited. Bookit reserves the right to remove such content without notice.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                <span className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm">3</span>
                                Listing Accuracy
                            </h3>
                            <p className="text-gray-600 pl-10">
                                Book descriptions, covers, and metadata must accurately represent the content. Misleading information to manipulate search results is not allowed.
                            </p>
                        </div>

                        <div className="p-4 bg-orange-50 rounded-xl border border-orange-100 flex gap-3 items-start mt-6">
                            <CheckCircle className="w-5 h-5 text-orange-600 mt-0.5 shrink-0" />
                            <p className="text-sm text-gray-600">
                                By proceeding, you acknowledge that you have read and agree to Bookit's Seller Agreement and Privacy Policy. You confirm that you are the original creator or authorized distributor of the works you intend to sell.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link to="/" className="px-8 py-4 rounded-xl font-bold text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors">
                        Cancel
                    </Link>
                    <Link to="/seller/register" className="px-10 py-4 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center gap-2">
                        Accept & Continue <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default SellerGuide
