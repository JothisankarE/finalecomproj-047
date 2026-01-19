import React from 'react';
import './CustomerReviews.css';

const CustomerReviews = () => {

    const reviews = [
        { name: "Priya Sundaram", location: "Chennai", rating: 5, text: "The cotton quality of the Dhotis is exceptional. Very comfortable for daily wear. Highly recommended!", initial: "P" },
        { name: "Rahul Verma", location: "Bangalore", rating: 4, text: "Loved the bed spreads! The patterns are traditional yet modern. Fast delivery too.", initial: "R" },
        { name: "Anita Desai", location: "Mumbai", rating: 5, text: "Bought towels and handkerchiefs. They are super soft and absorbent. Will buy again.", initial: "A" },
        { name: "Karthik Raja", location: "Coimbatore", rating: 5, text: "Best place for authentic handloom products. The lungis are durable and vibrant.", initial: "K" },
        { name: "Sneha Reddy", location: "Hyderabad", rating: 4, text: "Good quality products at reasonable prices. The pillow covers add a nice touch to my room.", initial: "S" },
        { name: "Amit Patel", location: "Ahmedabad", rating: 5, text: "Excellent craftsmanship. You can feel the quality in every thread. Great job Gowri Handlooms!", initial: "A" }
    ];

    // Duplicate the reviews to create a seamless loop
    const marqueeReviews = [...reviews, ...reviews];

    return (
        <div className='customer-reviews'>
            <h2>Customer Stories</h2>
            <div className="review-marquee">
                <div className="marquee-content">
                    {marqueeReviews.map((review, index) => (
                        <div className="review-card" key={index}>
                            <div className="review-header">
                                <div className="reviewer-avatar">{review.initial}</div>
                                <div className="reviewer-info">
                                    <h3>{review.name}</h3>
                                    <span>{review.location}</span>
                                </div>
                            </div>
                            <div className="review-stars">
                                {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                            </div>
                            <p className="review-text">"{review.text}"</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default CustomerReviews;
