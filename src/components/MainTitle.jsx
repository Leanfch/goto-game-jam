export const MainTitle = ({ title }) => {
    return (
        <div className="text-center mt-2 mb-6">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-2 pb-2">
                {title}
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-600 to-blue-600 mx-auto rounded-full"></div>
        </div>
    );
};
