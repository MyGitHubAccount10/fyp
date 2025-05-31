import React, { useState } from 'react';
import './Website.css';
import Header from './Header';


// FAQ Data Structure
const faqData = {
  "account-login": {
    id: "account-login",
    bannerImage: "/images/Phone.png",
    bannerTitle: "Account & Login",
    navText: "Account & Login",
    icon: "💼", // Briefcase emoji
    description: "Help with signing in, creating an account, or updating your profile details.",
    questions: [
      {
        id: "q1-1",
        question: "How do I reset my password?",
        answer: "Click on the \"Forgot Password?\" link on the login page. Enter your email address and we'll send you a link to reset your password. If you don't see the email, check your spam or junk folder."
      },
      {
        id: "q1-2",
        question: "How can I update my email address?",
        answer: "To update your email address, please go to your Profile settings. Under Personal Information, you will find an option to edit your email. For security reasons, you might be asked to verify your new email address."
      },
      {
        id: "q1-3",
        question: "Why can't I log into my account?",
        answer: "If you're having trouble logging in, please ensure you are using the correct username and password. You can try resetting your password. If the issue persists, make sure your account hasn't been locked due to multiple failed login attempts or contact support for assistance."
      },
      {
        id: "q1-4",
        question: "How do I create a new account?",
        answer: "To create a new account, click on the 'Sign Up' button usually found on the login page or in the header. You'll be asked to provide some basic information like your email, a username, and a password."
      }
    ]
  },
  "orders-shipping": {
    id: "orders-shipping",
    bannerImage: "/images/Box.png",
    bannerTitle: "Orders & Shipping",
    navText: "Orders & Shipping",
    icon: "📦", // Parcel emoji
    description: "Find info about placing orders, tracking packages, and delivery times.",
    questions: [
      {
        id: "q2-1",
        question: "How long does shipping take?",
        answer: "Standard shipping usually takes 3-5 business days. For express shipping, it takes 1-2 business days. You'll receive a tracking number by email once your order ships."
      },
      {
        id: "q2-2",
        question: "How can I track my order?",
        answer: "Once your order has shipped, you will receive an email with a tracking number and a link to the carrier's website. You can use this information to track the progress of your shipment. You can also find tracking information in your Order History if you have an account."
      },
      {
        id: "q2-3",
        question: "Do you ship internationally?",
        answer: "Currently, we primarily ship within Singapore. For international shipping inquiries, please contact our customer support team to see if arrangements can be made for your specific location."
      },
      {
        id: "q2-4",
        question: "What if my order is damaged or lost in transit?",
        answer: "If your order arrives damaged, please contact us immediately with photos of the damage and your order number. If your order appears to be lost in transit, please reach out to our customer support so we can investigate with the shipping carrier."
      }
    ]
  },
  "payment-refunds": {
    id: "payment-refunds",
    bannerImage: "/images/Phone.png", // Using Phone.png as a generic placeholder
    bannerTitle: "Payment & Refunds",
    navText: "Payment & Refunds",
    icon: "💳", // Credit card emoji
    description: "Information about payment methods, billing, and our refund policy.",
    questions: [
      { id: "q3-1", question: "What payment methods do you accept?", answer: "We accept various payment methods including major credit cards (Visa, MasterCard, American Express), PayPal, Apple Pay, Google Pay, and other local payment options available at checkout." },
      { id: "q3-2", question: "What is your refund policy?", answer: "Our refund policy allows for returns within 30 days of purchase for most items, provided they are in unused, original condition with all tags attached. Custom orders may have different conditions. Please see our full refund policy page for complete details and exceptions." },
      { id: "q3-3", question: "How long does it take to process a refund?", answer: "Once a return is received and inspected, we will notify you of the approval or rejection of your refund. If approved, your refund will be processed, and a credit will automatically be applied to your original method of payment, usually within 5-10 business days." },
    ]
  },
  "technical-issues": {
    id: "technical-issues",
    bannerImage: "/images/Phone.png", // Using Phone.png as a generic placeholder
    bannerTitle: "Technical Issues",
    navText: "Technical Issues",
    icon: "⚙️", // Gear emoji
    description: "Help with website errors, bugs, or other technical problems.",
    questions: [
      { id: "q4-1", question: "The website is not loading correctly. What should I do?", answer: "First, try clearing your browser's cache and cookies, or try accessing the website from a different browser or in incognito/private mode. If the problem persists, please contact our support team with details about the issue, your browser version, and any error messages you see." },
      { id: "q4-2", question: "I'm experiencing an error when trying to checkout.", answer: "Please double-check all your payment and shipping information for accuracy. Sometimes, a simple typo can cause issues. If you continue to experience errors, take a screenshot if possible and contact our customer support for immediate assistance." },
    ]
  },
  "product-information": {
    id: "product-information",
    bannerImage: "/images/Box.png", // Using Box.png as a generic placeholder
    bannerTitle: "Product Information",
    navText: "Product Information",
    icon: "ℹ️", // Info emoji
    description: "Details about our products, materials, and care instructions.",
    questions: [
      { id: "q5-1", question: "Where are your skimboards made?", answer: "Our skimboards are proudly handcrafted in Singapore, using high-quality materials sourced both locally and internationally to ensure top performance and durability." },
      { id: "q5-2", question: "How do I care for my custom skimboard?", answer: "To care for your skimboard, rinse it with fresh water after each use, especially if used in saltwater, to remove sand and salt. Avoid prolonged exposure to direct sunlight and extreme temperatures, as this can damage the board. Store it in a cool, dry place, preferably in a board bag to protect it from dings and scratches." },
      { id: "q5-3", question: "What materials are used in your skimboards?", answer: "We use a variety of high-quality materials depending on the board model, including durable foam cores, epoxy resins, and fiberglass or carbon fiber for reinforcement, ensuring a balance of lightness, strength, and performance." },
    ]
  }
};
const faqCategoryOrder = ["account-login", "orders-shipping", "payment-refunds", "technical-issues", "product-information"];


// Simple SVG Icons for secondary navigation (black color is set via CSS or inline fill)
const SearchIconFaq = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M21 21L16.65 16.65" stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);


const FaqPage = () => {
  const [activeCategoryKey, setActiveCategoryKey] = useState(faqCategoryOrder[0]);
  const [activeQuestionId, setActiveQuestionId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleCategorySelect = (categoryKey) => {
    setActiveCategoryKey(categoryKey);
    setActiveQuestionId(null); // Reset question when category changes
    setSearchTerm(''); // Reset search term
  };

  const handleQuestionSelect = (questionId) => {
    setActiveQuestionId(questionId);
  };
  
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    // Potentially filter questions here or on submit
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Implement search logic if needed. For now, it just clears the active question.
    // This could filter the `displayedQuestions` based on `searchTerm`.
    setActiveQuestionId(null); // Show category overview or search results
    alert(`Searching for: ${searchTerm} (Search functionality to be fully implemented)`);
  };

  const currentCategoryData = faqData[activeCategoryKey];
  let displayedQuestions = currentCategoryData.questions;

  // Basic search filtering (can be improved)
  if (searchTerm && !activeQuestionId) {
    displayedQuestions = currentCategoryData.questions.filter(q => 
      q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }


  return (
    <>
      <Header />
      {/* --- MAIN FAQ PAGE CONTENT --- */}
      <main className="faq-page-content">
        <section className="faq-banner-section" style={{ backgroundImage: `url(${currentCategoryData.bannerImage})` }}>
          <h1 className="faq-banner-title">{currentCategoryData.bannerTitle}</h1>
        </section>

        <section className="faq-search-section container">
          <form className="faq-search-bar-form" onSubmit={handleSearchSubmit}>
            <SearchIconFaq />
            <input 
              type="search" 
              placeholder="Search for questions..." 
              className="faq-search-input"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </form>
        </section>

        <section className="faq-main-area container">
          <aside className="faq-sidebar">
            <nav className="faq-nav">
              {faqCategoryOrder.map(key => {
                const category = faqData[key];
                return (
                  <a
                    href="#"
                    key={category.id}
                    className={`faq-nav-item ${activeCategoryKey === category.id ? 'active' : ''}`}
                    onClick={(e) => { e.preventDefault(); handleCategorySelect(category.id); }}
                  >
                    {category.navText}
                    {activeCategoryKey === category.id && <span className="faq-nav-active-indicator"></span>}
                  </a>
                );
              })}
            </nav>
          </aside>
          <section className="faq-content-display">
            {activeQuestionId === null ? (
              // Category Overview / Search Results
              <>
                <div className="faq-category-header">
                  <span className="faq-category-icon" role="img" aria-label={`${currentCategoryData.navText} icon`}>{currentCategoryData.icon}</span>
                  <h2 className="faq-category-title">{currentCategoryData.navText}</h2>
                </div>
                <p className="faq-category-description">{currentCategoryData.description}</p>
                <hr className="faq-divider" />
                <ul className="faq-question-list">
                  {displayedQuestions.length > 0 ? (
                    displayedQuestions.map(q => (
                      <li key={q.id} className="faq-question-list-item">
                        <a href="#" onClick={(e) => { e.preventDefault(); handleQuestionSelect(q.id); }}>
                          {q.question}
                        </a>
                      </li>
                    ))
                  ) : (
                    <li className="faq-no-results">No questions found matching your search.</li>
                  )}
                </ul>
              </>
            ) : (
              // Specific Question and Answer
              <>
                <h2 className="faq-answer-title">
                    {currentCategoryData.questions.find(q => q.id === activeQuestionId)?.question}
                </h2>
                <p className="faq-answer-text">
                    {currentCategoryData.questions.find(q => q.id === activeQuestionId)?.answer}
                </p>
                 <a href="#" className="faq-back-link" onClick={(e) => {e.preventDefault(); setActiveQuestionId(null);}}>
                    ← Back to {currentCategoryData.navText}
                </a>
              </>
            )}
          </section>
        </section>
      </main>

      {/* --- FOOTER --- */}
      <footer className="footer">
        <div className="footer-column">
          <strong>#THISSIDEUP</strong>
          <div className="social-icons">
            <a href="#" aria-label="Instagram" title="Instagram"><img src="https://img.icons8.com/ios-filled/50/ffffff/instagram-new.png" alt="Instagram" /></a>
            <a href="#" aria-label="TikTok" title="TikTok"><img src="https://img.icons8.com/ios-filled/50/ffffff/tiktok--v1.png" alt="TikTok" /></a>
          </div>
        </div>
        <div className="footer-column">
          <strong>Customer Service</strong>
          <a href="#">Contact</a><br />
          <a href="#">FAQ</a><br />
          <a href="#">About</a>
        </div>
        <div className="footer-column">
          <strong>Handcrafted in Singapore</strong>
          Here at This Side Up, we're a passionate, Singapore-based skimboard company committed to bringing the exhilarating rush of skimboarding to enthusiasts of every skill level. We specialize in crafting custom-designed skimboards, blending high-quality materials with your unique, personalized designs. The result? Boards that not only perform exceptionally but let your individual style shine on the shore. Rooted in Singapore's vibrant coastal culture, we aim to inspire a spirited community of adventure seekers and champion an active, sun-soaked lifestyle.
        </div>
      </footer>
    </>
  );
};

export default FaqPage;