import React from 'react';
import { Monitor, Moon, Sun } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';

const Header = () => {
  const { language, toggleLanguage, t } = useLanguage();
  const { theme, setTheme, resolvedTheme } = useTheme();

  const displayTheme = theme === 'system' ? resolvedTheme : theme;

  const themeLabels = {
    light: t('lightMode'),
    dark: t('darkMode'),
    system: t('systemMode'),
  };

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex-1">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
          {t('title')}
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          {t('subtitle')}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={toggleLanguage}
          className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
          title={language === 'en' ? 'Switch to French' : "Passer a l'anglais"}
        >
          <span className="font-semibold text-gray-700 dark:text-gray-200">
            {language === 'en' ? 'FR' : 'EN'}
          </span>
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="icon"
              variant="outline"
              aria-label={themeLabels[theme]}
              title={themeLabels[theme]}
            >
              {displayTheme === 'light' && (
                <Sun size={16} strokeWidth={2} aria-hidden="true" />
              )}
              {displayTheme === 'dark' && (
                <Moon size={16} strokeWidth={2} aria-hidden="true" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-36">
            <DropdownMenuItem
              onClick={() => setTheme('light')}
              className={theme === 'light' ? 'font-semibold text-primary' : ''}
            >
              <Sun size={16} strokeWidth={2} className="opacity-60" aria-hidden="true" />
              <span>{t('lightMode')}</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setTheme('dark')}
              className={theme === 'dark' ? 'font-semibold text-primary' : ''}
            >
              <Moon size={16} strokeWidth={2} className="opacity-60" aria-hidden="true" />
              <span>{t('darkMode')}</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setTheme('system')}
              className={theme === 'system' ? 'font-semibold text-primary' : ''}
            >
              <Monitor size={16} strokeWidth={2} className="opacity-60" aria-hidden="true" />
              <span>{t('systemMode')}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default Header;
