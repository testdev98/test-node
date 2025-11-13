import React, { useEffect, useState } from "react";
import CountryFlagCard from "@/components/ui/countryflag-card";
import PageHeader from "@/components/ui/pageHeader";
import { Input } from "@/components/ui/input";
import EnvironmentSwitch from "@/components/common/EnvironmentSwitch";
import { useUser } from "@/contexts/UserContext";
import { updateSubscribeService } from "@/api/users";
import { useToast } from "@/hooks/use-toast";

// Service interface from backend
interface Service {
  _id: string;
  name: string;
  slug: string;
  prefix: string;
  status: number;
  mastersheet: string;
  description: string;
}

// Country interface
interface Country {
  country_name: string;
  country_code: string;
  source: string;
  cs: string;
  sample_request: Record<string, any>;
  sample_response: Record<string, any>;
}

// Props for CountryList component
interface CountryListProps {
  service: Service;
  countries: Country[];
}

// SelectedService (KYC subscription) interface
interface SelectedService {
  service_id: string;
  service_name: string;
  environment: "production" | "sandbox";
  request_limit: number;
  price: number;
}


const CountryList: React.FC<CountryListProps> = ({ service, countries }) => {
  const { user } = useUser();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isProduction, setIsProduction] = useState<boolean>(true);
  const [selectedService, setSelectedService] = useState<SelectedService | null>(null);

  // Filter countries based on search term (by name or code)
  const filteredCountries = countries.filter((country) => {
    const term = searchTerm.toLowerCase();

    const countryNameMatch = country.country_name.toLowerCase().includes(term);
    const countryCodeMatch = country.country_code.toLowerCase().includes(term);
    const sourceMatch = country.source.toLowerCase().includes(term);
    const combinedMatch = (country.country_code + country.source).toLowerCase().includes(term);

    return countryNameMatch || countryCodeMatch || sourceMatch || combinedMatch;
  });

  useEffect(() => {
    if (!user || !user.subscribe_services) return;

    const kycService = user.subscribe_services.find(
      (service) => service.service_name === "Kyc"
    );

    if (kycService) {
      setSelectedService(kycService); // set the selected service
      setIsProduction(kycService.environment === "production"); // true if production, false if sandbox
    }
  }, [user]);

  const handleEnv = async (checked: boolean) => {
    setIsProduction(checked);
    const environment = checked ? "production" : "sandbox";

    // Build update payload only for KYC
    const updatedServices = selectedService
      ? {
        service_id: selectedService.service_id,
        environment,
      }
      : {};

    // Optionally update backend
    await updateSubscribeService(user.id!, updatedServices);

    toast({
      title: "KYC Service",
      description: `KYC service environment changed to ${environment} successfully.`,
    });
  };



  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Country List for KYC Service"
        description="Explore the countries available for KYC verification in this service."
      />

      <div className="grid grid-cols-12 items-center gap-4">
        {/* Search Input (left) */}
        <Input
          id="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Type country name or code..."
          className="col-span-4"
        />

        <div className="col-span-6" /> {/* Spacer */}

        {/* Environment Switch (right) */}
        <div className="col-span-2">
          <EnvironmentSwitch
            checked={isProduction}
            onChange={handleEnv}
          />
        </div>
      </div>

      {/* Country Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {filteredCountries.length > 0 ? (
          filteredCountries.map((country, index) => (
            <CountryFlagCard
              key={index}
              countryName={country.country_name}
              flagUrl={`https://flagcdn.com/w320/${country.country_code.toLowerCase()}.png`}
              subtitle={country.source}
              description={country.cs}
              onClick={() =>
                console.log(`Clicked ${country.country_name} ${index + 1}`)
              }
            />
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500">
            No countries found.
          </div>
        )}
      </div>
    </div>
  );
};

export default CountryList;
