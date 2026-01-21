interface ErrorProps {
    error: string;
}

export default function Error({ error }: ErrorProps) {
    return (
        <div className="min-h-screen p-8">
            <h1 className="text-3xl font-bold mb-4">NHL Companion</h1>
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                <p className="font-bold">Error</p>
                <p>{error}</p>
            </div>
            <button className="bg-blue-500 text-white px-6 py-3 rounded mt-4 hover:cursor-pointer hover:bg-blue-600" onClick={() => window.location.reload()}>Reload</button>
        </div>
    );
}