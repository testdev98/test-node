import React, { useEffect, useState } from "react";
import CountryFlagCard from "@/components/ui/countryflag-card";
import PageHeader from "@/components/ui/pageHeader";
import { Input } from "@/components/ui/input";
import EnvironmentSwitch from "@/components/common/EnvironmentSwitch";
import { useUser } from "@/contexts/UserContext";
import { updateSubscribeService } from "@/api/users";
import { useToast } from "@/hooks/use-toast";

interface Service {
  _id: string;
  name: string;
  slug: string;
  prefix: string;
  status: number;
  mastersheet: string;
  description: string;
}

interface Country {
  country_name: string;
  country_code: string;
  source: string;
  cs: string;
  sample_request: string;
  sample_response: object;
}

interface CountryListProps {
  service: Service;
  countries: Country[];
}

const CountryList: React.FC<CountryListProps> = ({ service, countries }) => {
  const { user, setUser } = useUser();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [isProduction, setIsProduction] = useState(true);

  // Filter countries based on search term (by name or code)
  const filteredCountries = countries.filter((country) => {
    const term = searchTerm.toLowerCase();

    const countryNameMatch = country.country_name.toLowerCase().includes(term);
    const countryCodeMatch = country.country_code.toLowerCase().includes(term);
    const sourceMatch = country.source.toLowerCase().includes(term);
    const combinedMatch = (country.country_code + country.source).toLowerCase().includes(term);

    return countryNameMatch || countryCodeMatch || sourceMatch || combinedMatch;
  });

  const handleEnv = async (checked: boolean) => {
    setIsProduction(checked);
    const updatedServices = user.subscribe_services.map((service) => {
      if (service.service_name === "Kyc") {
        return { ...service, environment: checked ? "production" : "sandbox" };
      }
      return service;
    });
    const userUpdateData = { updatedServices };
    await updateSubscribeService(user.id!, { subscribe_services: updatedServices });
    toast({
      title: "KYC Service",
      description: `KYC service environment change successfully.`,
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
