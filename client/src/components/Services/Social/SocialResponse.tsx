import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { 
  Mail, 
  Phone, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Github,
  Youtube,
  MessageCircle,
  Camera,
  Music,
  ShoppingBag,
  Globe,
  User,
  Star
} from "lucide-react";

interface SocialResponseProps {
  response: any;
  timestamp: Date;
  requestId: string;
}

// Social media icon mapping
const getSocialIcon = (platform: string) => {
  const iconMap: { [key: string]: React.ReactNode } = {
    facebook: <Facebook className="w-4 h-4" />,
    twitter: <Twitter className="w-4 h-4" />,
    instagram: <Instagram className="w-4 h-4" />,
    linkedin: <Linkedin className="w-4 h-4" />,
    github: <Github className="w-4 h-4" />,
    youtube: <Youtube className="w-4 h-4" />,
    whatsapp: <MessageCircle className="w-4 h-4" />,
    telegram: <MessageCircle className="w-4 h-4" />,
    snapchat: <Camera className="w-4 h-4" />,
    spotify: <Music className="w-4 h-4" />,
    amazon: <ShoppingBag className="w-4 h-4" />,
    google: <Globe className="w-4 h-4" />,
    apple: <Globe className="w-4 h-4" />,
    microsoft: <Globe className="w-4 h-4" />,
    pinterest: <Star className="w-4 h-4" />,
    tumblr: <Globe className="w-4 h-4" />,
    reddit: <Globe className="w-4 h-4" />,
    discord: <MessageCircle className="w-4 h-4" />,
    skype: <MessageCircle className="w-4 h-4" />,
    viber: <MessageCircle className="w-4 h-4" />,
    gravatar: <User className="w-4 h-4" />,
    atlassian: <Globe className="w-4 h-4" />,
    adobe: <Globe className="w-4 h-4" />,
    wordpress: <Globe className="w-4 h-4" />,
    disneyplus: <Globe className="w-4 h-4" />,
    to_phone: <MessageCircle className="w-4 h-4" />,
    to_email: <Mail className="w-4 h-4" />,
    flickr: <Camera className="w-4 h-4" />,
    foursquare: <Globe className="w-4 h-4" />,
    lastfm: <Music className="w-4 h-4" />,
    myspace: <Globe className="w-4 h-4" />,
    vimeo: <Globe className="w-4 h-4" />,
    weibo: <Globe className="w-4 h-4" />,
    ok: <Globe className="w-4 h-4" />,
    kakao: <MessageCircle className="w-4 h-4" />,
    airbnb: <Globe className="w-4 h-4" />,
    qzone: <Globe className="w-4 h-4" />,
    mailru: <Mail className="w-4 h-4" />,
    imgur: <Camera className="w-4 h-4" />,
    netflix: <Globe className="w-4 h-4" />,
    jdid: <Globe className="w-4 h-4" />,
    flipkart: <ShoppingBag className="w-4 h-4" />,
    bukalapak: <ShoppingBag className="w-4 h-4" />,
    archiveorg: <Globe className="w-4 h-4" />,
    lazada: <ShoppingBag className="w-4 h-4" />,
    zoho: <Globe className="w-4 h-4" />,
    evernote: <Globe className="w-4 h-4" />,
    envato: <Globe className="w-4 h-4" />,
    patreon: <Globe className="w-4 h-4" />,
    tokopedia: <ShoppingBag className="w-4 h-4" />,
    rambler: <Globe className="w-4 h-4" />,
    quora: <Globe className="w-4 h-4" />,
    yahoo: <Mail className="w-4 h-4" />,
    ebay: <ShoppingBag className="w-4 h-4" />,
    booking: <Globe className="w-4 h-4" />,
    samsung: <Globe className="w-4 h-4" />,
    deliveroo: <ShoppingBag className="w-4 h-4" />,
    hubspot: <Globe className="w-4 h-4" />,
    duolingo: <Globe className="w-4 h-4" />,
    lastpass: <Globe className="w-4 h-4" />,
    freelancer: <Globe className="w-4 h-4" />,
    paypal: <ShoppingBag className="w-4 h-4" />,
    binance: <ShoppingBag className="w-4 h-4" />,
    zalo: <MessageCircle className="w-4 h-4" />,
    line: <MessageCircle className="w-4 h-4" />,
    default: <User className="w-4 h-4" />
  };
  
  return iconMap[platform.toLowerCase()] || iconMap.default;
};

// Get risk score color with dark theme support
const getRiskScoreColor = (score: number) => {
  if (score >= 80) return "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800";
  if (score >= 60) return "text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-800";
  if (score >= 40) return "text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-800";
  return "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800";
};

// Simple social media card component - shows only platform name and status
const SocialMediaCard = ({ platform, data }: { platform: string; data: any }) => {
  const isRegistered = data.registered === true;
  const isUnregistered = data.registered === false;

  return (
    <Card className={`transition-all hover:shadow-md ${
      isRegistered 
        ? 'border-green-200 dark:border-green-800 bg-green-50/30 dark:bg-green-950/20' 
        : isUnregistered 
        ? 'border-red-200 dark:border-red-800 bg-red-50/30 dark:bg-red-950/20' 
        : 'border-gray-200 dark:border-gray-700 bg-gray-50/30 dark:bg-gray-800/20'
    }`}>
      <CardContent className="p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getSocialIcon(platform)}
            <h4 className="font-medium capitalize text-foreground">{platform}</h4>
          </div>
          <Badge variant={isRegistered ? "default" : isUnregistered ? "destructive" : "secondary"}>
            {isRegistered ? (
              <><CheckCircle className="w-3 h-3 mr-1" /> Found</>
            ) : isUnregistered ? (
              <><XCircle className="w-3 h-3 mr-1" /> Not Found</>
            ) : (
              <><AlertCircle className="w-3 h-3 mr-1" /> Unknown</>
            )}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

const SocialResponse: React.FC<SocialResponseProps> = ({ 
  response, 
  timestamp, 
  requestId 
}) => {
  // Handle nested data structure: response.data.data
  const data = response?.data?.data || response?.data;
  
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

  return (
    <Card className="border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/20">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-base flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            Social Verification Results
          </CardTitle>
          <Badge variant="outline" className="text-xs">
            {timestamp.toLocaleString()}
          </Badge>
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
                  <Badge className={`ml-2 ${getRiskScoreColor(emailDetails.risk_score)}`}>
                    Risk Score: {emailDetails.risk_score}%
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  {/* Show all platforms */}
                  {(emailDetails.account_details || emailDetails.other_details) && (
                    <div>
                      <h4 className="font-medium mb-3 text-foreground">Platform Status</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {emailDetails.account_details && Object.entries(emailDetails.account_details).map(([platform, data]) => (
                          <SocialMediaCard 
                            key={platform} 
                            platform={platform} 
                            data={data} 
                          />
                        ))}
                        {emailDetails.other_details && Object.entries(emailDetails.other_details).map(([platform, data]) => (
                          <SocialMediaCard 
                            key={`other-${platform}`} 
                            platform={platform} 
                            data={data} 
                          />
                        ))}
                      </div>
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
                  <Badge className={`ml-2 ${getRiskScoreColor(phoneDetails.risk_score)}`}>
                    Risk Score: {phoneDetails.risk_score}%
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  {/* Show all platforms */}
                  {(phoneDetails.account_details || phoneDetails.other_details) && (
                    <div>
                      <h4 className="font-medium mb-3 text-foreground">Platform Status</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {phoneDetails.account_details && Object.entries(phoneDetails.account_details).map(([platform, data]) => (
                          <SocialMediaCard 
                            key={platform} 
                            platform={platform} 
                            data={data} 
                          />
                        ))}
                        {phoneDetails.other_details && Object.entries(phoneDetails.other_details).map(([platform, data]) => (
                          <SocialMediaCard 
                            key={`other-${platform}`} 
                            platform={platform} 
                            data={data} 
                          />
                        ))}
                      </div>
                    </div>
                  )}
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

export default SocialResponse;