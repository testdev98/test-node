import React, { useEffect, useState, useCallback } from "react";
import { useUser } from "@/contexts/UserContext";
import { useToast } from "@/hooks/use-toast";
import { CanAccess } from "@/guards/AccessControl";
import { getServices } from "@/api/services";
import { useNavigate } from "react-router-dom";
import PageHeader from "@/components/ui/pageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import TextCard from "@/components/ui/text-card";
import {
  FileText,
  Briefcase,
  Heart,
  Settings,
  Package,
  Zap,
  Cloud,
  Database,
  Shield,
  Globe,
  Layers,
  TrendingUp,
} from "lucide-react";

interface Service {
  _id: string;
  name: string;
  slug: string;
  prefix: string;
  status: number;
  mastersheet: string;
  description: string;
}

const gradients = [
  "bg-gradient-to-br from-red-400 to-pink-500",
  "bg-gradient-to-br from-blue-400 to-blue-600",
  "bg-gradient-to-br from-purple-500 to-purple-700",
  "bg-gradient-to-br from-green-400 to-teal-500",
  "bg-gradient-to-br from-yellow-400 to-orange-500",
  "bg-gradient-to-br from-indigo-400 to-purple-500",
  "bg-gradient-to-br from-pink-400 to-red-500",
  "bg-gradient-to-br from-cyan-400 to-blue-500",
  "bg-gradient-to-br from-lime-400 to-green-600",
  "bg-gradient-to-br from-fuchsia-500 to-purple-600",
  "bg-gradient-to-br from-emerald-400 to-teal-600",
  "bg-gradient-to-br from-rose-400 to-red-600",
  "bg-gradient-to-br from-amber-400 to-yellow-600",
  "bg-gradient-to-br from-sky-400 to-indigo-600",
  "bg-gradient-to-br from-violet-400 to-fuchsia-600",
  "bg-gradient-to-br from-orange-400 to-red-600",
  "bg-gradient-to-br from-teal-400 to-cyan-600",
  "bg-gradient-to-br from-gray-400 to-gray-600",
];

const getRandomGradient = () => {
  return gradients[Math.floor(Math.random() * gradients.length)];
};

const getServiceIcon = (serviceName: string) => {
  const lowerCaseName = serviceName.toLowerCase();
  if (lowerCaseName.includes("kyc")) return <FileText size={32} />;
  if (lowerCaseName.includes("kyb")) return <Briefcase size={32} />;
  if (lowerCaseName.includes("aml")) return <Heart size={32} />;
  if (lowerCaseName.includes("security")) return <Shield size={32} />;
  if (lowerCaseName.includes("data")) return <Database size={32} />;
  if (lowerCaseName.includes("api")) return <Zap size={32} />;
  if (lowerCaseName.includes("cloud")) return <Cloud size={32} />;
  if (lowerCaseName.includes("global")) return <Globe size={32} />;
  if (lowerCaseName.includes("analytics")) return <TrendingUp size={32} />;
  if (lowerCaseName.includes("management")) return <Layers size={32} />;
  return <Package size={32} />;
};

const ServiceList = () => {
  const { user } = useUser();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  function isServiceIdSubscribedByUser(serviceId: string): boolean {
    if (!user || !Array.isArray(user.subscribe_services)) {
      return false;
    }

    const serviceIds = user.subscribe_services.map(
      (service) => service.service_id
    );
    return serviceIds.includes(serviceId);
  }

  useEffect(() => {
    const fetchServicesData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getServices();
        if (response.statusCode !== 200) {
          throw new Error(
            response.message || "Unable to load services from the server."
          );
        }
        setServices(response.data || []);
      } catch (err: any) {
        console.error("Error fetching services:", err);
        setError(err.message || "Failed to fetch services.");
        toast({
          title: "Error",
          description: err.message || "Failed to load services.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchServicesData();
  }, [toast]);

  const handleCardClick = (serviceSlug: string) => {
    navigate(`/services/${serviceSlug}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading services...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        <p>{error}</p>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Services"
        description="Explore and manage your available services."
      />

      {services.length === 0 ? (
        <div className="text-center text-muted-foreground p-8 border rounded-lg bg-card shadow-sm">
          <p>No services found. Click "Create New Service" to add one.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => {
            const isSubscribed = isServiceIdSubscribedByUser(service._id);

            const isDisabled = service.status !== 1;
            const hasAccess =
              isSubscribed || user?.role_id?.slug === "super-admin";

            return (
              <TextCard
                key={service._id}
                title={service.prefix.toUpperCase() + service.name}
                subtitle={service.slug}
                description={service.description || "No description available."}
                icon={getServiceIcon(service.name)}
                gradient={gradients[index]}
                onClick={
                  hasAccess ? () => handleCardClick(service.slug) : undefined
                }
                isSubscribed={isSubscribed}
                isDisabled={isDisabled}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ServiceList;
