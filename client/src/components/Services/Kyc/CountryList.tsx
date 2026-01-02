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
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Filter countries based on search term (by name or code)
  const filteredCountries = countries.filter((country) => {
    const term = searchTerm.toLowerCase();

    const countryNameMatch = country.country_name.toLowerCase().includes(term);
    const countryCodeMatch = country.country_code.toLowerCase().includes(term);
    const sourceMatch = country.source.toLowerCase().includes(term);
    const combinedMatch = (country.country_code + country.source).toLowerCase().includes(term);

    return countryNameMatch || countryCodeMatch || sourceMatch || combinedMatch;
  });

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
            serviceName="Kyc"
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
