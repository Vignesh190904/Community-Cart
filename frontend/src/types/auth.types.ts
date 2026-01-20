// Callback types for flow functions
export type OnSuccessCallback = (user?: UserData, token?: string) => void;
export type OnErrorCallback = (message: string) => void;
export type OnNavigateCallback = (path: string, query?: Record<string, string>) => void;

// Flow callbacks interface
export interface FlowCallbacks {
    onSuccess?: OnSuccessCallback;
    onError?: OnErrorCallback;
    onNavigate?: OnNavigateCallback;
}

// Error codes from backend
export type AuthErrorCode =
    | 'MISSING_FIELDS'
    | 'MISSING_TOKEN'
    | 'EMAIL_EXISTS'
    | 'MOBILE_EXISTS'
    | 'ACCOUNT_ALREADY_EXISTS'
    | 'ACCOUNT_NOT_FOUND'
    | 'INVALID_OTP'
    | 'SESSION_EXPIRED'
    | 'EMAIL_NOT_VERIFIED'
    | 'VERIFICATION_INCOMPLETE'
    | 'INVALID_CREDENTIALS'
    | 'WRONG_AUTH_METHOD'
    | 'NOT_AUTHENTICATED'
    | 'USER_NOT_FOUND'
    | 'ACCOUNT_INACTIVE'
    | 'GOOGLE_AUTH_FAILED'
    | 'SERVER_ERROR'
    | 'AUTH_ERROR'
    | 'LOGOUT_FAILED';

// API response types
export interface ApiResponse<T = any> {
    success: boolean;
    message?: string;
    error_code?: AuthErrorCode;
    data?: T;
    user?: UserData;
    auth_token?: string;
}

export interface UserData {
    id: string;
    name: string;
    email: string;
    phone?: string;
    method: 'manual' | 'google';
    emailVerified?: boolean;
    phoneVerified?: boolean;
}

// Signup data types
export interface ManualSignupData {
    name: string;
    email: string;
    password: string;
}

export interface SignupTempData extends ManualSignupData {
    mobile?: string;
}
