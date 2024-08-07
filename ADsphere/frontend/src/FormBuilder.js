import React, { useState, useEffect } from "react";
import './FormBuilder.css';
import axios from "axios";
import Header from "./Components/Header";
import { useNavigate } from "react-router-dom";

function FormBuilder({ qr_link_id }) {
    const navigate = useNavigate();
    // State to hold questions fetched from the server
    const [questions, setQuestions] = useState([]);
    // State to hold the user's responses to the questions
    const [responses, setResponses] = useState({});
    // State to track the submission status ("success" or null)
    const [submissionStatus, setSubmissionStatus] = useState(null);

    // Array of city names for region-related dropdown questions
    const [cities, setCities] = useState([
        "Agra", "Ahmedabad", "Allahabad", "Amritsar", "Aurangabad",
        "Bangalore", "Bhopal", "Chandigarh", "Chennai", "Coimbatore",
        "Delhi", "Faridabad", "Ghaziabad", "Goa", "Gurgaon", "Guwahati",
        "Hyderabad", "Indore", "Jaipur", "Jodhpur", "Kanpur", "Kochi",
        "Kolkata", "Lucknow", "Ludhiana", "Madurai", "Mumbai", "Nagpur",
        "Nashik", "Navi Mumbai", "Noida", "Patna", "Pune", "Rajkot",
        "Surat", "Thane", "Vadodara", "Varanasi", "Visakhapatnam"
    ]);

    // Array of interest categories for interest-related checkbox questions
    const [interests, setInterests] = useState([
        "Arts & Crafts", "Beauty & Personal Care", "Books & Literature", "Clothing & Apparel",
        "Electronic Gadgets", "Fashion Design & Styling", "Food & Beverages",
        "Health & Wellness Products", "Home Decor", "Music & Entertainment",
        "Photography & Videography", "Sports & Outdoors", "Technology & Software",
    ]);

    // Add state variables for email and email verification status
    const [email, setEmail] = useState('');
    const [emailVerified, setEmailVerified] = useState(false);
    const [showCategorizedQuestions, setShowCategorizedQuestions] = useState(false);

    useEffect(() => {
        
        // Fetch questions from the server when the component mounts
        // axios.get("/questions")
         //     .then(res => {
        //         setQuestions(res.data);
        //     })
        //     .catch(error => {
        //         console.error("Error fetching questions:", error);
        //     });
    }, []); // Run once on mount

    // Handles user input changes for QA,Dropdown type questions
    const handleInputChange = (questionId, value) => {
        setResponses({
            ...responses,
            [questionId]: value
        });
    };

    // Handles changes in checkbox inputs for MCQ type questions
    const handleMCQInputChange = (questionId, value, isChecked) => {
        // Update the responses state with the user's selections
        setResponses(prevResponses => ({
            ...prevResponses,
            [questionId]: isChecked
                ? [...(prevResponses[questionId] || []), value] // Add the selected option
                : (prevResponses[questionId] || []).filter(option => option !== value) // Remove the deselected option
        }));
    };

    // Handles email verification
    const handleEmailVerification = async () => {
        try {
            // Make an API call to verify the provided email
            const response = await axios.get(`/verifyEmail?email=${email}`);
            // Set email verification status and show categorized questions if the email exists
            if (response.data.exists) {
                setEmailVerified(true);
                setShowCategorizedQuestions(true);
            }
            else {
                setEmailVerified(true);
                setShowCategorizedQuestions(false);
            }
            axios.get("/questions?email="+email) // Fetch questions based on the verified email
                .then(res => {
                    setQuestions(res.data);
                })
                .catch(error => {
                    console.error("Error fetching questions:", error);
                });
        } catch (error) {
            console.error("Error verifying email:", error);
        }
    };

    // Function to render each question based on its type
    const renderQuestion = (question) => {
        // Conditionally render categorized questions if showCategorizedQuestions is true
        if (showCategorizedQuestions && !question.categorize) {
            return null;
        }
        // Skip non-mandatory questions if qr_link_id is present
        if (qr_link_id && !question.mandatory) {
            return null
        }
        // if (!showCategorizedQuestions && question.categorize) {
        //     return null;
        // }

        // Determine the type of question and render the appropriate input element
        switch (question.que_type) {
            case 'QA':
                // Render text input for QA type questions
                if (question.jsonName === 'email') {
                    return (
                        <div key={question._id}>
                            <label className="question-label">{question.que} <span className="mandatory-star">{question.mandatory && '*'}</span></label>
                            <input
                                type="email"
                                className="text-input"
                                value={responses[question._id] || email}
                                onChange={(e) => handleInputChange(question._id, e.target.value)}
                                placeholder="Your Email..."
                                required={question.mandatory}
                                disabled={email != ""}
                            />
                        </div>
                    );
                } else if (question.jsonName === "region") {
                    // Render dropdown for region-related questions
                    return (
                        <div key={question._id}>
                            <label className="question-label">{question.que} <span className="mandatory-star">{question.mandatory && '*'}</span></label>
                            <select
                                className="dropdown"
                                onChange={(e) => handleInputChange(question._id, e.target.value)}
                            >
                                {cities.map(city => <option key={city} value={city}>{city}</option>)}
                            </select>
                        </div>
                    );
                } else if (question.jsonName === "interests") {
                    // Render checkboxes for interest-related questions
                    return (
                        <div key={question._id}>
                            <label className="question-label">{question.que} <span className="mandatory-star">{question.mandatory && '*'}</span></label>
                            <div className="checkbox-options">
                                {interests.map((option, index) => (
                                    <div key={`${question._id}-${index}`} className="checkbox-option">
                                        <label htmlFor={`option-${question._id}-${index}`} className="checkbox-container">
                                            <input
                                                type="checkbox"
                                                id={`option-${question._id}-${index}`}
                                                name={`option-${question._id}-${index}`}
                                                value={option}
                                                className="checkbox-input"
                                                onChange={(e) => handleMCQInputChange(question._id, option, e.target.checked)}
                                                checked={responses[question._id] && responses[question._id].includes(option)}
                                            />
                                            <span className="checkbox-custom"></span>
                                            {option}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )
                }
                else {
                    // Render general text input for other QA type questions
                    return (
                        <div key={question._id}>
                            <label className="question-label">{question.que} <span className="mandatory-star">{question.mandatory && '*'}</span></label>
                            <input
                                type="text"
                                className="text-input"
                                onChange={(e) => handleInputChange(question._id, e.target.value)}
                                placeholder="Your Response..."
                                required={question.mandatory}
                            />
                        </div>
                    );
                }
            case 'MCQ':
                // Render checkboxes for MCQ type questions
                return (
                    <div key={question._id}>
                        <label className="question-label">{question.que} <span className="mandatory-star">{question.mandatory && '*'}</span></label>
                        <div className="checkbox-options">
                            {question.options.map((option, index) => (
                                <div key={`${question._id}-${index}`} className="checkbox-option">
                                    <label htmlFor={`option-${question._id}-${index}`} className="checkbox-container">
                                        <input
                                            type="checkbox"
                                            id={`option-${question._id}-${index}`}
                                            name={`option-${question._id}-${index}`}
                                            value={option}
                                            className="checkbox-input"
                                            onChange={(e) => handleMCQInputChange(question._id, option, e.target.checked)}
                                            checked={responses[question._id] && responses[question._id].includes(option)}
                                        />
                                        <span className="checkbox-custom"></span>
                                        {option}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 'DROPDOWN':
                // Render a dropdown input for dropdown type questions
                return (
                    <div key={question._id}>
                        <label className="question-label">{question.que} <span className="mandatory-star">{question.mandatory && '*'}</span></label>
                        <select
                            className="dropdown"
                            onChange={(e) => handleInputChange(question._id, e.target.value)}
                        >
                            <option value="">Select</option>
                            {question.options.map((option, index) => (
                                <option key={index} value={option}>{option}</option>
                            ))}
                        </select>
                    </div>
                );
            default:
                // Return null for unknown question types
                return null;
        }
    };
    // State to hold the website URL to redirect the user to
    const [website_url,setwebsite_url] = useState("");
    
    // Handles form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Separate responses into normal and categorized based on the question category
            const normalResponses = {};
            const categorizedResponses = {};
            Object.entries(responses).forEach(([questionId, response]) => {
                const question = questions.find(q => q._id === questionId);
                if (question) {
                    if (question.categorize) {
                        // Store categorized responses
                        if (question.jsonName.length > 1) {
                            categorizedResponses[question.jsonName] = response;
                        }
                        else {
                            categorizedResponses[question._id] = response;
                        }
                    } else {
                        // Store normal responses
                        normalResponses[question.jsonName] = response;
                    }
                }
            });
             // Add email to the normal responses
            normalResponses["email"] = email

            // Combine normal and categorized responses
            const combinedResponses = {
                normalResponses,
                categorizedResponses
            };

            // Send form data to the server based on qr_link_id
            if (!qr_link_id) {
                // Send data for a normal form
                await axios.post('/formResponses', combinedResponses);
            }
            else {
                // Send data for a QR link form and receive website URL for redirection
                const response = await axios.post(`/record-customer-interaction?qr_link_id=${qr_link_id}`, combinedResponses);
                console.log(response)
                console.log(response.data.websiteUrl)
                setwebsite_url(response.data.websiteUrl)
            }
            // Update submission status and reset responses state
            setSubmissionStatus("success");
            console.log('Form data uploaded successfully');
            setResponses({});
            
        } catch (error) {
            console.error('Error uploading form data:', error);
            setSubmissionStatus("error");
        }
    };

    // Redirect the user to the website URL after a delay if qr_link_id is present
    function redirectToWebsite()
    {
        console.log(website_url);
        setTimeout(() => {
            window.location.href = website_url;
        }, 3000);
    }
    return (
        <>
            {submissionStatus === "success" ? (
                <div className="form-builder-main">
                    <div className="heads">
                        <p className="submit-message">Submitted successfully!</p>
                        <p className="submit-message">Thank You</p>
                        {qr_link_id && redirectToWebsite()}
                    </div>
                </div>
            ) : (
                <div className="form-builder-main">
                    <div className="heads">
                        <h1 className="headings">Questions</h1>
                        <p className="instructions">&nbsp;* indicates required question</p>
                        <p className="consent-div">
                            By submitting this form, you consent to <b>Box Ads</b>'s data collection, processing, and use of the information provided in accordance with our Privacy Policy. You understand that the information collected may be used for purposes including but not limited to: communication with you, providing products or services requested, personalization of content, analysis of user behavior, and compliance with legal obligations.
                        </p>
                    </div>
                    <div className="form-builder-container">
                        {!emailVerified ? (
                            <div>
                                <label className="question-label">
                                    Email<span className="mandatory-star">*</span>
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="text-input"
                                    placeholder="Enter your email..."
                                    required
                                />
                                <button
                                    onClick={handleEmailVerification}
                                    className="submit-button"
                                    disabled={!email}
                                >
                                    Next
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit}>
                                {/* {console.log(questions)} */}
                                {questions.map(question => renderQuestion(question))}
                                <button type="submit" className="submit-button">Submit</button>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}

export default FormBuilder;
