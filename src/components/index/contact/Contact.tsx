import React from 'react';
import ContactForm from '@/components/index/contactForm';
import './Contact.scss';
import type { PAGE_CONTENT_QUERYResult } from 'sanity.types';

type ContactType = NonNullable<PAGE_CONTENT_QUERYResult>['contactData'];
interface ContactProps {
	data: ContactType | null;
}

export const Contact: React.FC<ContactProps> = ({ data }) => {
	const name = data?.name ?? 'Domaine de la mare';
	const phone = data?.phone ?? '+32 468 25 41 91';
	const email = data?.email ?? 'info@domainedelamare.fr';
	const contactHours = data?.contactHours ?? 'Lundi et Jeudi: de 10h à 12h';

	return (
		<article className="contact">
			<h2 className="sr-only">
				Vous avez des questions concernant votre future habitation ? Demandez conseil sans engagement auprès de
				Poortvelden Bouw.
			</h2>

			<img
				src="/img/contact.jpg"
				alt="computer, telefoon, 2 notitie boekjes op een bureau"
				width={300}
				loading="lazy"
			/>

			<div className="contact-info" id="contact">
				<h3>Contactez-nous</h3>

				<ContactForm />

				<div className="contact-details">
					<h4>{name}</h4>
					<p>
						<a href={`tel:${phone}`}>{phone}</a>
					</p>
					<p>
						<a href={`mailto:${email}`}>{email}</a>
					</p>
					<p>{contactHours}</p>
				</div>
			</div>
		</article>
	);
};
