import { Button } from "@/components/ui/button";
import { getLanguage, setLanguage } from "@/lib/i18n";
import { useState } from "react";

const LanguageSwitcher = () => {
  const [currentLang, setCurrentLang] = useState(getLanguage());

  const handleLanguageChange = (lang: 'en' | 'es' | 'pt') => {
    setLanguage(lang);
    setCurrentLang(lang);
    window.location.reload(); // Reload to apply language change
  };

  return (
    <div className="flex gap-2">
      <Button
        variant={currentLang === 'en' ? 'default' : 'outline'}
        size="sm"
        onClick={() => handleLanguageChange('en')}
        className="touch-target"
      >
        EN
      </Button>
      <Button
        variant={currentLang === 'es' ? 'default' : 'outline'}
        size="sm"
        onClick={() => handleLanguageChange('es')}
        className="touch-target"
      >
        ES
      </Button>
      <Button
        variant={currentLang === 'pt' ? 'default' : 'outline'}
        size="sm"
        onClick={() => handleLanguageChange('pt')}
        className="touch-target"
      >
        PT
      </Button>
    </div>
  );
};

export default LanguageSwitcher;
