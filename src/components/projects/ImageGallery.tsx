import { useState, useEffect, useCallback, useRef, type TouchEventHandler } from 'react';
import { Icon } from '../ui/Icon';

type ImageGallery = Array<{
	src?: string;
	thumb?: string;
	alt?: string;
}>;

/**
 * ImageGallery
 * @param {{ images: Array<{src: string, thumb: string, alt: string}> }} props
 */
export default function Gallery({ images = [] }: { images: ImageGallery }) {
	const [active, setActive] = useState(0);
	const [modal, setModal] = useState(false);
	const [fading, setFading] = useState(false);
	const touchStartX = useRef<number | null>(null);

	const len = images.length;
	const prevIdx = (((active - 1) % len) + len) % len;
	const nextIdx = (active + 1) % len;

	const go = useCallback(
		(idx: number) => {
			if (idx === active || fading) return;
			setFading(true);
			setTimeout(() => {
				setActive(idx);
				setFading(false);
			}, 220);
		},
		[active, fading],
	);

	useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			if (e.key === 'ArrowLeft') go(prevIdx);
			if (e.key === 'ArrowRight') go(nextIdx);
			if (e.key === 'Escape') setModal(false);
		};
		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	}, [go, prevIdx, nextIdx]);

	// touch / swipe support
	const onTouchStart: TouchEventHandler<HTMLDivElement> = (e) => {
		touchStartX.current = e.touches[0].clientX;
	};
	const onTouchEnd: TouchEventHandler<HTMLDivElement> = (e) => {
		if (touchStartX.current === null) return;
		const delta = e.changedTouches[0].clientX - touchStartX.current;
		if (Math.abs(delta) > 40) go(delta < 0 ? nextIdx : prevIdx);
		touchStartX.current = null;
	};

	if (!len) return null;

	const current = images[active];
	const prevImg = images[prevIdx];
	const nextImg = images[nextIdx];

	return (
		<>
			{/* ── GALLERY STRIP ── */}
			<div
				className="ig-wrap"
				onTouchStart={onTouchStart}
				onTouchEnd={onTouchEnd}
				role="region"
				aria-label="Image gallery"
			>
				{/* PREV */}
				<button className="ig-nav" onClick={() => go(prevIdx)} aria-label="Previous image">
					<div className="ig-nav-bg" style={{ backgroundImage: `url(${prevImg.thumb})` }} />
					<span className="ig-nav-icon">
						<Icon type="chevron-left" stroke={2} />
					</span>
				</button>

				{/* ACTIVE IMAGE */}
				<div className="ig-main">
					<img
						key={active}
						className={`ig-img${fading ? ' fading' : ''}`}
						src={current.src}
						alt={current.alt}
						onClick={() => setModal(true)}
						draggable={false}
					/>
					<span className="ig-counter" aria-label={`Image ${active + 1} of ${len}`}>
						{active + 1}/{len}
					</span>
				</div>

				{/* NEXT */}
				<button className="ig-nav" onClick={() => go(nextIdx)} aria-label="Next image">
					<div className="ig-nav-bg" style={{ backgroundImage: `url(${nextImg.thumb})` }} />
					<span className="ig-nav-icon">
						<Icon type="chevron-right" stroke={2} />
					</span>
				</button>
			</div>

			{/* ── FULLSCREEN MODAL ── */}
			{modal && (
				<div
					className="ig-modal"
					onClick={(e) => {
						if (e.target === e.currentTarget) setModal(false);
					}}
					role="dialog"
					aria-modal="true"
					aria-label="Fullscreen image viewer"
				>
					<button className="ig-modal-close" onClick={() => setModal(false)} aria-label="Close">
						<Icon type="times" stroke={2} />
					</button>

					<button className="ig-modal-nav left" onClick={() => go(prevIdx)} aria-label="Previous image">
						<Icon type="chevron-left" stroke={2} />
					</button>

					<img key={`m-${active}`} className="ig-modal-img" src={current.src} alt={current.alt} draggable={false} />

					<button className="ig-modal-nav right" onClick={() => go(nextIdx)} aria-label="Next image">
						<Icon type="chevron-right" stroke={2} />
					</button>

					<p className="ig-modal-counter">
						{active + 1} / {len}
					</p>
				</div>
			)}
		</>
	);
}
