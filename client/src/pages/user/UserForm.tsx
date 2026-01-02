import React, { useEffect, useState, useCallback, useMemo } from "react";
import PageHeader from "@/components/ui/pageHeader";
import { useParams, useNavigate } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { getServices } from "@/api/services";
import { getRoles } from "@/api/roles"; // Assuming this API call exists
import { createUser, updateUser, getUserById } from "@/api/users";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import FormField from "@/components/common/FormFiled";

// Generates a strong, random password for new users.
const generatePassword = (length: number = 20): string => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
};

// --- Interfaces ---
interface Service {
  _id: string;
  name: string;
  description: string;
  price: number;
  is_active: boolean;
}

interface Role {
  _id: string;
  name: string;
}

interface SubscribedService {
  service_id: string;
  service_name: string;
  price: number;
  environment: "production" | "sandbox";
  request_limit: number;
}

interface CompanyProfile {
  name: string;
  email: string;
}

interface FormData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  password: string;
  status: true | false;
  extra_user_limit: string;
  expired_at: string;
  role_id: string;
  company_profile: CompanyProfile;
}

interface ValidationError {
  field: string;
  message: string;
}


const UserForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();

  // Determines if we are in "edit" mode
  const isEdit = !!id;

  // Initializes the form data, generating password only for new users.
  const initialFormData = useMemo(
    () => ({
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      password: isEdit ? "" : generatePassword(),
      status: true as const,
      extra_user_limit: "",
      expired_at: "",
      role_id: "",
      company_profile: { name: "", email: "" },
    }),
    [isEdit]
  );

  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [services, setServices] = useState<Service[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [subscribedServices, setSubscribedServices] = useState<SubscribedService[]>([]);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [roleSearchTerm, setRoleSearchTerm] = useState<string>("");

  // Validation logic for required fields.
  const validateForm = useCallback((): ValidationError[] => {
    const newErrors: ValidationError[] = [];
    const requiredFields: [keyof FormData, string][] = [
      ["first_name", "First Name"],
      ["last_name", "Last Name"],
      ["email", "Email"],
      ["expired_at", "Expired At"],
      ["role_id", "Role"],
    ];

    requiredFields.forEach(([field, label]) => {
      const value = formData[field];
      if (typeof value === "string" && !value.trim()) {
        newErrors.push({ field, message: `${label} is required.` });
      }
    });

    // Password is only required when creating a new user.
    if (!isEdit) {
      if (!formData.password.trim()) newErrors.push({ field: "password", message: "Password is required." });
    }

    return newErrors;
  }, [formData, isEdit]);

  // Fetches the list of available services and roles.
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Fetch services
        const servicesResponse = await getServices();
        if (servicesResponse.statusCode !== 200) {
          toast({ title: "Error", description: "Unable to load services.", variant: "destructive" });
          setServices([]);
        } else {
          setServices(servicesResponse.data || []);
        }

        // Fetch roles
        const rolesResponse = await getRoles(); // Call your getRoles API
        if (rolesResponse.statusCode !== 200) {
          toast({ title: "Error", description: "Unable to load roles.", variant: "destructive" });
          setRoles([]);
        } else {
          setRoles(rolesResponse.data || []);
        }

      } catch (error: any) {
        toast({ title: "Error", description: error.message || "Failed to fetch initial data.", variant: "destructive" });
      }
    };
    fetchInitialData();
  }, [toast]);

  // Fetches existing user data if in edit mode.
  useEffect(() => {
    if (!isEdit || !id) return;

    const fetchUserData = async () => {
      try {
        const response = await getUserById(id);
        if (response.statusCode !== 200 || !response.status) {
          throw new Error(response.message || "Failed to fetch user data.");
        }

        const user = response.data;

        // Populate form data with fetched user details.
        setFormData((prevFormData) => { // Use functional update for setFormData
          const newRoleID = typeof user.role_id === 'object' && user.role_id !== null
            ? user.role_id._id?.trim() || ""
            : user.role_id?.trim() || "";

          return {
            ...prevFormData, // Keep previous state for password if not explicitly changed
            first_name: user.first_name || "",
            last_name: user.last_name || "",
            email: user.email || "",
            phone: user.phone || "",
            status: user.status === 1,
            extra_user_limit: user.extra_user_limit?.toString() || "0",
            expired_at: user.expired_at ? new Date(user.expired_at).toISOString().split("T")[0] : "", // Ensure YYYY-MM-DD format
            role_id: newRoleID, // Set the fetched role_id, trimmed
            company_profile: user.company_profile || { name: "", email: "" },
          };
        });

        setSubscribedServices(user.subscribe_services || []);
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to fetch user data.",
          variant: "destructive",
        });
        navigate("/users");
      }
    };

    fetchUserData();
  }, [id, isEdit, navigate, toast, initialFormData, formData.role_id]);

  // Handles changes for general form fields.
  const handleInputChange = useCallback((field: keyof FormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  // Handles changes for company profile fields.
  const handleCompanyProfileChange = useCallback((field: keyof CompanyProfile, value: string) => {
    setFormData((prev) => ({
      ...prev,
      company_profile: { ...prev.company_profile, [field]: value },
    }));
  }, []);

  // Toggles a service's subscription status.
  const handleServiceToggle = useCallback((serviceId: string, serviceName: string, price: number) => {
    setSubscribedServices((prev) =>
      prev.some((s) => s.service_id === serviceId)
        ? prev.filter((s) => s.service_id !== serviceId)
        : [...prev, { service_id: serviceId, service_name: serviceName, price, environment: "sandbox", request_limit: 1000 }]
    );
  }, []);

  // Updates the price of a subscribed service.
  const handleServicePrice = useCallback((serviceId: string, price: number) => {
    setSubscribedServices((prev) =>
      prev.map((s) => (s.service_id === serviceId ? { ...s, price } : s))
    );
  }, []);

  // Updates the environment of a subscribed service.
  const handleServiceEnvironment = useCallback((serviceId: string, environment: "production" | "sandbox") => {
    setSubscribedServices((prev) =>
      prev.map((s) => (s.service_id === serviceId ? { ...s, environment } : s))
    );
  }, []);

  // Updates the request limit of a subscribed service.
  const handleServiceRequestLimit = useCallback((serviceId: string, request_limit: number) => {
    setSubscribedServices((prev) =>
      prev.map((s) => (s.service_id === serviceId ? { ...s, request_limit } : s))
    );
  }, []);

  // Handles form submission.
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      const validationErrors = validateForm();
      if (validationErrors.length > 0) {
        setErrors(validationErrors);
        toast({
          title: "Validation Error",
          description: (
            <ul className="list-disc pl-4">
              {validationErrors.map((err, i) => (
                <li key={i}>{err.message}</li>
              ))}
            </ul>
          ),
          variant: "destructive",
        });
        return;
      }

      let dataToSend: Omit<FormData, "password"> & { subscribe_services: SubscribedService[]; password?: string };

      if (isEdit) {
        const { password, ...restOfFormData } = formData;
        dataToSend = { ...restOfFormData, subscribe_services: subscribedServices };
        // No password field is sent in edit mode now, so no need to check or include it.
        // If you later decide to allow password changes, this logic would need to be re-added.
      } else {
        dataToSend = { ...formData, subscribe_services: subscribedServices };
      }

      try {
        const action = isEdit
          ? updateUser(id!, dataToSend)
          : createUser(dataToSend);

        await action;

        toast({
          title: isEdit ? "User updated" : "User created",
          description: `User "${formData.first_name} ${formData.last_name}" has been ${isEdit ? "updated" : "created"} successfully.`,
        });

        navigate(-1);
      } catch (error: any) {
        console.error("Error in handleSubmit:", error);

        const errorMessages =
          error.statusCode === 422 && error.errors
            ? Object.entries(error.errors).map(([field, msg]) => (
              <li key={field} className="text-sm">
                <span className="font-semibold capitalize">{field.replace(/_/g, " ")}</span>: {String(msg)}
              </li>
            ))
            : error.message || "Something went wrong.";

        toast({
          title: "Error",
          description: <ul className="list-disc pl-4">{errorMessages}</ul>,
          variant: "destructive",
        });
      }
    },
    [formData, subscribedServices, isEdit, id, navigate, toast, validateForm, setErrors]
  );

  // Helper to get error message for a specific field.
  const getErrorForField = useCallback(
    (field: string) => errors.find((err) => err.field === field)?.message,
    [errors]
  );

  // Filtered roles based on search term
  const filteredRoles = useMemo(() => {
    if (!roleSearchTerm) {
      return roles;
    }
    return roles.filter(role =>
      role.name.toLowerCase().includes(roleSearchTerm.toLowerCase())
    );
  }, [roles, roleSearchTerm]);

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title={isEdit ? "Edit User" : "Create User"} description="Manage user and services" />

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* User Details Card */}
        <Card className="bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-xl border-border/50 shadow-xl">
          <CardHeader>
            <CardTitle>User Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FormField
                id="first_name"
                label="First Name"
                value={formData.first_name}
                onChange={(value) => handleInputChange("first_name", value)}
                required
                placeholder="Enter first name"
                error={getErrorForField("first_name")}
              />
              <FormField
                id="last_name"
                label="Last Name"
                value={formData.last_name}
                onChange={(value) => handleInputChange("last_name", value)}
                required
                placeholder="Enter last name"
                error={getErrorForField("last_name")}
              />
              <FormField
                id="email"
                label="Email"
                type="email"
                value={formData.email}
                onChange={(value) => handleInputChange("email", value)}
                required
                placeholder="Enter email"
                error={getErrorForField("email")}
              />
              {!isEdit && ( // Only show password field for new user creation
                <FormField
                  id="password"
                  label="Password"
                  value={formData.password}
                  onChange={(value) => handleInputChange("password", value)}
                  required={!isEdit}
                  placeholder="Auto-generated password"
                  error={getErrorForField("password")}
                />
              )}
              {/* Removed the 'Change Password (optional)' field for edit mode */}
              <FormField
                id="phone"
                label="Phone No."
                value={formData.phone}
                onChange={(value) => handleInputChange("phone", value)}
                placeholder="Enter phone number"
              />
              <FormField
                id="extra_user_limit"
                label="Extra User Limit"
                type="number"
                value={formData.extra_user_limit}
                onChange={(value) => handleInputChange("extra_user_limit", value)}
                placeholder="Enter user limit"
              />
              <FormField
                id="expired_at"
                label="Expired At"
                type="date"
                value={formData.expired_at}
                onChange={(value) => handleInputChange("expired_at", value)}
                required
                error={getErrorForField("expired_at")}
              />
              <div>
                <Label htmlFor="role_id" className="text-sm font-medium">
                  Role <span className="text-red-600">*</span>
                </Label>
                <Select
                  value={formData.role_id}
                  onValueChange={(value) => handleInputChange("role_id", value)}
                >
                  <SelectTrigger id="role_id" className="w-full mt-1">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* Search input for roles */}
                    <div className="p-1">
                      <Input
                        placeholder="Search roles..."
                        value={roleSearchTerm}
                        onChange={(e) => setRoleSearchTerm(e.target.value)}
                        className="w-full text-sm"
                      />
                    </div>
                    {filteredRoles.length === 0 ? (
                      <div className="p-2 text-center text-muted-foreground">
                        No roles found.
                      </div>
                    ) : (
                      filteredRoles.map((role) => (
                        <SelectItem key={role._id} value={role._id.trim()}>
                          {role.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                {getErrorForField("role_id") && (
                  <p className="mt-1 text-sm text-red-600">{getErrorForField("role_id")}</p>
                )}
              </div>
              <div className="flex items-center space-x-2 pt-6">
                <Label htmlFor="status" className="text-sm font-medium">
                  Status
                </Label>
                <Switch
                  id="status"
                  checked={formData.status === true}
                  onCheckedChange={(checked) => handleInputChange("status", checked ? true : false)}
                />
                <span className="text-sm">{formData.status === true ? "Active" : "Inactive"}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Company Profile Card */}
        <Card className="bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-xl border-border/50 shadow-xl">
          <CardHeader>
            <CardTitle>Company Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                id="company_name"
                label="Company Name"
                value={formData.company_profile.name}
                onChange={(value) => handleCompanyProfileChange("name", value)}
                placeholder="Enter company name"
              />
              <FormField
                id="company_email"
                label="Company Email"
                type="email"
                value={formData.company_profile.email}
                onChange={(value) => handleCompanyProfileChange("email", value)}
                placeholder="Enter company email"
              />
            </div>
          </CardContent>
        </Card>

        {/* Services Card */}
        <Card className="bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-xl border-border/50 shadow-xl">
          <CardHeader>
            <CardTitle>Services</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {services.length === 0 ? (
                <p className="col-span-full text-center text-muted-foreground">No services available.</p>
              ) : (
                services.map((service) => {
                  const isChecked = subscribedServices.some((s) => s.service_id === service._id);
                  const subscribedService = subscribedServices.find((s) => s.service_id === service._id) || {
                    price: service.price,
                    environment: "sandbox" as const,
                    request_limit: 1000,
                  };

                  return (
                    <div
                      key={service._id}
                      className="flex flex-col p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 bg-card"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-base font-semibold">{service.name}</div>
                        <Switch
                          checked={isChecked}
                          onCheckedChange={() => handleServiceToggle(service._id, service.name, service.price)}
                        />
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{service.description}</p>
                      {isChecked && (
                        <div className="flex flex-col gap-3 mt-auto pt-2 border-t border-border">
                          <div className="flex items-center gap-2">
                            <Label
                              htmlFor={`price-${service._id}`}
                              className="text-sm font-medium w-28 text-right"
                            >
                              Price:
                            </Label>
                            <div className="flex items-center gap-2 flex-1">
                              <Input
                                id={`price-${service._id}`}
                                type="number"
                                value={subscribedService.price}
                                onChange={(e) => handleServicePrice(service._id, parseFloat(e.target.value) || 0)}
                                className="w-24 text-sm"
                                placeholder="Price"
                              />
                              <span className="text-sm text-muted-foreground">USD</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Label
                              htmlFor={`environment-${service._id}`}
                              className="text-sm font-medium w-28 text-right"
                            >
                              Environment:
                            </Label>
                            <Select
                              value={subscribedService.environment}
                              onValueChange={(value: "production" | "sandbox") =>
                                handleServiceEnvironment(service._id, value)
                              }
                            >
                              <SelectTrigger id={`environment-${service._id}`} className="w-24">
                                <SelectValue placeholder="Select environment" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="sandbox">Sandbox</SelectItem>
                                <SelectItem value="production">Production</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="flex items-center gap-2">
                            <Label
                              htmlFor={`request-limit-${service._id}`}
                              className="text-sm font-medium w-28 text-right"
                            >
                              Request Limit:
                            </Label>
                            <Input
                              id={`request-limit-${service._id}`}
                              type="number"
                              value={subscribedService.request_limit}
                              onChange={(e) => handleServiceRequestLimit(service._id, parseInt(e.target.value) || 0)}
                              className="w-24 text-sm"
                              placeholder="Limit"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-6">
          <Button variant="outline" type="button" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button type="submit">Save</Button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;