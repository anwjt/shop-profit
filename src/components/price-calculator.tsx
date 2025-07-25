
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


const PLATFORM_FEES: { [key: string]: { [key: string]: { name: string, fee: number, orderFee?: number, paymentFee?: number } } } = {
  shopee: {
    'electronics': { name: 'สินค้าอิเล็กทรอนิกส์', fee: 8.56 + (3*1.07) },
    'fashion': { name: 'สินค้าแฟชั่น', fee: 9.63 + (3*1.07) },
    'lifestyle': { name: 'สินค้าไลฟ์สไตล์', fee: 8.025 + (3*1.07) },
    'other': { name: 'สินค้าทั่วไป (นอกกลุ่มอิเล็กทรอนิกส์)', fee: 8.56 + (3*1.07) },
  },
  lazada: {
    'electronics': { name: 'สินค้าอิเล็กทรอนิกส์ (สูงสุด)', fee: 8.0 * 1.07, paymentFee: 3.0 * 1.07 },
    'general': { name: 'สินค้าทั่วไป (สูงสุด)', fee: 8.0 * 1.07, paymentFee: 3.0 * 1.07 },
    'fashion': { name: 'สินค้าแฟชั่น (สูงสุด)', fee: 9.0 * 1.07, paymentFee: 3.0 * 1.07 },
    'fmcg': { name: 'สินค้าอุปโภคบริโภค', fee: 8.0 * 1.07, paymentFee: 3.0 * 1.07 },
    'digital': { name: 'บัตรกำนัลดิจิทัล', fee: 7.0 * 1.07, paymentFee: 3.0 * 1.07 },
  },
  tiktok: {
    'fashion': { name: 'สินค้าแฟชั่น', fee: 6.42, orderFee: 3.21 },
    'electronics': { name: 'สินค้าอิเล็กทรอนิกส์', fee: 5.35, orderFee: 3.21 },
    'lifestyle': { name: 'สินค้าไลฟ์สไตล์', fee: 5.35, orderFee: 3.21 },
  },
};

const SHOPEE_EXTRA_FEES = {
  creditCard: 0.06 * 1.07,
  spayLater: 0.06 * 1.07,
};

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

export type CalculationResult = {
  sellingPrice: number;
  platformFeeAmount: number;
  profit: number;
  commissionAmount: number;
  orderFeeAmount: number;
  paymentFeeAmount: number;
  affiliateCommissionAmount: number;
  otherCosts: number;
  platform: string;
  commissionPercent: number;
  orderFeePercent: number;
  paymentFeePercent: number;
  priceForFeeCalculation: number;
  discount: number;
  shopeeCreditCardPrice?: number;
  shopeeSPayLaterPrice?: number;
  totalCost: number;
};

const formatPrice = (price: number | undefined) => {
    if (typeof price !== 'number') return '0.00';
    return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const getPsychologicalPrice = (price: number | undefined) => {
    if (typeof price !== 'number' || price <= 0) return 0;
    const roundedPrice = Math.floor(price);
    const lastDigit = roundedPrice % 10;

    if (lastDigit < 5) {
        return roundedPrice - lastDigit;
    } else {
        return roundedPrice - lastDigit + 9;
    }
}

export default function PriceCalculator() {
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      platform: '', cost: undefined, category: '',
      otherCosts: [], profitMargin: undefined, discount: undefined,
      affiliateCommission: undefined,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control, name: "otherCosts",
  });

  const selectedPlatform = form.watch('platform');

  useEffect(() => {
    form.setValue('category', '');
    if (selectedPlatform && PLATFORM_FEES[selectedPlatform]) {
      const availableCategories = Object.keys(PLATFORM_FEES[selectedPlatform]);
      setCategories(availableCategories);
    } else {
      setCategories([]);
    }
  }, [selectedPlatform, form]);


  const calculateSellingPrice = (baseCost: number, profitAmount: number, discount: number, feeRate: number): number => {
    const numerator = baseCost + profitAmount - (discount * feeRate) + discount;
    const denominator = 1 - feeRate;
    if (denominator <= 0) return 0;
    return numerator / denominator;
  }
  
  const saveToHistory = (resultToSave: CalculationResult) => {
    try {
        const currentHistoryString = localStorage.getItem('calculationHistory');
        const currentHistory = currentHistoryString ? JSON.parse(currentHistoryString) : [];
        const newEntry = { ...resultToSave, date: new Date().toISOString() };
        const updatedHistory = [newEntry, ...currentHistory].slice(0, 50); // Limit history to 50 entries
        localStorage.setItem('calculationHistory', JSON.stringify(updatedHistory));
    } catch (error) {
        console.error("Failed to save to localStorage", error);
    }
  };

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setResult(null);
    await new Promise((resolve) => setTimeout(resolve, 300));
    const { cost, profitMargin = 0, otherCosts = [], platform, category, discount = 0, affiliateCommission = 0 } = values;
    if (!platform || !category || !PLATFORM_FEES[platform] || !PLATFORM_FEES[platform][category]) {
        setIsLoading(false); return;
    }
    const platformCategoryData = PLATFORM_FEES[platform][category];
    const commissionPercent = platformCategoryData.fee;
    const orderFeePercent = platformCategoryData.orderFee || 0;
    const paymentFeePercent = platformCategoryData.paymentFee || 0;
    const totalOtherCosts = otherCosts.reduce((sum, current) => sum + (current.value || 0), 0);
    const totalCost = cost + totalOtherCosts;
    const profitAmount = (cost * profitMargin) / 100;
    let platformFeeRate = (platform === 'lazada')
        ? (commissionPercent / 100) + (paymentFeePercent / 100)
        : (commissionPercent / 100) + (orderFeePercent / 100);
    const affiliateRate = affiliateCommission / 100;
    const totalFeeRate = platformFeeRate + affiliateRate;
    const sellingPrice = calculateSellingPrice(totalCost, profitAmount, discount, totalFeeRate);
    if (sellingPrice === 0) { setIsLoading(false); return; }
    const priceForFeeCalculation = sellingPrice - discount;
    const commissionAmount = priceForFeeCalculation * (commissionPercent / 100);
    const orderFeeAmount = platform === 'tiktok' ? priceForFeeCalculation * (orderFeePercent / 100) : 0;
    const paymentFeeAmount = platform === 'lazada' ? priceForFeeCalculation * (paymentFeePercent / 100) : 0;
    let totalPlatformFee = (platform === 'lazada') ? commissionAmount + paymentFeeAmount : commissionAmount + orderFeeAmount;
    const affiliateCommissionAmount = sellingPrice * affiliateRate;
    const finalProfit = (sellingPrice - discount) - totalCost - totalPlatformFee - affiliateCommissionAmount;
    let shopeePrices: { shopeeCreditCardPrice?: number, shopeeSPayLaterPrice?: number } = {};
    if (platform === 'shopee') {
      const baseCommission = PLATFORM_FEES[platform][category].fee - (3*1.07);
      const baseFeeRate = (baseCommission / 100) + affiliateRate;
      const creditCardFeeRate = baseFeeRate + SHOPEE_EXTRA_FEES.creditCard;
      const spayLaterFeeRate = baseFeeRate + SHOPEE_EXTRA_FEES.spayLater;
      shopeePrices.shopeeCreditCardPrice = calculateSellingPrice(totalCost, profitAmount, discount, creditCardFeeRate);
      shopeePrices.shopeeSPayLaterPrice = calculateSellingPrice(totalCost, profitAmount, discount, spayLaterFeeRate);
    }
    const newResult: CalculationResult = {
      sellingPrice, platformFeeAmount: totalPlatformFee, profit: finalProfit, commissionAmount,
      orderFeeAmount, paymentFeeAmount, affiliateCommissionAmount, otherCosts: totalOtherCosts,
      platform, commissionPercent, orderFeePercent, paymentFeePercent, priceForFeeCalculation,
      discount, totalCost, ...shopeePrices,
    };
    setResult(newResult);
    saveToHistory(newResult);
    setIsLoading(false);
  }

  const handleClear = () => {
    form.reset();
    setResult(null);
  };

  return (
    <div className="w-full max-w-4xl space-y-4">
      <Card className="w-full shadow-lg bg-card/70 backdrop-blur-sm border-white/20 relative">
        <div className="absolute top-4 right-4 flex items-center gap-2">
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
        </div>
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
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Form Fields... */}
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
                          <SelectItem value="tiktok">TikTok Shop</SelectItem>
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
                       <FormLabel>2. ประเภท/หมวดหมู่</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value} disabled={!selectedPlatform}>
                        <FormControl>
                          <SelectTrigger>
                             <LayoutGrid className="inline-block h-4 w-4 mr-2 text-muted-foreground" />
                            <SelectValue placeholder="เลือกหมวดหมู่สินค้า" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                           {categories.map((cat) => {
                            if (!selectedPlatform) return null;
                            const platformCategory = PLATFORM_FEES[selectedPlatform]?.[cat];
                            if (!platformCategory) return null;
                            let feeLabel = `~${platformCategory.fee.toFixed(2)}%`;
                            if (selectedPlatform === 'shopee') feeLabel = `${feeLabel} (รวม VAT และค่าธุรกรรม)`;
                            else if (selectedPlatform === 'lazada') feeLabel = `~${platformCategory.fee.toFixed(2)}% + 3.21% (รวม VAT)`;
                            else if (platformCategory.orderFee) feeLabel = `~${platformCategory.fee.toFixed(2)}% + ${platformCategory.orderFee.toFixed(2)}%`
                            return (<SelectItem key={cat} value={cat}>{platformCategory.name} (ค่าธรรมเนียม {feeLabel})</SelectItem>)
                          })}
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
                      <FormLabel>3. ราคาต้นทุน</FormLabel>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">฿</span>
                        <FormControl>
                          <Input type="number" placeholder="กรอกราคาต้นทุน" className="pl-8" {...field} value={field.value ?? ''} onChange={e => field.onChange(e.target.value === '' ? undefined : +e.target.value)} />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="profitMargin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>4. กำไรที่ต้องการ (%)</FormLabel>
                      <div className="relative">
                        <Percent className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <FormControl>
                          <Input type="number" placeholder="กรอกกำไรที่ต้องการ" className="pl-10" {...field} value={field.value ?? ''} onChange={e => field.onChange(e.target.value === '' ? undefined : +e.target.value)} />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <div className="md:col-span-2 space-y-4">
                    <FormLabel>5. ค่าใช้จ่ายอื่นๆ (ถ้ามี)</FormLabel>
                    {fields.map((field, index) => (
                      <div key={field.id} className="flex items-center gap-2">
                        <FormField control={form.control} name={`otherCosts.${index}.name`} render={({ field }) => (<FormItem className="flex-grow"><FormControl><Input type="text" placeholder="เช่น ค่าแพ็คของ" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name={`otherCosts.${index}.value`} render={({ field }) => (<FormItem><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">฿</span><FormControl><Input type="number" placeholder="0" className="pl-8 w-32" {...field} value={field.value ?? ''} onChange={e => field.onChange(e.target.value === '' ? undefined : +e.target.value)} /></FormControl></div><FormMessage /></FormItem>)} />
                        <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}><XCircle className="h-5 w-5 text-destructive" /></Button>
                      </div>
                    ))}
                    <Button type="button" variant="outline" className="w-full" onClick={() => append({ name: '', value: undefined })}><PlusCircle className="mr-2 h-4 w-4" />เพิ่มรายการค่าใช้จ่าย</Button>
                  </div>
                   <FormField control={form.control} name="discount" render={({ field }) => (<FormItem><FormLabel>6. ส่วนลดร้านค้า (บาท)</FormLabel><div className="relative"><BadgePercent className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" /><FormControl><Input type="number" placeholder="กรอกส่วนลด" className="pl-10" {...field} value={field.value ?? ''} onChange={e => field.onChange(e.target.value === '' ? undefined : +e.target.value)} /></FormControl></div><FormDescription>ส่วนลดที่ร้านค้าเป็นผู้รับผิดชอบทั้งหมด (เช่น คูปองส่วนลดที่ร้านสร้างเอง)</FormDescription><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="affiliateCommission" render={({ field }) => (<FormItem><FormLabel>7. ค่าคอม Affiliate (%)</FormLabel><div className="relative"><Handshake className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" /><FormControl><Input type="number" placeholder="กรอกค่าคอมมิชชั่น" className="pl-10" {...field} value={field.value ?? ''} onChange={e => field.onChange(e.target.value === '' ? undefined : +e.target.value)} /></FormControl></div><FormDescription>ค่าคอมมิชชั่นที่จะบวกเพิ่มเข้าไปในราคาขาย</FormDescription><FormMessage /></FormItem>)} />
              </div>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button type="button" variant="outline" className="w-full" onClick={handleClear} disabled={!result && !isLoading}>
                    <RotateCcw className="mr-2 h-4 w-4" />
                    ล้างข้อมูล
                </Button>
                <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90" disabled={isLoading}>
                  {isLoading ? 'กำลังคำนวณ...' : 'คำนวณราคา'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {(isLoading || result) && (
        <Card className="mt-8 w-full shadow-lg bg-card/70 backdrop-blur-sm border-white/20">
          <CardHeader><CardTitle className="font-headline text-2xl text-center">ผลการคำนวณ</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {isLoading && !result ? (
              <div className="space-y-4"><Skeleton className="h-24 w-full" /><Skeleton className="h-8 w-3/4 mx-auto" /><Skeleton className="h-8 w-3/4 mx-auto" /><Skeleton className="h-8 w-3/4 mx-auto" /></div>
            ) : (
              result && (
                <>
                  <div className="text-center p-6 bg-muted/50 rounded-lg">
                    <p className="text-sm font-medium text-muted-foreground">ราคาที่ควรตั้งขาย (ก่อนใช้ส่วนลด)</p>
                    <p className="text-5xl font-bold text-primary tracking-tight mt-1">
                        ≈ ฿{getPsychologicalPrice(result.sellingPrice).toLocaleString('en-US')}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                        (คำนวณจริง: ฿{formatPrice(result.sellingPrice)})
                    </p>
                  </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-muted/50 rounded-lg"><p className="text-sm font-medium text-muted-foreground flex items-center justify-center gap-2 mb-2"><TrendingUp />ค่าธรรมเนียมแพลตฟอร์มรวม</p><p className="text-2xl font-semibold text-foreground text-center">฿{formatPrice(result.platformFeeAmount)}</p><div className="text-xs text-muted-foreground mt-2 space-y-1 text-center"><p>ค่าคอมมิชชั่น: {result.commissionPercent.toFixed(2)}% of ({result.priceForFeeCalculation.toFixed(2)}) = {result.commissionAmount.toFixed(2)}</p>{result.orderFeeAmount > 0 && (<p>ค่าธรรมเนียมคำสั่งซื้อ: {result.orderFeePercent.toFixed(2)}% of ({result.priceForFeeCalculation.toFixed(2)}) = {result.orderFeeAmount.toFixed(2)}</p>)}{result.paymentFeeAmount > 0 && (<p>ค่าธรรมเนียมการชำระเงิน: {result.paymentFeePercent.toFixed(2)}% of ({result.priceForFeeCalculation.toFixed(2)}) = {result.paymentFeeAmount.toFixed(2)}</p>)}</div></div>
                     <div className="p-4 bg-muted/50 rounded-lg"><p className="text-sm font-medium text-muted-foreground flex items-center justify-center gap-2"><Wallet />กำไรที่จะได้รับ (โดยประมาณ)</p><p className="text-2xl font-semibold text-green-600 mt-1 text-center">฿{formatPrice(result.profit)}</p></div>
                  </div>
                  {(result.otherCosts > 0 || result.affiliateCommissionAmount > 0) && (<div className="grid grid-cols-1 md:grid-cols-2 gap-4">{result.otherCosts > 0 && (<div className="p-4 bg-muted/50 rounded-lg"><p className="text-sm font-medium text-muted-foreground flex items-center justify-center gap-2"><Package />ค่าใช้จ่ายอื่นๆ รวม</p><p className="text-2xl font-semibold text-foreground mt-1 text-center">฿{result.otherCosts.toFixed(2)}</p></div>)}{result.affiliateCommissionAmount > 0 && (<div className={`p-4 bg-muted/50 rounded-lg ${result.otherCosts <= 0 ? 'md:col-span-2' : ''}`}><p className="text-sm font-medium text-muted-foreground flex items-center justify-center gap-2"><Handshake />ค่าคอม Affiliate</p><p className="text-2xl font-semibold text-foreground mt-1 text-center">฿{formatPrice(result.affiliateCommissionAmount)}</p></div>)}</div>)}
                  <Alert variant="default" className="mt-4 bg-muted/50 border-transparent"><Info className="h-4 w-4" /><AlertTitle>ข้อควรทราบ</AlertTitle><AlertDescription>ราคานี้เป็นการคำนวณเบื้องต้น อาจมีการเปลี่ยนแปลงจากค่าธรรมเนียมส่งเสริมการขาย, ค่าขนส่ง, หรือส่วนลดอื่นๆ ของแพลตฟอร์ม</AlertDescription></Alert>
                </>
              )
            )}
          </CardContent>
        </Card>
      )}

      {result && result.platform === 'shopee' && (<Card className="mt-8 w-full shadow-lg bg-card/70 backdrop-blur-sm border-white/20"><CardHeader><CardTitle className="font-headline text-2xl text-center flex items-center justify-center gap-2"><Sparkles className="h-6 w-6 text-yellow-500" />ราคาแนะนำสำหรับช่องทางชำระเงินเพิ่มเติม (Shopee)</CardTitle><CardDescription className="text-center">ราคาโดยประมาณเมื่อลูกค้าเลือกผ่อนชำระ (คำนวณจากอัตราสูงสุด)</CardDescription></CardHeader><CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4"><div className="text-center p-6 bg-muted/50 rounded-lg"><p className="text-sm font-medium text-muted-foreground flex items-center justify-center gap-2 mb-2"><CreditCard /> บัตรเครดิต (ผ่อนชำระ)</p><p className="text-4xl font-bold text-primary tracking-tight">≈ ฿{getPsychologicalPrice(result.shopeeCreditCardPrice).toLocaleString('en-US')}</p><p className="text-xs text-muted-foreground mt-1">(คำนวณจริง: ฿{formatPrice(result.shopeeCreditCardPrice)})</p></div><div className="text-center p-6 bg-muted/50 rounded-lg"><p className="text-sm font-medium text-muted-foreground flex items-center justify-center gap-2 mb-2"><Sparkles className="h-4 w-4" /> SPayLater</p><p className="text-4xl font-bold text-primary tracking-tight">≈ ฿{getPsychologicalPrice(result.shopeeSPayLaterPrice).toLocaleString('en-US')}</p><p className="text-xs text-muted-foreground mt-1">(คำนวณจริง: ฿{formatPrice(result.shopeeSPayLaterPrice)})</p></div><div className="md:col-span-2"><Alert variant="default" className="mt-4 bg-muted/50 border-transparent text-xs"><Info className="h-4 w-4" /><AlertTitle>ข้อควรทราบ</AlertTitle><AlertDescription>ราคาที่แสดงเป็นเพียง **การประมาณการ** โดยใช้อัตราค่าธรรมเนียมสูงสุด และยัง **ไม่รวมค่าขนส่ง** หรือ **ส่วนลดที่ Shopee รับผิดชอบ** ซึ่งอาจส่งผลให้ราคาจริงมีการเปลี่ยนแปลงได้</AlertDescription></Alert></div></CardContent></Card>)}
    </div>
  );
}
