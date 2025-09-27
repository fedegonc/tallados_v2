type ContactButtonProps = {
  message: string;
};

const buildWhatsAppUrl = (message: string) => {
  const phoneNumber = '5493510000000';
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
};

const ContactButton = ({ message }: ContactButtonProps) => {
  return (
    <a className="contact-button" href={buildWhatsAppUrl(message)} target="_blank" rel="noreferrer">
      <span aria-hidden>💬</span>
      Pedir presupuesto por WhatsApp
    </a>
  );
};

export default ContactButton;
