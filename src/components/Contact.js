import React, { useRef } from 'react';
import emailjs from '@emailjs/browser';

function Contact() {
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs.sendForm('service_d4dbrnt', 'template_2ejxt28', form.current, 'kjhLCa49ByPlH7xGn')
      .then((result) => {
          console.log('SUCCESS!', result.text);
          alert('Message sent successfully!');
      }, (error) => {
          console.error('FAILED...', error.text);
          alert('Failed to send message, please try again later.');
      });

    e.target.reset();
  };

  return (
    <form ref={form} onSubmit={sendEmail} className="contact-form">
      <h2>Contact Us</h2>
      <div>
        <label>Name</label>
        <input type="text" name="name" required />
      </div>
      <div>
        <label>Email</label>
        <input type="email" name="email" required />
      </div>
      <div>
        <label>Message</label>
        <textarea name="message" required></textarea>
      </div>
      <input type="hidden" name="title" value="General Inquiry" />
      <button type="submit">Send</button>
    </form>
  );
}

export default Contact; 