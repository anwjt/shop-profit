
'use client';

import { Moon, Sun, Settings, Font, Check } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { cn } from '@/lib/utils';

export function SettingsPanel() {
  const { theme, setTheme, font, setFont } = useTheme();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <Settings className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Toggle settings</span>
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>ตั้งค่าการแสดงผล</SheetTitle>
        </SheetHeader>
        <div className="grid gap-6 py-4">
          <div className="space-y-3">
            <Label>ธีมสี</Label>
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant={theme === 'light' ? 'default' : 'outline'}
                onClick={() => setTheme('light')}
              >
                <Sun className="mr-2 h-4 w-4" />
                สว่าง
              </Button>
              <Button
                variant={theme === 'dark' ? 'default' : 'outline'}
                onClick={() => setTheme('dark')}
              >
                <Moon className="mr-2 h-4 w-4" />
                มืด
              </Button>
            </div>
          </div>
          <div className="space-y-3">
            <Label>รูปแบบตัวอักษร (Font)</Label>
            <RadioGroup
              value={font}
              onValueChange={setFont}
              className="grid grid-cols-1 gap-4"
            >
              <div>
                <RadioGroupItem value="sarabun" id="font-sarabun" className="sr-only" />
                <Label
                  htmlFor="font-sarabun"
                  className={cn(
                    'flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground',
                    font === 'sarabun' && 'border-primary'
                  )}
                >
                  <Check className={cn("mb-3 h-6 w-6", font === 'sarabun' ? 'opacity-100' : 'opacity-0')} />
                  <span style={{ fontFamily: 'var(--font-sarabun)' }}>Sarabun (สารบรรณ)</span>
                </Label>
              </div>
              <div>
                <RadioGroupItem value="kanit" id="font-kanit" className="sr-only" />
                <Label
                  htmlFor="font-kanit"
                   className={cn(
                    'flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground',
                    font === 'kanit' && 'border-primary'
                  )}
                >
                   <Check className={cn("mb-3 h-6 w-6", font === 'kanit' ? 'opacity-100' : 'opacity-0')} />
                  <span style={{ fontFamily: 'var(--font-kanit)' }}>Kanit (คณิต)</span>
                </Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
