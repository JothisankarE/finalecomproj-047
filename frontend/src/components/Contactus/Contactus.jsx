import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Contactus.css';

const Contact = () => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    data.append("rating", rating);

    fetch("https://formspree.io/f/myzezdyd", {
      method: 'POST',
      body: data,
      headers: { 'Accept': 'application/json' }
    }).then(response => {
      if (response.ok) {
        toast.success('Form submitted successfully!');
      } else {
        toast.error('Error submitting form');
      }
    }).catch(error => {
      toast.error('Network error: ' + error.message);
    });

    event.target.reset();
    setRating(0);
  };

  return (
    <section id="contact">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <div className="contact-form">
        <h1>Contact Us</h1><br /><br /><br />
        <div className="con">
          <div className="main">
            <div className="form-img">
              <h1>Address</h1>
              <h4>Mob/Whatsapp & Email</h4>
              <p>+91 12345 12345</p>
              <p>gowrihandlooms@gmail.com</p>
              <hr />
              <h4>Our Office Address</h4>
              <p> Erode, Tamil Nadu 638001</p>
              <hr />
              <h4>Working Hours</h4>
              <p>09 am - 07 pm (Mon - Sat)</p>
              <p>Sunday Holiday (Closed)</p>
            </div>
            <div className="cont">
              <h2>Leave Us a Message</h2>
              <form onSubmit={handleSubmit} id="contact-form">
                <input type="text" name="name" placeholder="Enter Your Name" required />
                <input type="email" name="email" placeholder="Enter Your Email" required />
                <textarea name="message" placeholder="Your Message" required></textarea>

                {/* ⭐ Star Rating System */}
                <div className="rating-container">
                  <p className="rating-text">Rate Your Experience ⭐</p>
                  <div className="star-rating">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={`star ${star <= (hover || rating) ? "active" : ""}`}
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHover(star)}
                        onMouseLeave={() => setHover(0)}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>

                <button type="submit" className="btn">
                  Send <i className="fas fa-paper-plane"></i>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;
