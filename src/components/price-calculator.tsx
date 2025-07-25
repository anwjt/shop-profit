
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
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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


// Platform fees for NON-MALL sellers (approximations, should be verified)
const PLATFORM_FEES: { [key: string]: { [key: string]: { name: string, fee: number, orderFee?: number } } } = {
  shopee: {
    'electronics': { name: 'สินค้าอิเล็กทรอนิกส์', fee: 5.35 },
    'fashion': { name: 'สินค้าแฟชั่น', fee: 6.42 },
    'fmcg': { name: 'สินค้าอุปโภคบริโภค (FMCG)', fee: 6.42 },
    'lifestyle': { name: 'สินค้าไลฟ์สไตล์', fee: 6.42 },
    'other': { name: 'หมวดหมู่อื่นๆ', fee: 5.35 },
  },
  lazada: {
    'electronics': { name: 'สินค้าอิเล็กทรอนิกส์', fee: 4.28 },
    'fashion': { name: 'สินค้าแฟชั่น', fee: 6.42 },
    'general': { name: 'สินค้าทั่วไป', fee: 5.35 },
  },
  tiktok: {
    'fashion': { name: 'สินค้าแฟชั่น', fee: 6.42, orderFee: 3.21 },
    'electronics': { name: 'สินค้าอิเล็กทรอนิกส์', fee: 5.35, orderFee: 3.21 },
    'lifestyle': { name: 'สินค้าไลฟ์สไตล์', fee: 5.35, orderFee: 3.21 },
  },
};

const formSchema = z.object({
  platform: z.string({ required_error: 'กรุณาเลือกแพลตฟอร์ม' }).min(1, 'กรุณาเลือกแพลตฟอร์ม'),
  cost: z.coerce.number().min(0.01, 'ราคาต้นทุนต้องมากกว่า 0'),
  category: z.string({ required_error: 'กรุณาเลือกหมวดหมู่สินค้า' }).min(1, 'กรุณาเลือกหมวดหมู่สินค้า'),
  otherCosts: z.array(z.object({
    name: z.string().optional(),
    value: z.coerce.number().min(0, 'ค่าใช้จ่ายต้องไม่ติดลบ'),
  })).optional(),
  profitMargin: z.coerce.number().min(0, 'กำไรที่ต้องการต้องไม่ติดลบ'),
  discount: z.coerce.number().min(0, 'ส่วนลดต้องไม่ติดลบ').optional(),
  affiliateCommission: z.coerce.number().min(0, 'ค่าคอมมิชชั่นต้องไม่ติดลบ').optional(),
});

type FormValues = z.infer<typeof formSchema>;

type CalculationResult = {
  sellingPrice: number;
  platformFeeAmount: number;
  profit: number;
  commissionAmount: number;
  orderFeeAmount: number;
  affiliateCommissionAmount: number;
  otherCosts: number;
  platform: string;
};

export default function PriceCalculator() {
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      platform: '',
      cost: undefined,
      category: '',
      otherCosts: [],
      profitMargin: 0,
      discount: 0,
      affiliateCommission: 0,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "otherCosts",
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

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setResult(null);

    await new Promise((resolve) => setTimeout(resolve, 300));

    const { cost, profitMargin, otherCosts = [], platform, category, discount = 0, affiliateCommission = 0 } = values;
    
    if (!platform || !category || !PLATFORM_FEES[platform] || !PLATFORM_FEES[platform][category]) {
        console.error("Invalid platform or category selected");
        setIsLoading(false);
        return;
    }

    const platformCategoryData = PLATFORM_FEES[platform][category];
    const commissionPercent = platformCategoryData.fee;
    const orderFeePercent = platformCategoryData.orderFee || 0;

    const totalOtherCosts = otherCosts.reduce((sum, current) => sum + (current.value || 0), 0);
    const totalCost = cost + totalOtherCosts;
    const profitAmount = (cost * profitMargin) / 100;
    
    // Formula: Selling Price = (Total Cost + Desired Profit + Discount) / (1 - Total Fee Percentage - Affiliate Commission %)
    const totalFeePercentage = (commissionPercent / 100) + (orderFeePercent / 100) + (affiliateCommission / 100);
    const sellingPrice = (totalCost + profitAmount + discount) / (1 - totalFeePercentage);

    // For calculation and display purposes, the "price" the fee is based on is the selling price minus the seller's discount
    const priceForFeeCalculation = sellingPrice - discount;
    const commissionAmount = priceForFeeCalculation * (commissionPercent / 100);

    // TikTok order fee is on the final selling price after discount
    const orderFeeAmount = priceForFeeCalculation * (orderFeePercent / 100);
    const totalPlatformFee = commissionAmount + orderFeeAmount;
    
    const affiliateCommissionAmount = sellingPrice * (affiliateCommission / 100);

    const finalProfit = sellingPrice - cost - totalOtherCosts - discount - totalPlatformFee - affiliateCommissionAmount;

    const newResult: CalculationResult = {
      sellingPrice: sellingPrice,
      platformFeeAmount: totalPlatformFee,
      profit: finalProfit,
      commissionAmount: commissionAmount,
      orderFeeAmount: orderFeeAmount,
      affiliateCommissionAmount,
      otherCosts: totalOtherCosts,
      platform: platform
    };
    setResult(newResult);
    setIsLoading(false);
  }

  const getCategoryLabel = (platform: string, categoryKey: string) => {
    return PLATFORM_FEES[platform]?.[categoryKey]?.name || categoryKey;
  }

  return (
    <div className="w-full max-w-4xl">
      <Card className="w-full shadow-2xl">
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
                            const feeLabel = platformCategory.orderFee
                               ? `~${platformCategory.fee}% + ${platformCategory.orderFee}%`
                               : `~${platformCategory.fee}%`;
                            return (
                              <SelectItem key={cat} value={cat}>
                                {platformCategory.name} (ค่าธรรมเนียม {feeLabel})
                              </SelectItem>
                            )
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
                          <Input type="number" placeholder="100" className="pl-8" {...field} onChange={e => field.onChange(e.target.value === '' ? undefined : +e.target.value)} />
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
                          <Input type="number" placeholder="0" className="pl-10" {...field} onChange={e => field.onChange(e.target.value === '' ? 0 : +e.target.value)} />
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
                        <FormField
                            control={form.control}
                            name={`otherCosts.${index}.name`}
                            render={({ field }) => (
                              <FormItem className="flex-grow">
                                <FormControl>
                                    <Input type="text" placeholder="เช่น ค่าแพ็คของ" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        <FormField
                          control={form.control}
                          name={`otherCosts.${index}.value`}
                          render={({ field }) => (
                            <FormItem>
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">฿</span>
                                <FormControl>
                                  <Input type="number" placeholder="0" className="pl-8 w-32" {...field} onChange={e => field.onChange(e.target.value === '' ? 0 : +e.target.value)} />
                                </FormControl>
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                          <XCircle className="h-5 w-5 text-destructive" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={() => append({ name: '', value: 0 })}
                    >
                      <PlusCircle className="mr-2 h-4 w-4" />
                      เพิ่มรายการค่าใช้จ่าย
                    </Button>
                  </div>
                   <FormField
                    control={form.control}
                    name="discount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>6. ส่วนลด (บาท)</FormLabel>
                        <div className="relative">
                          <BadgePercent className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                          <FormControl>
                            <Input type="number" placeholder="0" className="pl-10" {...field} onChange={e => field.onChange(e.target.value === '' ? 0 : +e.target.value)} />
                          </FormControl>
                        </div>
                        <FormDescription>
                          ส่วนลดนี้จะถูกบวกเข้าไปในราคาขายเพื่อรักษากำไร
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="affiliateCommission"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>7. ค่าคอม Affiliate (%)</FormLabel>
                        <div className="relative">
                          <Handshake className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                          <FormControl>
                            <Input type="number" placeholder="0" className="pl-10" {...field} onChange={e => field.onChange(e.target.value === '' ? 0 : +e.target.value)} />
                          </FormControl>
                        </div>
                        <FormDescription>
                          ค่าคอมมิชชั่นที่จะบวกเพิ่มเข้าไปในราคาขาย
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
              </div>
              <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90" disabled={isLoading}>
                {isLoading ? 'กำลังคำนวณ...' : 'คำนวณราคา'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {(isLoading || result) && (
        <Card className="mt-8 w-full shadow-2xl">
          <CardHeader>
            <CardTitle className="font-headline text-2xl text-center">ผลการคำนวณ</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading && !result ? (
              <div className="space-y-4">
                 <Skeleton className="h-24 w-full" />
                 <Skeleton className="h-8 w-3/4 mx-auto" />
                 <Skeleton className="h-8 w-3/4 mx-auto" />
                 <Skeleton className="h-8 w-3/4 mx-auto" />
              </div>
            ) : (
              result && (
                <>
                  <div className="text-center p-6 bg-secondary rounded-lg">
                    <p className="text-sm font-medium text-muted-foreground">ราคาที่ควรตั้งขาย (ก่อนใช้ส่วนลด)</p>
                    <p className="text-5xl font-bold text-primary tracking-tight mt-2">
                      {result.sellingPrice.toFixed(2)}
                    </p>
                  </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-muted/50 rounded-lg">
                       <p className="text-sm font-medium text-muted-foreground flex items-center justify-center gap-2 mb-2"><TrendingUp />ค่าธรรมเนียมแพลตฟอร์มรวม</p>
                        <p className="text-2xl font-semibold text-foreground text-center">{result.platformFeeAmount.toFixed(2)}</p>
                         <div className="text-xs text-muted-foreground mt-2 space-y-1 text-center">
                            <p>ค่าคอมมิชชั่น: {result.commissionAmount.toFixed(2)}</p>
                            {result.orderFeeAmount > 0 && (
                                <p>ค่าธรรมเนียมคำสั่งซื้อ: {result.orderFeeAmount.toFixed(2)}</p>
                            )}
                        </div>
                    </div>
                     <div className="p-4 bg-muted/50 rounded-lg">
                       <p className="text-sm font-medium text-muted-foreground flex items-center justify-center gap-2"><Wallet />กำไรที่จะได้รับ (โดยประมาณ)</p>
                       <p className="text-2xl font-semibold text-green-600 mt-1 text-center">{result.profit.toFixed(2)}</p>
                    </div>
                  </div>
                  {(result.otherCosts > 0 || result.affiliateCommissionAmount > 0) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {result.otherCosts > 0 && (
                         <div className="p-4 bg-muted/50 rounded-lg">
                           <p className="text-sm font-medium text-muted-foreground flex items-center justify-center gap-2"><Package />ค่าใช้จ่ายอื่นๆ รวม</p>
                           <p className="text-2xl font-semibold text-foreground mt-1 text-center">{result.otherCosts.toFixed(2)}</p>
                        </div>
                      )}
                      {result.affiliateCommissionAmount > 0 && (
                         <div className={`p-4 bg-muted/50 rounded-lg ${result.otherCosts <= 0 ? 'md:col-span-2' : ''}`}>
                           <p className="text-sm font-medium text-muted-foreground flex items-center justify-center gap-2"><Handshake />ค่าคอม Affiliate</p>
                           <p className="text-2xl font-semibold text-foreground mt-1 text-center">{result.affiliateCommissionAmount.toFixed(2)}</p>
                        </div>
                      )}
                    </div>
                  )}

                  <Alert variant="default" className="mt-4">
                      <Info className="h-4 w-4" />
                      <AlertTitle>ข้อควรทราบ</AlertTitle>
                      <AlertDescription>
                          ราคานี้เป็นการคำนวณเบื้องต้น อาจมีการเปลี่ยนแปลงจากค่าธรรมเนียมส่งเสริมการขาย, ค่าขนส่ง, หรือส่วนลดอื่นๆ ของแพลตฟอร์ม
                      </AlertDescription>
                  </Alert>
                </>
              )
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

    