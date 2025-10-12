'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SiteSettingsForm } from './components/site-settings-form';
import { GeneralSettings, DeliverySettings } from './types';
import { toast } from '@/components/ui/use-toast';

export default function SettingsPage() {
  const [generalSettings, setGeneralSettings] = useState<GeneralSettings>({
    restaurantName: '',
    address: '',
    phone: '',
    email: '',
    logo: '',
    currency: '',
  });

  const [deliverySettings, setDeliverySettings] = useState<DeliverySettings>({
    enableDelivery: false,
    deliveryFee: '',
    freeDeliveryThreshold: '',
    deliveryRadius: '',
  });

  const [generalLoading, setGeneralLoading] = useState<boolean>(true);
  const [deliveryLoading, setDeliveryLoading] = useState<boolean>(true);
  const [savingGeneral, setSavingGeneral] = useState<boolean>(false);
  const [savingDelivery, setSavingDelivery] = useState<boolean>(false);

  // Fetch settings from API
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        // Fetch general settings
        setGeneralLoading(true);
        const generalResponse = await fetch('/api/settings/general');

        if (generalResponse.ok) {
          const generalData = await generalResponse.json();
          setGeneralSettings(generalData);
        } else {
          // Fallback to default values for development
          setGeneralSettings({
            restaurantName: 'My Restaurant',
            address: '123 Main Street, City',
            phone: '+1 234 567 8900',
            email: 'contact@myrestaurant.com',
            logo: '/placeholder-logo.svg',
            currency: 'USD',
          });
        }

        // Fetch delivery settings
        setDeliveryLoading(true);
        const deliveryResponse = await fetch('/api/settings/delivery');

        if (deliveryResponse.ok) {
          const deliveryData = await deliveryResponse.json();
          setDeliverySettings(deliveryData);
        } else {
          // Fallback to default values for development
          setDeliverySettings({
            enableDelivery: true,
            deliveryFee: '5.00',
            freeDeliveryThreshold: '50.00',
            deliveryRadius: '10',
          });
        }
      } catch (err) {
        console.error('Error fetching settings:', err);
        toast({
          title: "Error",
          description: "Failed to load settings. Using default values.",
          variant: "destructive",
        });

        // Set default values
        setGeneralSettings({
          restaurantName: 'My Restaurant',
          address: '123 Main Street, City',
          phone: '+1 234 567 8900',
          email: 'contact@myrestaurant.com',
          logo: '/placeholder-logo.svg',
          currency: 'USD',
        });

        setDeliverySettings({
          enableDelivery: true,
          deliveryFee: '5.00',
          freeDeliveryThreshold: '50.00',
          deliveryRadius: '10',
        });
      } finally {
        setGeneralLoading(false);
        setDeliveryLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleGeneralSubmit = async (settings: GeneralSettings) => {
    try {
      setSavingGeneral(true);

      // API call to save general settings
      const response = await fetch('/api/settings/general', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      if (!response.ok) {
        throw new Error('Failed to save general settings');
      }

      const updatedSettings = await response.json();
      setGeneralSettings(updatedSettings);

      toast({
        title: "Success",
        description: "General settings saved successfully.",
      });
    } catch (err) {
      console.error('Error saving general settings:', err);
      toast({
        title: "Error",
        description: "Failed to save general settings.",
        variant: "destructive",
      });
    } finally {
      setSavingGeneral(false);
    }
  };

  const handleDeliverySubmit = async (settings: DeliverySettings) => {
    try {
      setSavingDelivery(true);

      // API call to save delivery settings
      const response = await fetch('/api/settings/delivery', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      if (!response.ok) {
        throw new Error('Failed to save delivery settings');
      }

      const updatedSettings = await response.json();
      setDeliverySettings(updatedSettings);

      toast({
        title: "Success",
        description: "Delivery settings saved successfully.",
      });
    } catch (err) {
      console.error('Error saving delivery settings:', err);
      toast({
        title: "Error",
        description: "Failed to save delivery settings.",
        variant: "destructive",
      });
    } finally {
      setSavingDelivery(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Settings</h1>
      <SiteSettingsForm />
    </div >
  );
}