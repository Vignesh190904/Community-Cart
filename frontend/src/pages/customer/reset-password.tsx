import { useRouter } from 'next/router';

export default function ResetPassword() {
    const router = useRouter();

    const handleReset = () => {
        // console.log('Password reset successful');
        router.push('/customer/signin');
    };

    return (
        <div className="reset-password-page">
            {/* Header */}
            <header className="rp-header">
                <button className="rp-back-button" onClick={() => router.back()}>
                    <svg
                        className="rp-back-icon"
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
                <h1 className="rp-title">Reset Password</h1>
            </header>

            <p className="rp-subtitle">Please reset your password</p>

            <div className="rp-content">
                {/* New Password Input */}
                <div className="rp-input-group">
                    <div className="rp-input-field">
                        <input
                            type="password"
                            className="rp-input-text"
                            value="********"
                            readOnly
                        />
                        <label className="rp-input-label">New Password</label>
                        <img
                            src="/customer/assets/icons/hide.svg"
                            alt="hide password"
                            className="rp-input-icon-right"
                        />
                    </div>
                </div>

                {/* Confirm Password Input */}
                <div className="rp-input-group">
                    <div className="rp-input-field">
                        <input
                            type="password"
                            className="rp-input-text"
                            value="********"
                            readOnly
                        />
                        <label className="rp-input-label">Confirm Password</label>
                        <img
                            src="/customer/assets/icons/hide.svg"
                            alt="hide password"
                            className="rp-input-icon-right"
                        />
                    </div>
                </div>

                {/* Reset Button */}
                <button className="rp-reset-button" onClick={handleReset}>
                    Reset
                </button>
            </div>
        </div>
    );
}
