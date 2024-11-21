import React, {useEffect, useState} from 'react';
import {Loader2, Mail} from 'lucide-react';
import {CVSelector} from './components/CVSelector';
import {EmailForm} from './components/EmailForm';
import {StatusMessage} from './components/StatusMessage';
import {CVType, cvTypes} from './data/cvTypes';

type Status = 'idle' | 'loading' | 'success' | 'error';

const App = () => {
    const [email, setEmail] = useState('');
    const [selectedCV, setSelectedCV] = useState('');
    const [subject, setSubject] = useState('');
    const [status, setStatus] = useState<Status>('idle');
    const [message, setMessage] = useState('');
    const [coverLetter, setCoverLetter] = useState('');
    const [cvType, setCvType] = useState<CVType>();
    const [receiverName, setReceiverName] = useState('');


    useEffect(() => {
        const handlePaste = (event: ClipboardEvent) => {
            if ((event.metaKey || event.ctrlKey) && event.key === 'j') {
                const pastedText = event.clipboardData?.getData('text');
                if (pastedText) {
                    setReceiverName(pastedText);
                }
            }
        };

        window.addEventListener('paste', handlePaste);
        return () => {
            window.removeEventListener('paste', handlePaste);
        };
    }, []);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
                handleSubmit(handleSubmit(new CustomEvent('submit', {
                    bubbles: true,
                    cancelable: true,
                    composed: true,
                    detail: {
                        email,
                        selectedCV,
                        subject,
                        coverLetter,
                        receiverName
                    }
                }) as unknown as React.FormEvent)).then(r => r);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [email, selectedCV, subject, coverLetter, receiverName]);

    useEffect(() => {
        if (selectedCV) {
            const cvType: CVType = cvTypes.find(cv => cv.id === selectedCV);
            setSubject(`${cvType?.role}`);
            setCvType(cvType);
            setCoverLetter(cvType?.message || '');
        } else {
            setSubject('');
            setCoverLetter('');
        }
    }, [selectedCV]);

    useEffect(() => {
        if (receiverName) {
            const updatedCoverLetter = receiverName ? coverLetter.replace(/^.*\n/, `Hi ${receiverName.charAt(0).toUpperCase() + receiverName.slice(1)},\n`) : coverLetter.replace(/^.*\n/, `Hi,\n`);
            setCoverLetter(updatedCoverLetter);
        }
    }, [receiverName]);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedCV && !email) {
            setStatus('error');
            setMessage('Please provide both email and CV type');
            return;
        } else if (!selectedCV) {
            setStatus('error');
            setMessage('Please provide a CV type');
            return;
        } else if (!email) {
            setStatus('error');
            setMessage('Please provide an email');
            return;
        }

        setStatus('loading');

        try {
            const response = await fetch('http://127.0.0.1:8000/send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    to_email: email,
                    subject: subject,
                    cover_letter: coverLetter,
                    cv_type: cvType,
                }),
            });

            if (response.ok) {
                setStatus('success');
                const cvType = cvTypes.find(cv => cv.id === selectedCV);
                setMessage(`${cvType?.label} CV sent successfully to ${email}!`);

                // Reset form after 2 seconds
                setTimeout(() => {
                    setEmail('');
                    setSelectedCV('');
                    setSubject('');
                    setStatus('idle');
                    setCoverLetter('');
                    setMessage('');
                    setReceiverName('');
                }, 2000);
            } else {
                const errorData = await response.json();
                setStatus('error');
                setMessage(errorData.error);
            }
        } catch (error) {
            setStatus('error');
            setMessage('Failed to send email. Please check your connection and try again.');
            console.error(error);
        }

    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
                <div className="flex items-center justify-center mb-8">
                    <div className="bg-indigo-100 p-3 rounded-full">
                        <Mail className="w-8 h-8 text-indigo-600"/>
                    </div>
                </div>

                <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
                    CV Email Sender
                </h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <CVSelector
                        selectedCV={selectedCV}
                        onChange={setSelectedCV}
                        cvTypes={cvTypes}
                    />

                    <EmailForm
                        email={email}
                        subject={subject}
                        coverLetter={coverLetter}
                        receiverName={receiverName}
                        onChange={setEmail}
                        onCoverLetterChange={setCoverLetter}
                        onReceiverNameChange={setReceiverName}
                    />

                    <button
                        type="submit"
                        disabled={status === 'loading'}
                        className={`w-full py-3 px-4 rounded-lg text-white font-medium flex items-center justify-center space-x-2
                        ${status === 'loading'
                            ? 'bg-indigo-400 cursor-not-allowed'
                            : 'bg-indigo-600 hover:bg-indigo-700 transition-colors'}
                        `}
                    >
                        {status === 'loading' ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin"/>
                                <span>Sending...</span>
                            </>
                        ) : (
                            <>
                                <Mail className="w-5 h-5"/>
                                <span>Send Email</span>
                            </>
                        )}
                    </button>

                    <StatusMessage
                        message={message}
                        status={status}
                    />
                </form>
            </div>
        </div>
    );
};

export default App;