import React, { useRef, useState, useEffect } from 'react';
import type { PDFDocumentProxy, RenderTask } from 'pdfjs-dist';

import './PDFThumbnail.scss';

// Use a standard CDN string for the worker to avoid bundler resolution issues in SSR
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import type { RenderParameters } from 'pdfjs-dist/types/src/display/api';

export interface PDFThumbnailProps {
	file: string;
	fileName: string;
	width?: number;
	initialPage?: number;
}

export const PDFThumbnail: React.FC<PDFThumbnailProps> = ({ file, fileName, width = 200, initialPage = 1 }) => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [pdf, setPdf] = useState<PDFDocumentProxy | null>(null);
	const [currentPage, setCurrentPage] = useState(initialPage);
	const [totalPages, setTotalPages] = useState(1);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [isTakingLong, setIsTakingLong] = useState(false);

	useEffect(() => {
		// Set a 5-second "Took too long" threshold
		const timer = setTimeout(() => {
			if (!totalPages && !error) setIsTakingLong(true);
		}, 5000);
		return () => clearTimeout(timer);
	}, [totalPages, error]);

	// 1. Handle Document Loading
	useEffect(() => {
		let isMounted = true;
		let loadingTask: any = null;

		const loadDoc = async () => {
			try {
				// 2. Import the main library
				const pdfjsLib = await import('pdfjs-dist');

				// 3. Manually set the worker
				// We use the URL provided by Vite's build system
				pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;

				// 4. Start the loading task
				loadingTask = pdfjsLib.getDocument({
					url: file,
					// These settings prevent the "hanging" you saw earlier
					cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.0.379/cmaps/',
					cMapPacked: true,
				});

				const pdfDoc = await loadingTask.promise;

				if (isMounted) {
					setPdf(pdfDoc);
					setTotalPages(pdfDoc.numPages);
					setError(null);
				}
			} catch (err: any) {
				if (isMounted) {
					console.error('PDF.js Error:', err);
					setError(`Worker Error: ${err.message}`);
				}
			} finally {
				if (isMounted) setLoading(false);
			}
		};

		loadDoc();
		return () => {
			isMounted = false;
			if (loadingTask) loadingTask.destroy();
		};
	}, [file]);

	// 2. Handle Page Rendering
	useEffect(() => {
		if (!pdf || !canvasRef.current) return;

		let renderTask: RenderTask | null = null;

		const render = async () => {
			try {
				const page = await pdf.getPage(currentPage);
				const viewport = page.getViewport({ scale: 1 });
				const scale = width / viewport.width;
				const scaledViewport = page.getViewport({ scale });

				const canvas = canvasRef.current!;
				const context = canvas.getContext('2d');
				if (!context) return;

				canvas.height = scaledViewport.height;
				canvas.width = scaledViewport.width;

				renderTask = page.render({
					canvasContext: context,
					viewport: scaledViewport,
				} as RenderParameters);
				await renderTask.promise;
			} catch (err: any) {
				if (err.name !== 'RenderingCancelledException') {
					console.error('Render error:', err);
				}
			}
		};

		render();

		return () => {
			renderTask?.cancel();
		};
	}, [pdf, currentPage, width]);

	return (
		<div className="pdf-thumbnail" style={{ width: `${width}px` }}>
			{loading && (
				<div className="loading-state">{isTakingLong ? 'Still loading... check your connection' : 'Loading...'}</div>
			)}

			{error && <div className="error-state">{error}</div>}

			<canvas ref={canvasRef} style={{ display: loading || error ? 'none' : 'block' }} />

			<div className="overlay-container">
				<div className="overlay-container__download">
					<a href={file} download={fileName} target="_blank" rel="noopener noreferrer">
						<p>Télécharger le PDF</p>
					</a>
				</div>
				{totalPages > 1 && (
					<div className="overlay-container__pdf-controls">
						<button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}>
							←
						</button>
						<span className="page-info">
							{currentPage} / {totalPages}
						</span>
						<button
							onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
							disabled={currentPage === totalPages}
						>
							→
						</button>
					</div>
				)}
			</div>
		</div>
	);
};
