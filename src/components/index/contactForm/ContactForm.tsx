import React, { useRef, useState } from 'react';
import './ContactForm.scss';

type FieldErrors = Partial<Record<'name' | 'email' | 'message', string[]>>;

type FeedbackState =
  | { type: 'idle' }
  | { type: 'success'; message: string }
  | { type: 'error'; message: string };

export const ContactForm: React.FC = () => {
  const formRef                  = useRef<HTMLFormElement>(null);
  const [loading, setLoading]    = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [feedback, setFeedback]  = useState<FeedbackState>({ type: 'idle' });

  const clearFieldError = (field: keyof FieldErrors) => {
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formRef.current) return;

    setFeedback({ type: 'idle' });
    setFieldErrors({});
    setLoading(true);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        body: new FormData(formRef.current),
      });

      const json = await res.json();

      if (!res.ok) {
        if (json?.fieldErrors) {
          setFieldErrors(json.fieldErrors);
        } else {
          setFeedback({ type: 'error', message: json?.message ?? "Une erreur s'est produite." });
        }
        return;
      }

      formRef.current.reset();
      setFeedback({
        type: json?.key === 'succes' ? 'success' : 'error',
        message: json?.value ?? (json?.key === 'succes' ? 'Message envoyé avec succès.' : "Une erreur s'est produite."),
      });
    } catch {
      setFeedback({ type: 'error', message: "Une erreur s'est produite." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form ref={formRef} className="contact-form" onSubmit={handleSubmit}>
      {/* Honeypot — hidden from real users */}
      <div className="form-group hidden" aria-hidden="true">
        <label htmlFor="subject">Sujet</label>
        <input type="text" id="subject" name="subject" placeholder="test.website.com" tabIndex={-1} />
      </div>

      <div className="form-group">
        <label htmlFor="name">Nom</label>
        <input
          type="text"
          id="name"
          name="name"
          required
          placeholder="John Doe"
          onChange={() => clearFieldError('name')}
        />
        {fieldErrors.name && (
          <p className="field-error" role="alert">{fieldErrors.name[0]}</p>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="email">Courriel</label>
        <input
          type="email"
          id="email"
          name="email"
          required
          placeholder="johndoe@hotmail.com"
          onChange={() => clearFieldError('email')}
        />
        {fieldErrors.email && (
          <p className="field-error" role="alert">{fieldErrors.email[0]}</p>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="message">Message</label>
        <textarea
          id="message"
          name="message"
          required
          rows={4}
          placeholder="Votre message"
          onChange={() => clearFieldError('message')}
        />
        {fieldErrors.message && (
          <p className="field-error" role="alert">{fieldErrors.message[0]}</p>
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
