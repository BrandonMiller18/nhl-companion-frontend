interface LoadingSpinnerProps {
    teamLogoUrl?: string;
    message?: string;
}

export default function LoadingSpinner({ teamLogoUrl, message = "Loading..." }: LoadingSpinnerProps) {
    return (
        <div className="min-h-screen p-8 flex flex-col items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                {/* Animated spinner */}
                <div className="relative w-24 h-24">
                    {/* Spinning border */}
                    <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                    
                    {/* Center content - team logo or hockey emoji */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        {teamLogoUrl ? (
                            <img 
                                src={teamLogoUrl} 
                                alt="Team logo" 
                                className="w-50 h-50 object-contain"
                            />
                        ) : (
                            <span className="text-4xl">🏒</span>
                        )}
                    </div>
                </div>
                
                {/* Loading message */}
                <p className="text-gray-600 text-lg font-medium">{message}</p>
            </div>
        </div>
    );
}