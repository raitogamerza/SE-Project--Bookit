import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, ZoomIn, ZoomOut, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react'
import { supabase } from '../../services/supabase'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'

// IMPORTANT: Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const ReadPage = () => {
    const { id } = useParams()
    const [book, setBook] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    // PDF specific states
    const [numPages, setNumPages] = useState(null)
    const [pageNumber, setPageNumber] = useState(1)
    const [scale, setScale] = useState(1.0)
    const [isPdfLoading, setIsPdfLoading] = useState(true)

    useEffect(() => {
        const fetchBook = async () => {
            try {
                // Determine whether it's coming from an explore mode (sample) or owned library
                // Assuming we use the full `fileUrl` if available, or fetch it.
                // For simplicity, we just fetch the book info exactly like BookDetail
                const { data, error } = await supabase
                    .from('books')
                    .select('*')
                    .eq('id', id)
                    .single()

                if (error) throw error
                setBook(data)
            } catch (err) {
                console.error('Error fetching book:', err)
                setError(err.message || 'Failed to load book')
            } finally {
                setLoading(false)
            }
        }

        fetchBook()
    }, [id])

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages)
        setPageNumber(1)
        setIsPdfLoading(false)
    }

    function onDocumentLoadError(error) {
        console.error('Error loading PDF!', error)
        setError('Failed to load PDF file. ' + error.message)
        setIsPdfLoading(false)
    }

    const previousPage = () => {
        setPageNumber((prev) => Math.max(prev - 1, 1))
    }

    const nextPage = () => {
        setPageNumber((prev) => Math.min(prev + 1, numPages || 1))
    }

    const zoomIn = () => setScale((prev) => Math.min(prev + 0.2, 2.5))
    const zoomOut = () => setScale((prev) => Math.max(prev - 0.2, 0.5))

    if (loading) {
        return (
            <div className="fixed inset-0 bg-[var(--color-background)] z-50 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin"></div>
            </div>
        )
    }

    if (error || !book) {
        return (
            <div className="fixed inset-0 bg-[var(--color-background)] z-50 flex items-center justify-center p-4">
                <div className="bg-[var(--color-surface)] p-8 text-center rounded-3xl shadow-xl max-w-md w-full border border-[var(--color-secondary)]/20">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-[var(--color-text-main)] mb-2">Error</h2>
                    <p className="text-[var(--color-text-light)] mb-8">{error || "Book not found"}</p>
                    <Link to="/my-library" className="px-6 py-3 bg-[var(--color-primary)] text-[var(--color-text-inverse)] rounded-xl font-bold hover:bg-[var(--color-primary-dark)] transition-colors inline-block">
                        Back to Library
                    </Link>
                </div>
            </div>
        )
    }

    const pdfSource = book.fileUrl || book.demoFileUrl // fallback to demo if no main file

    return (
        <div className="fixed inset-0 bg-[var(--color-background)] z-50 flex flex-col h-screen overflow-hidden">
            {/* Reader Controls */}
            <header className="px-4 py-3 bg-[var(--color-surface)] border-b border-[var(--color-secondary)]/20 flex items-center justify-between shadow-sm z-10 shrink-0">
                <button onClick={() => window.history.back()} className="p-2 hover:bg-[var(--color-secondary)]/10 rounded-full transition-colors group">
                    <ArrowLeft className="w-6 h-6 text-[var(--color-text-main)] group-hover:-translate-x-1 transition-transform" />
                </button>

                <div className="flex flex-col items-center">
                    <h1 className="font-bold text-sm md:text-base text-[var(--color-text-main)] line-clamp-1 max-w-[200px] md:max-w-md text-center">{book.title}</h1>
                    <span className="text-xs text-[var(--color-text-light)]">{book.author}</span>
                </div>

                <div className="flex items-center gap-1 md:gap-2">
                    <button onClick={zoomOut} className="p-2 hover:bg-[var(--color-secondary)]/10 rounded-full text-[var(--color-text-light)] hidden sm:block">
                        <ZoomOut className="w-5 h-5" />
                    </button>
                    <span className="text-xs font-medium text-[var(--color-text-light)] hidden sm:inline-block w-12 text-center">
                        {Math.round(scale * 100)}%
                    </span>
                    <button onClick={zoomIn} className="p-2 hover:bg-[var(--color-secondary)]/10 rounded-full text-[var(--color-text-light)] hidden sm:block">
                        <ZoomIn className="w-5 h-5" />
                    </button>
                </div>
            </header>

            {/* Document Render Area */}
            <div className="flex-1 overflow-auto bg-[var(--color-background)]/50 relative flex justify-center w-full">
                {isPdfLoading && pdfSource && (
                    <div className="absolute inset-0 flex items-center justify-center flex-col gap-4">
                        <div className="w-10 h-10 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-[var(--color-text-light)] font-medium">Loading PDF...</p>
                    </div>
                )}

                {!pdfSource ? (
                    <div className="flex items-center justify-center h-full w-full">
                        <p className="text-[var(--color-text-light)] text-lg">No PDF file is available for this book.</p>
                    </div>
                ) : (
                    <div className="py-8 px-4 flex justify-center min-w-full min-h-full">
                        <Document
                            file={pdfSource}
                            onLoadSuccess={onDocumentLoadSuccess}
                            onLoadError={onDocumentLoadError}
                            className="flex flex-col items-center shadow-xl mb-12"
                        >
                            <Page
                                pageNumber={pageNumber}
                                scale={scale}
                                loading={<div className="h-[800px] w-[600px] bg-[var(--color-surface)] animate-pulse flex items-center justify-center text-[var(--color-text-light)]">Loading page...</div>}
                                renderTextLayer={true}
                                renderAnnotationLayer={true}
                                className="bg-[var(--color-surface)]"
                            />
                        </Document>
                    </div>
                )}
            </div>

            {/* Footer / Navigation */}
            {numPages && (
                <footer className="px-4 py-3 bg-[var(--color-surface)] border-t border-[var(--color-secondary)]/20 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0 z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">

                    <div className="flex items-center gap-4 w-full sm:w-auto justify-center">
                        <button
                            onClick={previousPage}
                            disabled={pageNumber <= 1}
                            className="p-2 bg-[var(--color-background)] border border-[var(--color-secondary)]/30 rounded-full text-[var(--color-text-main)] hover:bg-[var(--color-secondary)]/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>

                        <span className="text-sm font-bold text-[var(--color-text-main)] min-w-[100px] text-center bg-[var(--color-background)] py-2 px-4 rounded-xl border border-[var(--color-secondary)]/20">
                            Page {pageNumber} of {numPages}
                        </span>

                        <button
                            onClick={nextPage}
                            disabled={pageNumber >= numPages}
                            className="p-2 bg-[var(--color-background)] border border-[var(--color-secondary)]/30 rounded-full text-[var(--color-text-main)] hover:bg-[var(--color-secondary)]/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="hidden sm:block w-48">
                        <div className="w-full bg-[var(--color-secondary)]/20 rounded-full h-2 mb-1 overflow-hidden">
                            <div
                                className="bg-[var(--color-primary)] h-full rounded-full transition-all duration-300"
                                style={{ width: `${(pageNumber / numPages) * 100}%` }}
                            ></div>
                        </div>
                        <div className="text-right text-xs text-[var(--color-text-light)] font-medium">
                            {Math.round((pageNumber / numPages) * 100)}% read
                        </div>
                    </div>
                </footer>
            )}
        </div>
    )
}

export default ReadPage
