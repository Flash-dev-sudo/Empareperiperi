import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Truck, Package } from "lucide-react";

interface DeliveryInfo {
  isEligible: boolean;
  distance: number;
  fee: number;
  message: string;
}

interface DeliveryCheckerProps {
  onDeliveryChange: (type: 'delivery' | 'collection', info?: DeliveryInfo) => void;
  cartTotal: number;
}

export default function DeliveryChecker({ onDeliveryChange, cartTotal }: DeliveryCheckerProps) {
  const [postcode, setPostcode] = useState("");
  const [deliveryInfo, setDeliveryInfo] = useState<DeliveryInfo | null>(null);
  const [selectedType, setSelectedType] = useState<'delivery' | 'collection' | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  // Mock postcode checker - in real app, this would use a geocoding API
  const checkDeliveryEligibility = async (postcode: string): Promise<DeliveryInfo> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock logic - in reality, you'd use a proper postcode/distance API
    const eligiblePostcodes = [
      'N4', 'N5', 'N7', 'N8', 'N15', 'N16', 'N17', 'N19', 'N22',
      'NW1', 'NW2', 'NW3', 'NW5', 'NW6', 'NW8', 'NW9', 'NW10',
      'E5', 'E8', 'E9', 'E10', 'E11', 'E17', 'E18', 'E20'
    ];
    
    const postcodePrefix = postcode.toUpperCase().replace(/[0-9]/g, '').trim();
    const isEligible = eligiblePostcodes.includes(postcodePrefix);
    
    if (isEligible) {
      // Check if within 1 mile radius (free delivery)
      const distance = Math.random() * 1.5; // Mock distance
      
      if (distance <= 1) {
        return {
          isEligible: true,
          distance,
          fee: 0,
          message: `Free delivery to ${postcode.toUpperCase()} (within 1 mile)`
        };
      } else {
        // Calculate delivery fee based on cart total for outside 1 mile
        let fee = 0;
        if (cartTotal < 10) {
          fee = 2.75;
        } else if (cartTotal >= 20) {
          fee = 0; // Free delivery for orders over £20
        } else {
          fee = 1.50; // Between £10-£20
        }
        
        return {
          isEligible: true,
          distance,
          fee,
          message: `Delivery available to ${postcode.toUpperCase()} - £${fee.toFixed(2)}`
        };
      }
    } else {
      return {
        isEligible: false,
        distance: Math.random() * 3 + 1, // Mock distance over 1 mile
        fee: 0,
        message: `Sorry, ${postcode.toUpperCase()} is outside our delivery area. Collection only.`
      };
    }
  };

  const handlePostcodeCheck = async () => {
    if (!postcode.trim()) return;
    
    setIsChecking(true);
    try {
      const info = await checkDeliveryEligibility(postcode);
      setDeliveryInfo(info);
      
      if (info.isEligible) {
        setSelectedType('delivery');
        onDeliveryChange('delivery', info);
      } else {
        setSelectedType('collection');
        onDeliveryChange('collection');
      }
    } catch (error) {
      console.error('Error checking delivery:', error);
    } finally {
      setIsChecking(false);
    }
  };

  const handleDeliveryTypeChange = (type: 'delivery' | 'collection') => {
    setSelectedType(type);
    if (type === 'collection') {
      onDeliveryChange('collection', { isEligible: true, distance: 0, fee: 0, message: 'Collection selected' });
    } else {
      onDeliveryChange('delivery', deliveryInfo);
    }
  };

  return (
    <div className="space-y-6">
      {/* Order Type Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Order Type</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              variant={selectedType === 'collection' ? 'default' : 'outline'}
              onClick={() => handleDeliveryTypeChange('collection')}
              className="p-4 h-auto flex flex-col items-center gap-2"
            >
              <Package className="h-6 w-6" />
              <div className="text-center">
                <div className="font-semibold">Collection</div>
                <div className="text-sm text-gray-600">Pick up from restaurant</div>
              </div>
            </Button>
            
            <Button
              variant={selectedType === 'delivery' ? 'default' : 'outline'}
              onClick={() => handleDeliveryTypeChange('delivery')}
              className="p-4 h-auto flex flex-col items-center gap-2"
              disabled={deliveryInfo && !deliveryInfo.isEligible}
            >
              <Truck className="h-6 w-6" />
              <div className="text-center">
                <div className="font-semibold">Delivery</div>
                <div className="text-sm text-gray-600">Delivered to your door</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Postcode Checker - only show if delivery is selected */}
      {selectedType === 'delivery' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Check Delivery Area
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="postcode">Enter your postcode</Label>
              <div className="flex gap-2">
                <Input
                  id="postcode"
                  placeholder="e.g. N4 3JP"
                  value={postcode}
                  onChange={(e) => setPostcode(e.target.value)}
                  className="flex-1"
                />
                <Button 
                  onClick={handlePostcodeCheck}
                  disabled={isChecking || !postcode.trim()}
                >
                  {isChecking ? "Checking..." : "Check"}
                </Button>
              </div>
            </div>

            {deliveryInfo && (
              <div className="space-y-3">
                <div className={`p-3 rounded-lg ${
                  deliveryInfo.isEligible 
                    ? 'bg-green-50 border border-green-200' 
                    : 'bg-yellow-50 border border-yellow-200'
                }`}>
                  <p className="text-sm font-medium">{deliveryInfo.message}</p>
                  {deliveryInfo.isEligible && (
                    <div className="mt-2 space-y-1">
                      <p className="text-sm text-gray-600">
                        • Within 1 mile: Free delivery
                      </p>
                      <p className="text-sm text-gray-600">
                        • Less than £10: £2.75 delivery fee
                      </p>
                      <p className="text-sm text-gray-600">
                        • £10-£20: £1.50 delivery fee
                      </p>
                      <p className="text-sm text-gray-600">
                        • £20+: Free delivery
                      </p>
                      <p className="text-sm font-medium text-emparo-orange">
                        Your delivery fee: £{deliveryInfo.fee.toFixed(2)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}



      {/* Collection Time Selector */}
      {selectedType === 'collection' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Select Collection Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CollectionTimeSelector />
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function CollectionTimeSelector() {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");

  // Generate available dates (next 7 days)
  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      const dayName = date.toLocaleDateString('en-GB', { weekday: 'long' });
      const dayNum = date.getDate();
      const month = date.toLocaleDateString('en-GB', { month: 'long' });
      
      dates.push({
        value: date.toISOString().split('T')[0],
        label: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : `${dayName} ${dayNum}th ${month}`
      });
    }
    
    return dates;
  };

  // Generate time slots (4:15 PM to 9:00 PM, 15-minute intervals)
  const getTimeSlots = () => {
    const slots = [];
    const startHour = 16;
    const endHour = 21;
    
    for (let hour = startHour; hour <= endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        if (hour === 21 && minute > 0) break; // Stop at 21:00
        
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(time);
      }
    }
    
    return slots;
  };

  const availableDates = getAvailableDates();
  const timeSlots = getTimeSlots();

  return (
    <div className="space-y-4">
      {/* Date Selection */}
      <div className="space-y-2">
        <Label>Select Date</Label>
        <select 
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="w-full p-2 border rounded-md"
        >
          <option value="">Choose a date</option>
          {availableDates.map((date) => (
            <option key={date.value} value={date.value}>
              {date.label}
            </option>
          ))}
        </select>
      </div>

      {/* Time Selection */}
      {selectedDate && (
        <div className="space-y-2">
          <Label>Select Time</Label>
          <div className="grid grid-cols-3 gap-2">
            {timeSlots.map((time) => (
              <Button
                key={time}
                variant={selectedTime === time ? "default" : "outline"}
                className={`text-sm ${
                  selectedTime === time 
                    ? "bg-emparo-orange hover:bg-emparo-orange/90" 
                    : ""
                }`}
                onClick={() => setSelectedTime(time)}
              >
                {time}
              </Button>
            ))}
          </div>
        </div>
      )}

      {selectedDate && selectedTime && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm font-medium text-green-800">
            Collection scheduled for {selectedTime} on {availableDates.find(d => d.value === selectedDate)?.label}
          </p>
        </div>
      )}
    </div>
  );
}