import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import 'react-phone-number-input/style.css';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import "../button/Button.scss";
import axios from 'axios';

const apiKey = process.env.REACT_APP_CONTACT_REQUEST_APP_API_KEY;
const apiUrl = process.env.REACT_APP_CONTACT_REQUEST_APP_URL;

function ContactMe() {
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [subject, setSubject] = useState('');
    const [comment, setComment] = useState('');
    const [submissionStatus, setSubmissionStatus] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [phoneError, setPhoneError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [fullNameError, setFullNameError] = useState('');
    const [subjectError, setSubjectError] = useState('');
    const [commentError, setCommentError] = useState('');

    const handleFullNameChange = (event) => {
        setFullName(event.target.value);
        setFullNameError('');
        setSubmissionStatus(null);
    };

    const handlePhoneChange = (value) => {
        setPhone(value);
        setPhoneError('');
        setSubmissionStatus(null);
    };

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
        setEmailError('');
        setSubmissionStatus(null);
    };

    const handleSubjectChange = (event) => {
        setSubject(event.target.value);
        setSubjectError('');
        setSubmissionStatus(null);
    };

    const handleCommentChange = (event) => {
        setComment(event.target.value);
        setCommentError('');
        setSubmissionStatus(null);
    };

    const validateFullName = () => {
        if (!fullName) {
            setFullNameError('Full name is required');
            return false;
        }
        return true;
    };

    const validateSubject = () => {
        if (!subject) {
            setSubjectError('Subject is required');
            return false;
        }
        return true;
    };

    const validateComment = () => {
        if (!comment) {
            setCommentError('Comment is required');
            return false;
        }
        return true;
    };

    const validatePhone = () => {
        if (phone && !isValidPhoneNumber(phone)) {
            setPhoneError('Invalid phone number');
            return false;
        }
        // Additional phone number validation logic can be added here if needed
        return true;
    };

    const validateEmail = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            setEmailError('Email address is required');
            return false;
        }
        if (!emailRegex.test(email)) {
            setEmailError('Invalid email address');
            return false;
        }
        return true;
    };

    const renderLabel = (label, isMandatory) => (
        <div>
            {label}
            {isMandatory && <span style={{ color: 'red' }}>*</span>}
        </div>
    );

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (isSubmitting) {
            return;
        }

        if (isInputValid()) {

            setIsSubmitting(true);

            console.log(process.env.CONTACT_REQUEST_APP_API_KEY);

            const requestBody = {
                email: email,
                fullName: fullName,
                phone: phone,
                subject: subject,
                comment: comment
            };

            console.log(apiUrl);
            console.log(apiKey);

            const headers = {
                'Content-Type': 'application/json',
                'X-Api-Key': apiKey
            };

            try {
                await axios.post(apiUrl, requestBody, { headers });

                setSubmissionStatus('success');
            } catch (error) {
                // Handle errors
                console.error('Error:', error);
                setSubmissionStatus('error');
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    const isInputValid = (event) => {

        // Validate email and phone before submission
        const isPhoneValid = validatePhone();
        const isEmailValid = validateEmail();
        const isFullNameValid = validateFullName();
        const isSubjectValid = validateSubject();
        const isCommentValid = validateComment();

        return isCommentValid && isSubjectValid && isFullNameValid && isPhoneValid && isEmailValid;
    };

    return (
        <div className="form-container">
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formBasicFullName">
                    <Form.Label>{renderLabel('Full Name', true)}</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter full name"
                        value={fullName}
                        onChange={handleFullNameChange}
                        className={`form-control ${fullNameError && 'is-invalid'}`}
                    />
                    {fullNameError && <div className="invalid-feedback">{fullNameError}</div>}
                </Form.Group>
                <Form.Group controlId="formBasicEmail">
                    <Form.Label>{renderLabel('Email address', true)}</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Enter email"
                        value={email}
                        onChange={handleEmailChange}
                        className={`form-control ${emailError && 'is-invalid'}`}
                    />
                    {emailError && <div className="invalid-feedback">{emailError}</div>}
                </Form.Group>

                <Form.Group controlId="formBasicSubject">
                    <Form.Label>{renderLabel('Subject', true)}</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter subject"
                        value={subject}
                        onChange={handleSubjectChange}
                        className={`form-control ${subjectError && 'is-invalid'}`}
                    />
                    {subjectError && <div className="invalid-feedback">{subjectError}</div>}
                </Form.Group>

                <Form.Group controlId="formBasicComment">
                    <Form.Label>{renderLabel('Comment', true)}</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        placeholder="Enter your comment"
                        value={comment}
                        onChange={handleCommentChange}
                        className={`form-control ${commentError && 'is-invalid'}`}
                    />
                    {commentError && <div className="invalid-feedback">{commentError}</div>}
                </Form.Group>

                <Form.Group controlId="formBasicPhone">
                    <Form.Label>{renderLabel('Phone number', false)}</Form.Label>
                    <PhoneInput
                        international
                        defaultCountry="US"
                        value={phone}
                        onChange={handlePhoneChange}
                        placeholder="Enter phone number"
                        className={`form-control ${phoneError && 'is-invalid'}`}
                    />
                    {phoneError && <div className="invalid-feedback">{phoneError}</div>}
                </Form.Group>

                <button type="submit" className="main-button" disabled={submissionStatus === 'success'}>
                    {isSubmitting ? 'Sending...' : submissionStatus === 'success' ? 'Sent' : 'Send request'}
                </button>

            </Form>

            {submissionStatus === 'success' && (
                <p style={{ color: 'green' }}>Request sent successfully! </p>
            )}
            {submissionStatus === 'error' && (
                <p style={{ color: 'red' }}>Request failed. Please try again. </p>
            )}
        </div>
    );
}

export default ContactMe;
