// components/ui/EnvironmentSwitch.tsx
import React, { useEffect, useState } from "react";
import { useUser } from "@/contexts/UserContext";
import { useToast } from "@/hooks/use-toast";
import { updateSubscribeService } from "@/api/users";

interface EnvironmentSwitchProps {
  serviceName: string;
}

interface SelectedService {
  service_id: string;
  service_name: string;
  environment: "production" | "sandbox";
  request_limit: number;
  price: number;
}

const EnvironmentSwitch: React.FC<EnvironmentSwitchProps> = ({
  serviceName,
}) => {

  const { user, setUser } = useUser();
  const { toast } = useToast();
  const [isProduction, setIsProduction] = useState<boolean>(true);
  const [selectedService, setSelectedService] = useState<SelectedService | null>(null);
  const infoText = isProduction
    ? "Production is active. Requests will hit live APIs."
    : "Sandbox is active. Responses are static and mocked.";

  useEffect(() => {
    if (!user || !user.subscribe_services) return;

    const subService = (user.subscribe_services).find(
      (service) => service.service_name === serviceName
    );

    if (subService) {
      setSelectedService(subService); // set the selected service
      setIsProduction(subService?.environment === "production"); // true if production, false if sandbox
    }
  }, [user]);

  const handleEnv = async (isProduction: boolean) => {
    setIsProduction(isProduction);
    const environment = isProduction ? "production" : "sandbox";

    // Build update payload only for KYC
    const updatedServices = selectedService
      ? {
        service_id: selectedService.service_id,
        environment,
      }
      : {};

    setUser((prevUser) => {
      if (!prevUser) return prevUser;
      const updatedSubscribeServices = prevUser.subscribe_services.map((service) => {
        if (service.service_name === serviceName) {
          return {
            ...service,
            environment,
          };
        }
        return service;
      });
      return {
        ...prevUser,
        subscribe_services: updatedSubscribeServices,
      };
    });
    // Optionally update backend
    await updateSubscribeService(user.id!, updatedServices);

    toast({
      title: "Social Service",
      description: `Social service environment changed to ${environment} successfully.`,
    });
  };

  return (
    <div
      className="
    relative flex items-center rounded-md py-2 px-3
    bg-gradient-to-r from-primary/70 to-primary/30
    dark:from-primary/50 dark:to-primary/20
    text-primary-foreground
    shadow-lg shadow-primary/25
  "
    >
      {/* Info Button */}
      <div className="absolute top-1 right-1 group">
        <button
          type="button"
          className="
        w-4 h-4 rounded-full text-xs font-bold
        bg-white/80 text-primary
        hover:bg-white
        flex items-center justify-center">
          i
        </button>

        {/* Tooltip */}
        <div
          className="
        absolute right-0 mt-2 w-52
        bg-black text-white text-xs
        rounded-md px-3 py-2
        opacity-0 group-hover:opacity-100
        transition-opacity
        pointer-events-none
        z-50
      ">
          {infoText}
        </div>
      </div>

      {/* Label */}
      <div className="text-sm font-medium w-20">
        Production
      </div>

      {/* Switch */}
      <label className="relative inline-flex items-center cursor-pointer mr-5">
        <input
          type="checkbox"
          className="sr-only peer"
          checked={isProduction}
          onChange={(e) => handleEnv(e.target.checked)}
        />
        <div
          className="
        w-11 h-6
        bg-gray-300 dark:bg-gray-600
        rounded-full
        peer-checked:bg-primary
        relative
        transition-colors
        after:content-['']
        after:absolute
        after:top-0.5
        after:left-[2px]
        after:w-5 after:h-5
        after:bg-white
        after:rounded-full
        after:border
        after:transition-all
        peer-checked:after:translate-x-full
      "
        />
      </label>
    </div>
  );
};

export default EnvironmentSwitch;