import React, { useState, useCallback, useEffect } from 'react'
import FormField from "@/components/common/FormFiled";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import EnvironmentSwitch from "@/components/common/EnvironmentSwitch";
import { useUser } from "@/contexts/UserContext";
import getServiceEnv from '@/utils/getServiceEnv';
import { socialService } from '@/api/services';
import SocialResponse from './SocialResponse';

interface FormData {
  request_id: string;
  email: string;
  phone: string;
  envType: "production" | "sandbox";
}

interface ValidationError {
  field: string;
  message: string;
}

interface ResponseRecord {
  id: string;
  timestamp: Date;
  request: FormData;
  response: any;
  status: 'success' | 'error';
}

function SocialRequest() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useUser();

  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [responses, setResponses] = useState<ResponseRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    email: "",
    phone: "",
    request_id: "",
    envType: getServiceEnv(user, "Social"),
  });

  useEffect(() => {
    setFormData(prev => ({ ...prev, envType: getServiceEnv(user, "Social") }));
  }, [user]);

  // Handles changes for general form fields.
  const handleInputChange = useCallback((field: keyof FormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  // Validation logic for required fields.
  const validateForm = useCallback((): ValidationError[] => {
    const newErrors: ValidationError[] = [];
    const requiredFields: [keyof FormData, string][] = [
      ["request_id", "Request ID"],
      ["email", "Email"],
      ["phone", "Phone No."],
    ];

    requiredFields.forEach(([field, label]) => {
      const value = formData[field];
      if (typeof value === "string" && !value.trim()) {
        newErrors.push({ field, message: `${label} is required.` });
      }
    });

    return newErrors;
  }, [formData]);

  // Helper to get error message for a specific field.
  const getErrorForField = useCallback(
    (field: string) => errors.find((err) => err.field === field)?.message,
    [errors]
  );

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

      setIsLoading(true);
      const requestId = Date.now().toString();

      try {
        const response = await socialService(formData);
        
        // Add successful response to records
        const newRecord: ResponseRecord = {
          id: requestId,
          timestamp: new Date(),
          request: { ...formData },
          response: response,
          status: 'success'
        };
        
        setResponses(prev => [newRecord, ...prev]);
        
        toast({
          title: "Success",
          description: "Social service response received successfully.",
        });
        
        // Clear form after successful submission
        setFormData(prev => ({
          email: "",
          phone: "",
          request_id: "",
          envType: prev.envType,
        }));
        setErrors([]);
        
      } catch (error: any) {
        console.error("Error in handleSubmit:", error);
        
        // Add error response to records
        const newRecord: ResponseRecord = {
          id: requestId,
          timestamp: new Date(),
          request: { ...formData },
          response: error,
          status: 'error'
        };
        
        setResponses(prev => [newRecord, ...prev]);
        
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
      } finally {
        setIsLoading(false);
      }
    },
    [formData, toast, validateForm]
  );

  return (
    <div className="space-y-8 pt-6">
      {/* Request Form */}
      <form onSubmit={handleSubmit}>
        <div className="rounded-lg border bg-card text-card-foreground bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-xl border-border/50 shadow-xl">
          <Card className="bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-xl border-border/50 shadow-xl">
            <CardHeader>
              <div className="flex justify-between items-start w-full">
                <CardTitle>Social Request</CardTitle>
                <EnvironmentSwitch serviceName="Social" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <FormField
                  id="request_id"
                  label="Request ID"
                  value={formData.request_id}
                  onChange={(value) => handleInputChange("request_id", value)}
                  placeholder="Enter request ID"
                  error={getErrorForField("request_id")}
                />
                <FormField
                  id="phone"
                  label="Phone No."
                  value={formData.phone}
                  onChange={(value) => handleInputChange("phone", value)}
                  placeholder="Enter phone number"
                  error={getErrorForField("phone")}
                />
                <FormField
                  id="email"
                  label="Email"
                  type="text"
                  value={formData.email}
                  onChange={(value) => handleInputChange("email", value)}
                  required
                  placeholder="Enter email"
                  error={getErrorForField("email")}
                />
              </div>
              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-6">
                <Button variant="outline" type="button" onClick={() => navigate(-1)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Processing..." : "Submit Request"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </form>

      {/* Response Records */}
      {responses.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Response History</h3>
          {responses.map((record) => (
            <div key={record.id} className="space-y-4">
              {/* Request Summary */}
              <Card className="border-blue-200 bg-blue-50/30">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-base">
                      Request #{record.request.request_id}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        record.status === 'success' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {record.status === 'success' ? 'Success' : 'Error'}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {record.timestamp.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Request ID:</span>
                      <p className="text-muted-foreground">{record.request.request_id}</p>
                    </div>
                    <div>
                      <span className="font-medium">Email:</span>
                      <p className="text-muted-foreground">{record.request.email}</p>
                    </div>
                    <div>
                      <span className="font-medium">Phone:</span>
                      <p className="text-muted-foreground">{record.request.phone}</p>
                    </div>
                    <div>
                      <span className="font-medium">Environment:</span>
                      <p className="text-muted-foreground">{record.request.envType}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Response Display */}
              {record.status === 'success' ? (
                <SocialResponse 
                  response={record.response}
                  timestamp={record.timestamp}
                  requestId={record.request.request_id}
                />
              ) : (
                <Card className="border-red-200 bg-red-50/50">
                  <CardHeader>
                    <CardTitle className="text-base text-red-600">Error Response</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-red-100/50 rounded-md p-3">
                      <pre className="text-xs overflow-x-auto whitespace-pre-wrap text-red-800">
                        {JSON.stringify(record.response, null, 2)}
                      </pre>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default SocialRequest