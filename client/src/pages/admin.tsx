import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, ArrowRight } from "lucide-react";

export default function Admin() {
  const queueAdminUrl = "http://localhost:3000/admin"; // Queue system admin URL

  useEffect(() => {
    // Auto-redirect after 3 seconds
    const timer = setTimeout(() => {
      window.location.href = queueAdminUrl;
    }, 3000);

    return () => clearTimeout(timer);
  }, [queueAdminUrl]);

  const handleRedirect = () => {
    window.location.href = queueAdminUrl;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-6">
      <Card className="max-w-md w-full shadow-lg">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
            Admin Dashboard Moved
          </CardTitle>
          <div className="text-6xl mb-4">🔧</div>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600 mb-4">
            The admin functionality has been centralized to our main queue management system for better efficiency.
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-blue-800">
              <strong>Auto-redirecting in 3 seconds...</strong>
            </p>
          </div>

          <div className="space-y-3">
            <Button
              onClick={handleRedirect}
              className="w-full bg-orange-600 hover:bg-orange-700"
              size="lg"
            >
              <ArrowRight className="w-5 h-5 mr-2" />
              Go to Admin Dashboard
            </Button>

            <Button
              variant="outline"
              onClick={() => window.location.href = "/"}
              className="w-full"
            >
              Back to Website
            </Button>
          </div>

          <div className="pt-4 border-t">
            <p className="text-xs text-gray-500">
              Having issues? Contact support or use the queue system directly.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}