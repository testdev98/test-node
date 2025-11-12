interface TextCardProps {
    title: string;
    subtitle?: string;
    description?: string;
    icon?: React.ReactNode;
    gradient: string;
    isDisabled?: boolean;
    isSubscribed?: boolean;
    onClick?: () => void;
}

const TextCard = ({
    title,
    subtitle,
    description,
    icon,
    gradient,
    isDisabled = false,
    isSubscribed = false,
    onClick
}: TextCardProps) => {
    const primaryColor = localStorage.getItem("primaryColor") || "purple";
    console.log(primaryColor);
    return (
        <div
            className={`
        ${gradient} 
        w-64 h-64 
        rounded-2xl 
        p-6 
        text-white 
        flex flex-col 
        justify-between 
        relative
        transition-all duration-300
        ${isDisabled ? 'opacity-50 cursor-not-allowed' : onClick ? 'hover:scale-105 cursor-pointer' : 'cursor-default'}
        ${onClick && !isDisabled ? 'hover:shadow-xl' : ''}
      `}
            onClick={!isDisabled && onClick ? onClick : undefined}
        >
            {/* Subscription Badge */}
            {isSubscribed && (
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                    <div className={`bg-${primaryColor}-600 text-white px-4 py-1 rounded-full text-sm font-medium`}>
                        SUBSCRIBED
                    </div>
                </div>
            )}

            {/* Icon */}
            {icon && (
                <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 flex items-center justify-center bg-white/20 rounded-xl">
                        {icon}
                    </div>
                </div>
            )}

            {/* Content */}
            <div className="flex-1 flex flex-col justify-center text-center">
                <h3 className="text-2xl font-bold mb-2">{title}</h3>
                {subtitle && (
                    <p className="text-lg opacity-90 mb-2">{subtitle}</p>
                )}
                {description && (
                    <p className="text-sm opacity-80">{description}</p>
                )}
            </div>
        </div>
    );
};

export default TextCard;