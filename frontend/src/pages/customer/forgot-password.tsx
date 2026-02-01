import { useRouter } from 'next/router';

export default function ForgotPassword() {
    const router = useRouter();

    const handleBack = () => {
        router.push('/customer/signin');
    };

    const handleSend = () => {
        // console.log('Sending OTP...');
        router.push({
            pathname: '/customer/verify-otp',
            query: { next: '/customer/reset-password' }
        });
    };

    return (
        <div className="forgot-password-page">
            {/* Header */}
            <header className="fp-header">
                <button className="fp-back-button" onClick={handleBack}>
                    <svg
                        className="fp-back-icon"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M15 19l-7-7 7-7"
                        />
                    </svg>
                </button>
                <h1 className="fp-title">Forgot Password</h1>
            </header>

            <div className="fp-content">
                {/* Instruction Text */}
                <p className="fp-instruction">
                    Please enter your email ID, You'll receive an One-Time-Password.
                </p>

                {/* Email Input with Notched Label */}
                <div className="fp-input-group">
                    <div className="fp-input-field">
                        <input
                            type="email"
                            className="fp-input-text"
                            value="Vignesh@gmail.com"
                            readOnly
                        />
                        <label className="fp-input-label">Email</label>
                        <img
                            src="/customer/assets/icons/check.svg"
                            alt="verified"
                            className="fp-input-icon-right"
                        />
                    </div>
                </div>

                {/* Send Button */}
                <button className="fp-send-button" onClick={handleSend}>
                    Send
                </button>
            </div>
        </div>
    );
}
