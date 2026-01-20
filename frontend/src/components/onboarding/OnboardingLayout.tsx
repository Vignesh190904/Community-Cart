import { ReactNode } from 'react';

interface OnboardingLayoutProps {
    children: ReactNode;
}

export default function OnboardingLayout({ children }: OnboardingLayoutProps) {
    return (
        <div className="onboarding-layout">
            <div className="onboarding-content">
                {children}
            </div>
            <style jsx>{`
                .onboarding-layout {
                    min-height: 100vh;
                    width: 100%;
                    background: var(--bg-primary);
                    display: flex;
                    flex-direction: column;
                }

                .onboarding-content {
                    flex: 1;
                    width: 100%;
                    max-width: 100%;
                    margin: 0 auto;
                }
            `}</style>
        </div>
    );
}
