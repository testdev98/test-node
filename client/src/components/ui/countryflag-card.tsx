import { Button } from "@/components/ui/button";

interface CountryFlagCardProps {
    countryName: string;
    flagUrl: string;
    subtitle: string;
    description: string;
    isDisabled?: boolean;
    isSubscribed?: boolean;
    onClick?: () => void;
}

const CountryFlagCard = ({
    countryName,
    flagUrl,
    subtitle,
    description,
    isDisabled = false,
    isSubscribed = false,
    onClick
}: CountryFlagCardProps) => {
    return (
        <div className="w-64">
            {/* Card */}
            <div
                className={`
          bg-gradient-to-br from-slate-700 to-slate-800
          w-full h-64 
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
                        <div className="bg-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                            SUBSCRIBED
                        </div>
                    </div>
                )}

                {/* Flag */}
                <div className="flex justify-center mb-4">
                    <div className="w-20 h-14 rounded-lg overflow-hidden border-2 border-white/30">
                        <img
                            src={flagUrl}
                            alt={`${countryName} flag`}
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col justify-center text-center">
                    <h3 className="text-xl font-bold mb-2">{countryName}</h3>
                    <p className="text-sm opacity-90 mb-1">{subtitle}</p>
                    <p className="text-xs opacity-80">{description}</p>
                </div>
                <Button isDisabled={isDisabled} onClick={onClick}>Submit</Button>
            </div>
        </div>
    );
};

export default CountryFlagCard;