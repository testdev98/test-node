import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getServices } from "@/api/services";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";
import CountryList from "./CountryList";

const Request = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useUser();
  const segments = location.pathname.split("/").filter(Boolean); // removes empty strings
  const selectedService = segments[segments.length - 1];
  const [service, setService] = useState<any>(null);
  const [countries, setCountries] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServicesData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await getServices();
        if (response.statusCode !== 200) {
          toast({
            title: "Error",
            description:
              response.message || "Unable to load services from the server.",
            variant: "destructive",
          });
          return navigate(-1);
        }

        const services = response.data;
        const matchedService = services.find(
          (s: any) => s.slug === selectedService
        );

        if (!matchedService) {
          toast({
            title: "Error",
            description: "Requested service not found.",
            variant: "destructive",
          });
          return navigate(-1);
        }

        if (matchedService.status !== 1) {
          toast({
            title: "Error",
            description: `${matchedService.prefix?.toUpperCase() || ""} ${
              matchedService.name
            } service is not active.`,
            variant: "destructive",
          });
          return navigate(-1);
        }
        const isSubscribed =
          Array.isArray(user?.subscribe_services) &&
          user.subscribe_services.some(
            (sub: any) => sub.service_id === matchedService._id
          );

        if (!isSubscribed || user.role_id.name == "super-admin") {
          toast({
            title: "Access Denied",
            description: "You are not subscribed to this service.",
            variant: "destructive",
          });
          return navigate(-1);
        }
        console.log("Matched Service:", matchedService.mastersheet);
        // Set data if everything is okay
        setService(matchedService);
        setCountries(matchedService.mastersheet || []);
      } catch (err: any) {
        console.error("Error fetching services:", err);
        setError(err.message || "Failed to fetch KYC request countries.");
        toast({
          title: "Error",
          description: err.message || "Failed to load KYC request form.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchServicesData();
  }, [selectedService, toast, navigate, user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading services...</p>
      </div>
    );
  }

  return (
    <>
      <CountryList service={service} countries={countries} />
    </>
  );
};

export default Request;
