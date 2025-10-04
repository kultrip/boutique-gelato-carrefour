import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { t } from '@/lib/i18n';
import { toast } from 'sonner';
import Layout from '@/components/Layout';
import { useAuth } from '@/hooks/useAuth';

interface ShopSettings {
  id: string;
  shop_name: string;
  address: string | null;
  phone: string | null;
  printer_ip: string | null;
  printer_name: string | null;
}

const Settings = () => {
  const { profile } = useAuth();
  const [settings, setSettings] = useState<ShopSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const isAdminOrStaff = ['admin', 'staff'].includes(profile?.role);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    const { data, error } = await supabase
      .from('shop_settings')
      .select('*')
      .single();

    if (error) {
      toast.error('Error loading settings');
    } else {
      setSettings(data);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAdmin) {
      toast.error('Only admins can update settings');
      return;
    }

    if (!settings) return;

    setSaving(true);

    const { error } = await supabase
      .from('shop_settings')
      .update({
        shop_name: settings.shop_name,
        address: settings.address,
        phone: settings.phone,
        printer_ip: settings.printer_ip,
        printer_name: settings.printer_name,
      })
      .eq('id', settings.id);

    if (error) {
      toast.error('Error saving settings');
    } else {
      toast.success('Settings saved successfully');
    }

    setSaving(false);
  };

  const updateField = (field: keyof ShopSettings, value: string) => {
    if (settings) {
      setSettings({ ...settings, [field]: value });
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-12">{t('common.loading')}</div>
      </Layout>
    );
  }

  if (!settings) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-destructive">Error loading settings</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h2 className="text-3xl font-bold">{t('settings.title')}</h2>
          <p className="text-muted-foreground mt-1">
            {isAdmin ? 'Configure your shop information' : 'View shop information (admin only can edit)'}
          </p>
        </div>

        <Card className="card-shadow">
          <CardHeader>
            <CardTitle>Shop Information</CardTitle>
            <CardDescription>
              This information will appear on printed receipts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="shopName">{t('settings.shopName')}</Label>
                <Input
                  id="shopName"
                  value={settings.shop_name}
                  onChange={(e) => updateField('shop_name', e.target.value)}
                  disabled={!isAdmin}
                  required
                  className="touch-target"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">{t('settings.address')}</Label>
                <Input
                  id="address"
                  value={settings.address || ''}
                  onChange={(e) => updateField('address', e.target.value)}
                  disabled={!isAdmin}
                  className="touch-target"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">{t('settings.phone')}</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={settings.phone || ''}
                  onChange={(e) => updateField('phone', e.target.value)}
                  disabled={!isAdmin}
                  className="touch-target"
                />
              </div>

              <div className="border-t pt-4 space-y-4">
                <h3 className="font-semibold">Printer Settings</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="printerIP">{t('settings.printerIP')}</Label>
                  <Input
                    id="printerIP"
                    value={settings.printer_ip || ''}
                    onChange={(e) => updateField('printer_ip', e.target.value)}
                    disabled={!isAdmin}
                    placeholder="192.168.1.100"
                    className="touch-target"
                  />
                  <p className="text-sm text-muted-foreground">
                    Optional: IP address of your WiFi printer
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="printerName">{t('settings.printerName')}</Label>
                  <Input
                    id="printerName"
                    value={settings.printer_name || ''}
                    onChange={(e) => updateField('printer_name', e.target.value)}
                    disabled={!isAdmin}
                    placeholder="Receipt Printer"
                    className="touch-target"
                  />
                  <p className="text-sm text-muted-foreground">
                    Optional: Name of your printer
                  </p>
                </div>
              </div>

              {isAdmin && (
                <Button
                  type="submit"
                  disabled={saving}
                  className="w-full touch-target"
                >
                  {saving ? t('common.loading') : t('common.save')}
                </Button>
              )}
            </form>
          </CardContent>
        </Card>

        <Card className="card-shadow bg-muted/50">
          <CardHeader>
            <CardTitle>About Printing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>
              This system uses the browser's print functionality to generate receipts.
            </p>
            <p>
              For best results, configure your printer settings to:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Use portrait orientation</li>
              <li>Set paper size to receipt width (typically 80mm)</li>
              <li>Remove headers and footers</li>
              <li>Enable background graphics</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Settings;
