import React, { useState } from "react";
import CountryFlagCard from "@/components/ui/countryflag-card";
import PageHeader from "@/components/ui/pageHeader";
import { Input } from "@/components/ui/input";

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
  const [searchTerm, setSearchTerm] = useState("");

  // Filter countries based on search term (by name or code)
  const filteredCountries = countries.filter(
    (country) =>
      country.country_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      country.country_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      country.source.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Country List for KYC Service"
        description="Explore the countries available for KYC verification in this service."
      />

      {/* Search Field */}
      <div className="max-w-md">
        <Input
          id="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Type country name or code..."
        />
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
