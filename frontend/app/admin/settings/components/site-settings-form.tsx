'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import { getSettings, updateSettings, type Settings } from '@/lib/settingsApi';
import { toast } from '@/components/ui/use-toast';

export function SiteSettingsForm() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<Settings>({
    phonenumbers: [''],
    location: '',
    title: '',
    language: 'uz',
    description: '',
    socialMediaLinks: {
      instagram: '',
      telegram: ''
    },
    logo: '',
    banner: ''
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await getSettings();
        setSettings(data);
      } catch (error) {
        console.error("Settings ma'lumotlarini olishda xatolik:", error);
        toast({
          title: "Xatolik",
          description: "Sozlamalarni yuklashda xatolik yuz berdi",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith("socialMediaLinks.")) {
      const socialField = name.split(".")[1];
      setSettings({
        ...settings,
        socialMediaLinks: {
          ...settings.socialMediaLinks,
          [socialField]: value
        }
      });
    } else {
      setSettings({
        ...settings,
        [name]: value
      });
    }
  };

  const handlePhoneChange = (index: number, value: string) => {
    const updatedPhones = [...settings.phonenumbers];
    updatedPhones[index] = value;
    setSettings({
      ...settings,
      phonenumbers: updatedPhones
    });
  };

  const addPhoneNumber = () => {
    setSettings({
      ...settings,
      phonenumbers: [...settings.phonenumbers, ""]
    });
  };

  const removePhoneNumber = (index: number) => {
    if (settings.phonenumbers.length > 1) {
      const updatedPhones = [...settings.phonenumbers];
      updatedPhones.splice(index, 1);
      setSettings({
        ...settings,
        phonenumbers: updatedPhones
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await updateSettings(settings);
      toast({
        title: "Muvaffaqiyatli",
        description: "Sozlamalar yangilandi",
      });
    } catch (error) {
      console.error("Settings ma'lumotlarini yangilashda xatolik:", error);
      toast({
        title: "Xatolik",
        description: "Sozlamalarni yangilashda xatolik yuz berdi",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Sayt nomi</Label>
              <Input
                id="title"
                name="title"
                value={settings.title}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Tavsif</Label>
              <Textarea
                id="description"
                name="description"
                value={settings.description || ""}
                onChange={handleChange}
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Manzil</Label>
              <Input
                id="location"
                name="location"
                value={settings.location}
                onChange={handleChange}
                required
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6 space-y-4">
            <Label>Telefon raqamlar</Label>
            {settings.phonenumbers.map((phone, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  value={phone}
                  onChange={(e) => handlePhoneChange(index, e.target.value)}
                  placeholder="+998 XX XXX XX XX"
                  required={index === 0}
                />
                {settings.phonenumbers.length > 1 && (
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="icon"
                    onClick={() => removePhoneNumber(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              onClick={addPhoneNumber}
              className="mt-2"
            >
              <Plus className="h-4 w-4 mr-2" />
              Telefon qo&apos;shish
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="instagram">Instagram</Label>
              <Input
                id="instagram"
                name="socialMediaLinks.instagram"
                value={settings.socialMediaLinks?.instagram || ""}
                onChange={handleChange}
                placeholder="https://instagram.com/username"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="telegram">Telegram</Label>
              <Input
                id="telegram"
                name="socialMediaLinks.telegram"
                value={settings.socialMediaLinks?.telegram || ""}
                onChange={handleChange}
                placeholder="https://t.me/username"
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="logo">Logo URL</Label>
              <Input
                id="logo"
                name="logo"
                value={settings.logo || ""}
                onChange={handleChange}
                placeholder="https://example.com/logo.png"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="banner">Banner URL</Label>
              <Input
                id="banner"
                name="banner"
                value={settings.banner || ""}
                onChange={handleChange}
                placeholder="https://example.com/banner.jpg"
              />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-6 flex justify-end">
        <Button type="submit" disabled={saving}>
          {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Saqlash
        </Button>
      </div>
    </form>
  );
}