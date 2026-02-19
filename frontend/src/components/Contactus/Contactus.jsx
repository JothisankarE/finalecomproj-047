import React, { useState, useContext } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Contactus.css';
import { StoreContext } from '../../Context/StoreContext';
import axios from 'axios';

const Contact = () => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const { url, token, userData } = useContext(StoreContext);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);

    // Collect all services
    const services = Array.from(formData.getAll('services'));

    const payload = {
      userId: userData?._id || "Guest_" + Date.now(),
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      countryCode: formData.get('countryCode'),
      services: services,
      rating: rating,
      text: formData.get('message'),
      sender: 'user',
      issueType: 'Contact Inquiry'
    };

    try {
      const response = await axios.post(`${url}/api/chat/save`, payload, {
        headers: token ? { token } : {}
      });

      if (response.data.success) {
        toast.success('Message sent successfully! We will contact you soon.');
        form.reset();
        setRating(0);
      } else {
        toast.error(response.data.message || 'Error sending message');
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error('Connection error. Please try again later.');
    }
  };

  return (
    <section className="contact-wrapper">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      
      <div className="contact-container">
        <div className="contact-left">
          <div className="contact-header">
            <h1>Get in touch</h1>
            <p>We’re here to help. Chat to our friendly team 24/7 and get set up and ready to go in just 5 minutes.</p>
          </div>

          <div className="contact-links">
            <a href="#" className="contact-link-item">
              <span className="link-icon">💬</span>
              <div className="link-content">
                <p className="link-title">Start a live chat</p>
              </div>
            </a>
            <a href="mailto:jothisankar979@gmail.com" className="contact-link-item">
              <span className="link-icon">📧</span>
              <div className="link-content">
                <p className="link-title">Shoot us an email</p>
              </div>
            </a>
            <a href="#" className="contact-link-item">
              <span className="link-icon">🐦</span>
              <div className="link-content">
                <p className="link-title">Message us on Twitter</p>
              </div>
            </a>
          </div>

          <form onSubmit={handleSubmit} className="premium-contact-form">
            <div className="form-row">
              <div className="form-group">
                <label>First name</label>
                <input type="text" name="firstName" placeholder="First name" required />
              </div>
              <div className="form-group">
                <label>Last name</label>
                <input type="text" name="lastName" placeholder="Last name" required />
              </div>
            </div>

            <div className="form-group">
              <label>Email</label>
              <input type="email" name="email" placeholder="you@company.com" required />
            </div>

            <div className="form-group">
              <label>Phone number</label>
              <div className="phone-input">
                <select name="countryCode" defaultValue="+91">
                  <option value="+91">IN +91</option>
                  <option value="+1">US +1</option>
                  <option value="+44">UK +44</option>
                  <option value="+61">AU +61</option>
                </select>
                <input type="tel" name="phone" placeholder="+1 (555) 000-0000" required />
              </div>
            </div>

            <div className="services-section">
              <label>How can we help?</label>
              <div className="services-grid">
                <label className="service-option">
                  <input type="checkbox" name="services" value="Sales" />
                  <span>Sales Support</span>
                </label>
                <label className="service-option">
                  <input type="checkbox" name="services" value="Technical" />
                  <span>Technical Help</span>
                </label>
                <label className="service-option">
                  <input type="checkbox" name="services" value="Partnership" />
                  <span>Partnership</span>
                </label>
                <label className="service-option">
                  <input type="checkbox" name="services" value="Other" />
                  <span>Other</span>
                </label>
              </div>
            </div>

            <div className="form-group">
              <label>Message</label>
              <textarea name="message" placeholder="Leave us a message..." rows="5" required></textarea>
            </div>

            {/* Premium Star Rating */}
            <div className="form-rating">
              <p>Rate your experience with us</p>
              <div className="stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`contact-star ${star <= (hover || rating) ? "active" : ""}`}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHover(star)}
                    onMouseLeave={() => setHover(0)}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>

            <button type="submit" className="send-message-btn">
              Send message
            </button>
          </form>
        </div>

        <div className="contact-right">
          <div className="map-wrapper">
            <iframe
              src="https://maps.google.com/maps?q=Erode,Tamil%20Nadu&z=15&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade">
            </iframe>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;
