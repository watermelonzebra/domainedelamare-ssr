import React, { useRef, useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import './ContactForm.scss';

type FeedbackState = { type: 'idle' } | { type: 'success'; message: string } | { type: 'error'; message: string };

export const ContactForm: React.FC = () => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();

	const formRef = useRef<HTMLFormElement>(null);
	const [loading, setLoading] = useState(false);

	const [feedback, setFeedback] = useState<FeedbackState>({ type: 'idle' });
	const API_KEY = import.meta.env.PUBLIC_MAIL_API_KEY;
	const API_URL = import.meta.env.PUBLIC_MAIL_API_URL;

	const onSubmit = async (data: any) => {
		if (!formRef.current) return;

		setFeedback({ type: 'idle' });
		setLoading(true);

		try {
			const res = await axios.post<{ message: string; success: boolean }>(API_URL, data, {
				headers: {
					'Content-Type': 'application/json',
					'X-API-Key': API_KEY,
				},
			});

			console.log('res', res.data);

			formRef.current.reset();
			setFeedback({
				type: res.data.success ? 'success' : 'error',
				message: res.data.message,
			});
		} catch {
			setFeedback({ type: 'error', message: "Une erreur s'est produite." });
		} finally {
			setLoading(false);
		}
	};

	return (
		<form ref={formRef} className="contact-form" onSubmit={handleSubmit(onSubmit)}>
			{/* Honeypot — hidden from real users */}
			<div className="form-group hidden" aria-hidden="true">
				<label htmlFor="subject">Sujet</label>
				<input
					type="text"
					id="subject"
					placeholder="test.website.com"
					tabIndex={-1}
					{...register('subject', { maxLength: 80 })}
				/>
			</div>

			<div className="form-group">
				<label htmlFor="name">Nom</label>
				<input
					type="text"
					id="name"
					placeholder="John Doe"
					{...register('name', { required: 'Le nom est obligatoire' })}
				/>
				{errors.name?.message && (
					<p className="field-error" role="alert">
						{errors.name?.message as string}
					</p>
				)}
			</div>

			<div className="form-group">
				<label htmlFor="email">E-mail</label>
				<input
					type="email"
					id="email"
					placeholder="johndoe@hotmail.com"
					{...register('email', {
						required: `L'adresse e-mail est obligatoire`,
						maxLength: 100,
						pattern: /^\S+@\S+$/i,
					})}
				/>
				{errors.email?.message && (
					<p className="field-error" role="alert">
						{errors.email?.message as string}
					</p>
				)}
			</div>

			<div className="form-group">
				<label htmlFor="message">Message</label>
				<textarea
					id="message"
					rows={4}
					placeholder="Votre message"
					{...register('message', { required: 'Un message est obligatoire', maxLength: 120 })}
				/>
				{errors.message?.message && (
					<p className="field-error" role="alert">
						{errors.message?.message as string}
					</p>
				)}
			</div>

			<button type="submit" className="btn btn--primary" disabled={loading}>
				{loading ? 'Envoi en cours…' : 'Envoyer votre message'}
			</button>

			{feedback.type === 'success' && (
				<div className="validation-message validation-message--success" role="status">
					<i className="ti ti-circle-check" />
					<p>{feedback.message}</p>
				</div>
			)}

			{feedback.type === 'error' && (
				<div className="validation-message validation-message--error" role="alert">
					<i className="ti ti-exclamation-circle" />
					<p>{feedback.message}</p>
				</div>
			)}

			<div aria-live="polite" />
		</form>
	);
};
