import { AuthUser } from "@/contexts/UserContext";

const getServiceEnv = (user: AuthUser | null, serviceName: string) => {
  if (!user || !user.subscribe_services) return "sandbox";
  const service = user.subscribe_services.find(
    (svc: any) => svc.service_name === serviceName
  );
  return service ? service.environment : "sandbox";
};

export default getServiceEnv;
