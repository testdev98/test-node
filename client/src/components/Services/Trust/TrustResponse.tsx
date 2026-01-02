import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { 
  Mail, 
  Phone, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Shield,
  Globe,
  User,
  Calendar,
  ExternalLink,
  Database,
  Activity
} from "lucide-react";

interface TrustResponseProps {
  response: any;
  timestamp: Date;
  requestId: string;
}

// Get risk score color with dark theme support
const getRiskScoreColor = (score: number) => {
  if (score >= 80) return "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800";
  if (score >= 60) return "text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-800";
  if (score >= 40) return "text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-800";
  return "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800";
};

// Get fraud score color (higher is worse for fraud)
const getFraudScoreColor = (score: number) => {
  if (score >= 80) return "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800";
  if (score >= 60) return "text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-800";
  if (score >= 40) return "text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-800";
  return "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800";
};

// Breach details component
const BreachDetails = ({ breachDetails }: { breachDetails: any }) => {
  if (!breachDetails || breachDetails.count === 0) {
    return (
      <div className="text-sm text-muted-foreground">
        No data breaches found
      </div>
    );
  }

  const breachData = typeof breachDetails.data === 'string' 
    ? JSON.parse(breachDetails.data) 
    : breachDetails.data;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 text-red-500" />
        <span className="font-medium text-red-600 dark:text-red-400">
          {breachDetails.count} breach{breachDetails.count !== 1 ? 'es' : ''} found
        </span>
      </div>
      
      <div className="text-sm space-y-1">
        <p><span className="font-medium">First breach:</span> {breachDetails.first_breach}</p>
        <p><span className="font-medium">Last breach:</span> {breachDetails.last_breach}</p>
      </div>

      {breachData && breachData.length > 0 && (
        <div className="space-y-2">
          <h5 className="font-medium text-sm">Recent Breaches:</h5>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {breachData.slice(0, 5).map((breach: any, index: number) => (
              <div key={index} className="bg-muted/50 rounded p-2 text-xs">
                <div className="flex justify-between items-start">
                  <span className="font-medium">{breach.title}</span>
                  <span className="text-muted-foreground">{breach.date}</span>
                </div>
                {breach.names && breach.names.length > 0 && (
                  <div className="mt-1">
                    <span className="text-muted-foreground">Names: </span>
                    {breach.names.map((name: any, i: number) => (
                      <span key={i} className="text-xs">
                        {name.first_name} {name.last_name}
                        {i < breach.names.length - 1 ? ', ' : ''}
                      </span>
                    ))}
                  </div>
                )}
                {breach.emails && breach.emails.length > 0 && (
                  <div className="mt-1">
                    <span className="text-muted-foreground">Emails: </span>
                    <span className="text-xs">{breach.emails.join(', ')}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Domain details component
const DomainDetails = ({ domainDetails }: { domainDetails: any }) => {
  if (!domainDetails) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
      <div>
        <span className="font-medium">Domain:</span>
        <p className="text-muted-foreground">{domainDetails.domain}</p>
      </div>
      <div>
        <span className="font-medium">Age:</span>
        <p className="text-muted-foreground">{domainDetails.age} days</p>
      </div>
      <div>
        <span className="font-medium">TLD:</span>
        <p className="text-muted-foreground">{domainDetails.tld}</p>
      </div>
      <div>
        <span className="font-medium">Disposable:</span>
        <Badge variant={domainDetails.disposable ? "destructive" : "default"}>
          {domainDetails.disposable ? "Yes" : "No"}
        </Badge>
      </div>
      <div>
        <span className="font-medium">Free Email:</span>
        <Badge variant={domainDetails.free ? "secondary" : "default"}>
          {domainDetails.free ? "Yes" : "No"}
        </Badge>
      </div>
      <div>
        <span className="font-medium">Website Exists:</span>
        <Badge variant={domainDetails.website_exists ? "default" : "secondary"}>
          {domainDetails.website_exists ? "Yes" : "No"}
        </Badge>
      </div>
    </div>
  );
};

const TrustResponse: React.FC<TrustResponseProps> = ({ 
  response, 
  timestamp, 
  requestId 
}) => {
  const data = response?.data;
  
  if (!data) {
    return (
      <Card className="border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-950/20">
        <CardContent className="p-4">
          <p className="text-red-600 dark:text-red-400">No response data available</p>
        </CardContent>
      </Card>
    );
  }

  const emailDetails = data.email_details;
  const phoneDetails = data.phone_details;
  const ipDetails = data.ip_details;
  const fraudScore = data.fraud_score;

  return (
    <Card className="border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/20">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-base flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
            Trust Verification Results
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge className={`${getFraudScoreColor(fraudScore)}`}>
              Fraud Score: {fraudScore}%
            </Badge>
            <Badge variant="outline" className="text-xs">
              {timestamp.toLocaleString()}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Accordion type="multiple" className="w-full">
          {/* Email Details */}
          {emailDetails && (
            <AccordionItem value="email">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4" />
                  <span>Email Analysis: {emailDetails.email}</span>
                  <Badge className={`ml-2 ${getRiskScoreColor(emailDetails.score)}`}>
                    Score: {emailDetails.score}%
                  </Badge>
                  <Badge variant={emailDetails.email_status === 'deliverable' ? 'default' : 'destructive'}>
                    {emailDetails.email_status}
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-6">
                  {/* Domain Details */}
                  {emailDetails.domain_details && (
                    <div>
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        Domain Information
                      </h4>
                      <DomainDetails domainDetails={emailDetails.domain_details} />
                    </div>
                  )}

                  {/* Account Details */}
                  {emailDetails.account_details && (
                    <div>
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Account Analysis
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Length:</span>
                          <p className="text-muted-foreground">{emailDetails.account_details.length}</p>
                        </div>
                        <div>
                          <span className="font-medium">Numbers:</span>
                          <p className="text-muted-foreground">{emailDetails.account_details.numbers_count}</p>
                        </div>
                        <div>
                          <span className="font-medium">Letters:</span>
                          <p className="text-muted-foreground">{emailDetails.account_details.letters_count}</p>
                        </div>
                        <div>
                          <span className="font-medium">Symbols:</span>
                          <p className="text-muted-foreground">{emailDetails.account_details.symbols_count}</p>
                        </div>
                        {emailDetails.account_details.parsed_first_name && (
                          <div>
                            <span className="font-medium">Parsed Name:</span>
                            <p className="text-muted-foreground">
                              {emailDetails.account_details.parsed_first_name} {emailDetails.account_details.parsed_last_name}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Breach Details */}
                  {emailDetails.breach_details && (
                    <div>
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        <Database className="w-4 h-4" />
                        Data Breach Information
                      </h4>
                      <BreachDetails breachDetails={emailDetails.breach_details} />
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          )}

          {/* Phone Details */}
          {phoneDetails && (
            <AccordionItem value="phone">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4" />
                  <span>Phone Analysis: {phoneDetails.number}</span>
                  <Badge className={`ml-2 ${getRiskScoreColor(phoneDetails.score)}`}>
                    Score: {phoneDetails.score}%
                  </Badge>
                  <Badge variant={phoneDetails.valid ? 'default' : 'destructive'}>
                    {phoneDetails.valid ? 'Valid' : 'Invalid'}
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-6">
                  {/* Phone Info */}
                  <div>
                    <h4 className="font-medium mb-3">Phone Information</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Type:</span>
                        <p className="text-muted-foreground capitalize">{phoneDetails.type}</p>
                      </div>
                      <div>
                        <span className="font-medium">Country:</span>
                        <p className="text-muted-foreground">{phoneDetails.country_code}</p>
                      </div>
                      <div>
                        <span className="font-medium">Disposable:</span>
                        <Badge variant={phoneDetails.disposable ? "destructive" : "default"}>
                          {phoneDetails.disposable ? "Yes" : "No"}
                        </Badge>
                      </div>
                      <div>
                        <span className="font-medium">Suspicious Format:</span>
                        <Badge variant={phoneDetails.suspicious_format ? "destructive" : "default"}>
                          {phoneDetails.suspicious_format ? "Yes" : "No"}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Breach Details */}
                  {phoneDetails.breach_details && (
                    <div>
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        <Database className="w-4 h-4" />
                        Data Breach Information
                      </h4>
                      <BreachDetails breachDetails={phoneDetails.breach_details} />
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          )}

          {/* IP Details */}
          {ipDetails && (
            <AccordionItem value="ip">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3">
                  <Globe className="w-4 h-4" />
                  <span>IP Analysis: {ipDetails.ip}</span>
                  <Badge className={`ml-2 ${getRiskScoreColor(ipDetails.score)}`}>
                    Score: {ipDetails.score}%
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <h4 className="font-medium mb-3">IP Information</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Connection Type:</span>
                      <p className="text-muted-foreground">{ipDetails.connection_type}</p>
                    </div>
                    <div>
                      <span className="font-medium">XBL Count:</span>
                      <p className="text-muted-foreground">{ipDetails.xbl_count}</p>
                    </div>
                    <div>
                      <span className="font-medium">CSS Count:</span>
                      <p className="text-muted-foreground">{ipDetails.css_count}</p>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          )}

          {/* Raw Response (for debugging) */}
          <AccordionItem value="raw">
            <AccordionTrigger className="hover:no-underline">
              <span>Raw Response Data</span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="bg-muted/50 rounded-md p-3">
                <pre className="text-xs overflow-x-auto whitespace-pre-wrap">
                  {JSON.stringify(response, null, 2)}
                </pre>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default TrustResponse;