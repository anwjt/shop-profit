
'use client';

import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Calculator,
  Percent,
  TrendingUp,
  Wallet,
  Store,
  LayoutGrid,
  Info,
  Package,
  PlusCircle,
  XCircle,
  BadgePercent,
  Handshake,
  CreditCard,
  Sparkles,
  BookMarked,
  RotateCcw,
  History,
  Table,
  Settings,
} from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PLATFORM_FEES, calculatePrice, type CalculationResult, type CalculationInput, formatPrice, getPsychologicalPrice, getPlatformCategories } from '@/lib/price-calculation';
import { SettingsPanel } from './settings-panel';


const formSchema = z.object({
  platform: z.string({ required_error: 'กรุณาเลือกแพลตฟอร์ม' }).min(1, 'กรุณาเลือกแพลตฟอร์ม'),
  cost: z.coerce.number().min(0.01, 'ราคาต้นทุนต้องมากกว่า 0'),
  category: z.string({ required_error: 'กรุณาเลือกหมวดหมู่สินค้า' }).min(1, 'กรุณาเลือกหมวดหมู่สินค้า'),
  otherCosts: z.array(z.object({
    name: z.string().optional(),
    value: z.coerce.number().min(0, 'ค่าใช้จ่ายต้องไม่ติดลบ'),
  })).optional(),
  profitMargin: z.coerce.number().min(0, 'กำไรที่ต้องการต้องไม่ติดลบ').optional(),
  discount: z.coerce.number().min(0, 'ส่วนลดต้องไม่ติดลบ').optional(),
  affiliateCommission: z.coerce.number().min(0, 'ค่าคอมมิชชั่นต้องไม่ติดลบ').optional(),
});

type FormValues = z.infer<typeof formSchema>;

export type { CalculationResult };


interface PriceCalculatorProps {
  isStandalone?: boolean;
}

export default function PriceCalculator({ isStandalone = true }: PriceCalculatorProps) {
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isBreakEvenMode, setIsBreakEvenMode] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      platform: '',
      cost: undefined,
      category: '',
      otherCosts: [],
      profitMargin: undefined,
      discount: undefined,
      affiliateCommission: undefined,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control, name: "otherCosts",
  });

  const selectedPlatform = form.watch('platform');
  const allCategories = getPlatformCategories();
  const platformCategories = selectedPlatform ? allCategories[selectedPlatform] || [] : [];

  useEffect(() => {
    form.setValue('category', '');
  }, [selectedPlatform, form]);


  const saveToHistory = (resultToSave: CalculationResult) => {
    if (!isStandalone) return;
    try {
      const historyKey = 'calculationHistory';
      const historyDataString = localStorage.getItem(historyKey);
      const today = new Date().toISOString();
      // Omitting platform-specific prices for a cleaner history object
      const { shopeeCreditCardPrice, shopeeSPayLaterPrice, ...rest } = resultToSave;
      const newEntry = { ...rest, date: today };


      if (historyDataString) {
        const historyData = JSON.parse(historyDataString);
        historyData.entries.unshift(newEntry);
        historyData.entries = historyData.entries.slice(0, 50); // Limit entries
        localStorage.setItem(historyKey, JSON.stringify(historyData));
      } else {
        // First time saving
        const newHistoryData = {
          firstDate: today,
          entries: [newEntry]
        };
        localStorage.setItem(historyKey, JSON.stringify(newHistoryData));
      }
    } catch (error) {
      console.error("Failed to save to localStorage", error);
    }
  };

  const handleModeChange = (value: string) => {
    setIsBreakEvenMode(value === 'breakeven');
    setResult(null); // Clear result when switching modes
  };

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setResult(null);
    setIsBreakEvenMode(false);
    await new Promise((resolve) => setTimeout(resolve, 300));

    let finalValues: CalculationInput = { ...values };
    if (isBreakEvenMode) {
      finalValues = {
        ...values,
        profitMargin: 0,
        profitAmount: 0,
        discount: 0,
        otherCosts: [],
        affiliateCommission: 0
      };
    }

    const newResult = calculatePrice(finalValues);

    if (newResult) {
      setResult(newResult);
      saveToHistory(newResult);
    }

    setIsLoading(false);
  }



  const handleClear = () => {
    setIsBreakEvenMode(false);
    form.reset({
      platform: '',
      cost: undefined,
      category: '',
      otherCosts: [],
      profitMargin: undefined,
      discount: undefined,
      affiliateCommission: undefined
    });
    setResult(null);
  };

  const cardContent = (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">


          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="platform"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>1. เลือกแพลตฟอร์ม</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <Store className="inline-block h-4 w-4 mr-2 text-muted-foreground" />
                        <SelectValue placeholder="เลือกแพลตฟอร์ม" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="shopee">Shopee</SelectItem>
                      <SelectItem value="lazada">Lazada</SelectItem>
                      <SelectItem value="tiktok shop">TikTok Shop</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>2. หมวดหมู่สินค้า</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} disabled={!selectedPlatform}>
                    <FormControl>
                      <SelectTrigger>
                        <LayoutGrid className="inline-block h-4 w-4 mr-2 text-muted-foreground" />
                        <SelectValue placeholder={selectedPlatform ? "เลือกหมวดหมู่" : "กรุณาเลือกแพลตฟอร์มก่อน"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {platformCategories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cost"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>3. ต้นทุนสินค้า (บาท)</FormLabel>
                  <div className="relative">
                    <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="0.00" className="pl-10" {...field} value={field.value ?? ''} onChange={e => field.onChange(e.target.value === '' ? undefined : +e.target.value)} />
                    </FormControl>
                  </div>
                  <FormDescription>ต้นทุนต่อชิ้น (รวมค่าส่งมาที่เราแล้ว)</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {!isBreakEvenMode && (
            <div className="space-y-6 mt-6 pt-6 border-t animate-in fade-in slide-in-from-top-4 duration-300">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField control={form.control} name="profitMargin" render={({ field }) => (<FormItem><FormLabel>4. กำไรที่ต้องการ (บาท)</FormLabel><div className="relative"><TrendingUp className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" /><FormControl><Input type="number" placeholder="กรอกกำไรที่ต้องการ" className="pl-10" {...field} value={field.value ?? ''} onChange={e => field.onChange(e.target.value === '' ? undefined : +e.target.value)} /></FormControl></div><FormDescription>กำไรสุทธิที่ต้องการต่อชิ้น</FormDescription><FormMessage /></FormItem>)} />
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <FormLabel className="text-base font-semibold">5. ค่าใช้จ่ายอื่นๆ (ต่อชิ้น)</FormLabel>
                  </div>
                  <div className="space-y-2">
                    {fields.map((field, index) => (
                      <div key={field.id} className="flex gap-2 items-start animate-in fade-in slide-in-from-left-2">
                        <FormField control={form.control} name={`otherCosts.${index}.name`} render={({ field }) => (<FormItem className="flex-1"><FormControl><Input placeholder="ชื่อค่าใช้จ่าย (เช่น ค่าแพ็ค)" {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name={`otherCosts.${index}.value`} render={({ field }) => (<FormItem className="w-24"><FormControl><Input type="number" placeholder="บาท" {...field} value={field.value ?? ''} onChange={e => field.onChange(e.target.value === '' ? undefined : +e.target.value)} /></FormControl><FormMessage /></FormItem>)} />
                        <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} className="text-destructive hover:text-destructive/90"><XCircle className="h-4 w-4" /></Button>
                      </div>
                    ))}
                    <Button type="button" variant="outline" className="w-full" onClick={() => append({ name: '', value: 0 })}><PlusCircle className="mr-2 h-4 w-4" />เพิ่มรายการค่าใช้จ่าย</Button>
                  </div>
                </div>
                <FormField control={form.control} name="discount" render={({ field }) => (<FormItem><FormLabel>6. ส่วนลดร้านค้า (บาท)</FormLabel><div className="relative"><BadgePercent className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" /><FormControl><Input type="number" placeholder="กรอกส่วนลด" className="pl-10" {...field} value={field.value ?? ''} onChange={e => field.onChange(e.target.value === '' ? undefined : +e.target.value)} /></FormControl></div><FormDescription>ส่วนลดที่ร้านค้าเป็นผู้รับผิดชอบทั้งหมด (เช่น คูปองส่วนลดที่ร้านสร้างเอง)</FormDescription><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="affiliateCommission" render={({ field }) => (<FormItem><FormLabel>7. ค่าคอม Affiliate (%)</FormLabel><div className="relative"><Handshake className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" /><FormControl><Input type="number" placeholder="กรอกค่าคอมมิชชั่น" className="pl-10" {...field} value={field.value ?? ''} onChange={e => field.onChange(e.target.value === '' ? undefined : +e.target.value)} /></FormControl></div><FormDescription>ค่าคอมมิชชั่นที่จะบวกเพิ่มเข้าไปในราคาขาย</FormDescription><FormMessage /></FormItem>)} />
              </div>
            </div>
          )}



          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button type="button" variant="outline" className="w-full" onClick={handleClear} disabled={!form.formState.isDirty && !result}>
              <RotateCcw className="mr-2 h-4 w-4" />
              ล้างข้อมูล
            </Button>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'กำลังคำนวณ...' : (isBreakEvenMode ? 'คำนวณราคาเท่าทุน' : 'คำนวณราคาขาย')}
            </Button>
          </div>
        </form>
      </Form>
    </>
  )


  const resultDisplay = (
    <>
      {isLoading && (
        <Card className="mt-8 w-full shadow-lg">
          <CardHeader><CardTitle className="font-headline text-2xl text-center">ผลการคำนวณ</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <Skeleton className="h-24 w-full" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      {result && !isLoading && (
        <div className="space-y-4">
          <Card className="w-full shadow-lg">
            <CardHeader><CardTitle className="font-headline text-2xl text-center">{isBreakEvenMode ? 'ราคาขายเท่าทุน (Break-even)' : 'ผลการคำนวณ'}</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className={`text-center p-6 rounded-lg ${isBreakEvenMode ? 'bg-orange-50 border-2 border-orange-200' : 'bg-muted'}`}>
                <p className="text-sm font-medium text-muted-foreground">{isBreakEvenMode ? 'ราคาขั้นต่ำที่ต้องขาย (เพื่อให้ได้ทุนคืน)' : 'ราคาที่ควรตั้งขาย (ก่อนใช้ส่วนลด)'}</p>
                <p className="text-5xl font-bold text-primary tracking-tight mt-1">
                  ≈ ฿{getPsychologicalPrice(result.sellingPrice).toLocaleString('en-US')}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  (คำนวณจริง: ฿{formatPrice(result.sellingPrice)})
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-muted rounded-lg"><p className="text-sm font-medium text-muted-foreground flex items-center justify-center gap-2 mb-2"><TrendingUp />ค่าธรรมเนียมแพลตฟอร์มรวม</p><p className="text-2xl font-semibold text-foreground text-center">฿{formatPrice(result.platformFeeAmount)}</p><div className="text-xs text-muted-foreground mt-2 space-y-1 text-center"><p>ค่าคอมมิชชั่น + ธุรกรรม (3.21%): {result.commissionPercent.toFixed(2)}% (+VAT) = {result.commissionAmount.toFixed(2)}</p>{result.orderFeeAmount > 0 && (<p>ค่าธรรมเนียมคำสั่งซื้อ: {result.orderFeePercent.toFixed(2)}% = {result.orderFeeAmount.toFixed(2)}</p>)}{result.paymentFeeAmount > 0 && (<p>ค่าธรรมเนียมการชำระเงิน: {result.paymentFeePercent.toFixed(2)}% = {result.paymentFeeAmount.toFixed(2)}</p>)}</div></div>
                <div className="p-4 bg-muted rounded-lg"><p className="text-sm font-medium text-muted-foreground flex items-center justify-center gap-2"><Wallet />กำไรที่จะได้รับ (โดยประมาณ)</p><p className="text-2xl font-semibold text-green-600 mt-1 text-center">฿{formatPrice(result.profit)}</p></div>
              </div>
              {(result.otherCosts > 0 || result.affiliateCommissionAmount > 0) && (<div className="grid grid-cols-1 md:grid-cols-2 gap-4">{result.otherCosts > 0 && (<div className="p-4 bg-muted rounded-lg"><p className="text-sm font-medium text-muted-foreground flex items-center justify-center gap-2"><Package />ค่าใช้จ่ายอื่นๆ รวม</p><p className="text-2xl font-semibold text-foreground mt-1 text-center">฿{result.otherCosts.toFixed(2)}</p></div>)}{result.affiliateCommissionAmount > 0 && (<div className={`p-4 bg-muted rounded-lg ${result.otherCosts <= 0 ? 'md:col-span-2' : ''}`}><p className="text-sm font-medium text-muted-foreground flex items-center justify-center gap-2"><Handshake />ค่าคอม Affiliate</p><p className="text-2xl font-semibold text-foreground mt-1 text-center">฿{formatPrice(result.affiliateCommissionAmount)}</p></div>)}</div>)}
              <Alert variant="default" className="mt-4"><Info className="h-4 w-4" /><AlertTitle>ข้อจำกัดความรับผิดชอบ</AlertTitle><AlertDescription>ราคาที่คำนวณได้เป็นเพียงการประมาณการจากข้อมูลพื้นฐาน และยังไม่รวมค่าใช้จ่ายหรือส่วนลดที่อาจเกิดขึ้นจากแคมเปญส่งเสริมการขายต่างๆ (เช่น ส่วนลดในเทศกาล, คูปองส่วนลดจากแพลตฟอร์ม) หรือค่าขนส่งพิเศษ โปรดตรวจสอบรายละเอียดของแคมเปญและค่าธรรมเนียมอื่นๆ เพิ่มเติมเพื่อให้ได้ราคาที่แม่นยำที่สุด</AlertDescription></Alert>
            </CardContent>
          </Card>

          {result.platform === 'shopee' && (
            <Card className="w-full shadow-lg">
              <CardHeader>
                <CardTitle className="font-headline text-2xl text-center flex items-center justify-center gap-2">
                  <Sparkles className="h-6 w-6 text-yellow-500" />ราคาแนะนำสำหรับช่องทางชำระเงินเพิ่มเติม (Shopee)
                </CardTitle>
                <CardDescription className="text-center">ราคาโดยประมาณเมื่อลูกค้าเลือกผ่อนชำระ (คำนวณจากอัตราสูงสุด)</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="text-center p-6 bg-muted rounded-lg">
                  <p className="text-sm font-medium text-muted-foreground flex items-center justify-center gap-2 mb-2"><CreditCard /> บัตรเครดิต (ผ่อนชำระ)</p>
                  <p className="text-4xl font-bold text-primary tracking-tight">≈ ฿{getPsychologicalPrice(result.shopeeCreditCardPrice).toLocaleString('en-US')}</p>
                  <p className="text-xs text-muted-foreground mt-1">(คำนวณจริง: ฿{formatPrice(result.shopeeCreditCardPrice)})</p>
                </div>
                <div className="text-center p-6 bg-muted rounded-lg">
                  <p className="text-sm font-medium text-muted-foreground flex items-center justify-center gap-2 mb-2"><Sparkles className="h-4 w-4" /> SPayLater</p>
                  <p className="text-4xl font-bold text-primary tracking-tight">≈ ฿{getPsychologicalPrice(result.shopeeSPayLaterPrice).toLocaleString('en-US')}</p>
                  <p className="text-xs text-muted-foreground mt-1">(คำนวณจริง: ฿{formatPrice(result.shopeeSPayLaterPrice)})</p>
                </div>
                <div className="md:col-span-2">
                  <Alert variant="default" className="mt-4 text-xs"><Info className="h-4 w-4" /><AlertTitle>ข้อควรทราบ</AlertTitle><AlertDescription>ราคาที่แสดงเป็นเพียง **การประมาณการ** โดยใช้อัตราค่าธรรมเนียมสูงสุด และยัง **ไม่รวมค่าขนส่ง** หรือ **ส่วนลดที่ Shopee รับผิดชอบ** ซึ่งอาจส่งผลให้ราคาจริงมีการเปลี่ยนแปลงได้</AlertDescription></Alert>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </>
  );

  if (!isStandalone) {
    return (
      <div className="w-full space-y-4">
        {cardContent}
        {resultDisplay}
      </div>
    )
  }

  return (
    <div className="w-full max-w-4xl space-y-4">
      <Card className="w-full shadow-lg relative overflow-hidden">
        {isStandalone && (
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/notion-table">
                <Table className="mr-2 h-4 w-4" />
                Notion Table
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href="/history">
                <History className="mr-2 h-4 w-4" />
                ประวัติ
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href="/docs">
                <BookMarked className="mr-2 h-4 w-4" />
                คู่มือ
              </Link>
            </Button>
            <SettingsPanel />
          </div>
        )}
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary text-primary-foreground rounded-full w-16 h-16 flex items-center justify-center mb-4">
            <Calculator className="w-8 h-8" />
          </div>
          <CardTitle className="font-headline text-3xl">คำนวณราคาขาย (สำหรับร้านค้าทั่วไป)</CardTitle>
          <CardDescription>
            คำนวณราคาขายสินค้าของคุณเพื่อให้แน่ใจว่าได้กำไรตามที่ต้องการ
          </CardDescription>
        </CardHeader>
        <CardContent>
          {cardContent}
        </CardContent>
      </Card>
      {resultDisplay}
    </div>
  );
}
