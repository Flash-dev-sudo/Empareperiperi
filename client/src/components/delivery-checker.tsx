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
      // Calculate delivery fee based on cart total
      let fee = 0;
      if (cartTotal < 10) {
        fee = 2.75;
      } else if (cartTotal >= 20) {
        fee = 1.50;
      } else {
        fee = 2.75; // Between £10-£20
      }
      
      return {
        isEligible: true,
        distance: Math.random() * 1, // Mock distance within 1 mile
        fee,
        message: `Delivery available to ${postcode.toUpperCase()}`
      };
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
    onDeliveryChange(type, type === 'delivery' ? deliveryInfo : undefined);
  };

  return (
    <div className="space-y-6">
      {/* Postcode Checker */}
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
                      • 1 mile radius - Free delivery within area
                    </p>
                    <p className="text-sm text-gray-600">
                      • Less than £10: £2.75 delivery fee
                    </p>
                    <p className="text-sm text-gray-600">
                      • £20 or more: £1.50 delivery fee
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

      {/* Delivery/Collection Options */}
      {deliveryInfo && (
        <Card>
          <CardHeader>
            <CardTitle>Choose Service Type</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Delivery Option */}
              {deliveryInfo.isEligible && (
                <div 
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedType === 'delivery' 
                      ? 'border-emparo-orange bg-emparo-orange/5' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleDeliveryTypeChange('delivery')}
                >
                  <div className="flex items-center gap-3">
                    <Truck className="h-6 w-6 text-emparo-orange" />
                    <div>
                      <h3 className="font-medium">Delivery</h3>
                      <p className="text-sm text-gray-600">30-45 minutes</p>
                      <Badge variant="outline" className="mt-1">
                        £{deliveryInfo.fee.toFixed(2)} fee
                      </Badge>
                    </div>
                  </div>
                </div>
              )}

              {/* Collection Option */}
              <div 
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedType === 'collection' 
                    ? 'border-emparo-orange bg-emparo-orange/5' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleDeliveryTypeChange('collection')}
              >
                <div className="flex items-center gap-3">
                  <Package className="h-6 w-6 text-emparo-orange" />
                  <div>
                    <h3 className="font-medium">Collection</h3>
                    <p className="text-sm text-gray-600">15-20 minutes</p>
                    <Badge variant="outline" className="mt-1">
                      FREE
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
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