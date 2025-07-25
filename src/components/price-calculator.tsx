'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Calculator,
  DollarSign,
  Percent,
  Truck,
  Store,
  LayoutGrid,
  PlusCircle,
  TrendingUp,
  Wallet,
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

// Updated platform fees (approximations, should be verified)
const PLATFORM_FEES: { [key: string]: { [key: string]: number } } = {
  shopee: {
    'non-mall': 4.28, // Transaction Fee 2.14% + Program Fee ~2.14%
    mall: 7.49, // Commission Fee ~5.35% + Transaction Fee 2.14%
    electronics: 8.56, // Higher commission for electronics in Mall
    fashion: 7.49,
    'health-beauty': 7.49,
    other: 6.42,
  },
  lazada: {
    marketplace: 3.21, // Payment Fee 3.21%
    lazmall: 6.42, // LazMall Commission ~3.21% + Payment Fee 3.21%
    electronics: 8.56, // Higher commission for electronics in LazMall
    fashion: 6.42,
    'health-beauty': 6.42,
    other: 5.35,
  },
  tiktok: {
    all: 7.35, // Commission Fee 4% + Transaction Fee 3% + VAT
    electronics: 7.35,
    fashion: 7.35,
    'health-beauty': 7.35,
    other: 7.35,
  },
};


const formSchema = z.object({
  platform: z.string({ required_error: 'กรุณาเลือกแพลตฟอร์ม' }),
  cost: z.coerce.number().min(0.01, 'ราคาต้นทุนต้องมากกว่า 0'),
  category: z.string({ required_error: 'กรุณาเลือกหมวดหมู่สินค้า' }),
  otherCosts: z.coerce.number().min(0, 'ค่าใช้จ่ายอื่นต้องไม่ติดลบ').optional(),
  profitMargin: z.coerce.number().min(0, 'กำไรที่ต้องการต้องไม่ติดลบ'),
});

type FormValues = z.infer<typeof formSchema>;

type CalculationResult = {
  sellingPrice: number;
  platformFeeAmount: number;
  profit: number;
};

export default function PriceCalculator() {
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      platform: undefined,
      cost: undefined,
      category: undefined,
      otherCosts: 0,
      profitMargin: 20,
    },
  });

  const selectedPlatform = form.watch('platform');

  useEffect(() => {
    if (selectedPlatform && PLATFORM_FEES[selectedPlatform]) {
      setCategories(Object.keys(PLATFORM_FEES[selectedPlatform]));
      form.resetField('category');
    } else {
      setCategories([]);
    }
  }, [selectedPlatform, form]);

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setResult(null);

    const { cost, profitMargin, otherCosts = 0, platform, category } = values;
    const platformFeePercent = PLATFORM_FEES[platform][category];

    // Simulate a short delay for better user experience
    await new Promise((resolve) => setTimeout(resolve, 300));
    
    const totalCost = cost + otherCosts;
    const profitAmount = (cost * profitMargin) / 100;
    
    // Selling Price = (Total Cost + Desired Profit) / (1 - (Fee Percentage / 100))
    const sellingPrice = (totalCost + profitAmount) / (1 - (platformFeePercent / 100));
    const platformFeeAmount = sellingPrice * (platformFeePercent / 100);
    const finalProfit = sellingPrice - totalCost - platformFeeAmount;

    setResult({
      sellingPrice: sellingPrice,
      platformFeeAmount: platformFeeAmount,
      profit: finalProfit,
    });
    setIsLoading(false);
  }

  const getCategoryLabel = (categoryKey: string) => {
    switch (categoryKey) {
      case 'electronics': return 'อิเล็กทรอนิกส์';
      case 'fashion': return 'แฟชั่น';
      case 'health-beauty': return 'สุขภาพและความงาม';
      case 'non-mall': return 'ร้านค้าทั่วไป (Non-Mall)';
      case 'mall': return 'ร้านค้าทางการ (Mall)';
      case 'marketplace': return 'ร้านค้าทั่วไป (Marketplace)';
      case 'lazmall': return 'ร้านค้าทางการ (LazMall)';
      case 'all': return 'สินค้าทุกหมวดหมู่';
      case 'other': return 'อื่นๆ';
      default: return categoryKey;
    }
  }

  return (
    <div className="w-full max-w-4xl">
      <Card className="w-full shadow-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary text-primary-foreground rounded-full w-16 h-16 flex items-center justify-center mb-4">
            <Calculator className="w-8 h-8" />
          </div>
          <CardTitle className="font-headline text-3xl">คำนวณราคาขาย</CardTitle>
          <CardDescription>
            คำนวณราคาขายสินค้าของคุณเพื่อให้แน่ใจว่าได้กำไรตามที่ต้องการ
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* 1. Platform Selection */}
                <FormField
                  control={form.control}
                  name="platform"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>แพลตฟอร์ม</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                {/* 2. Cost Price */}
                <FormField
                  control={form.control}
                  name="cost"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ราคาต้นทุน</FormLabel>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <FormControl>
                          <Input type="number" placeholder="100" className="pl-10" {...field} />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* 3. Category Selection */}
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>หมวดหมู่สินค้า/ประเภท</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value} disabled={!selectedPlatform}>
                        <FormControl>
                          <SelectTrigger>
                            <LayoutGrid className="inline-block h-4 w-4 mr-2 text-muted-foreground" />
                            <SelectValue placeholder="เลือกหมวดหมู่/ประเภท" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                              {getCategoryLabel(cat)} (ค่าธรรมเนียม ~{PLATFORM_FEES[selectedPlatform]?.[cat]}%)
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* 4. Other Costs */}
                 <FormField
                  control={form.control}
                  name="otherCosts"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ค่าใช้จ่ายอื่นๆ (ถ้ามี)</FormLabel>
                      <div className="relative">
                        <PlusCircle className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <FormControl>
                          <Input type="number" placeholder="0" className="pl-10" {...field} />
                        </FormControl>
                      </div>
                      <FormDescription>เช่น ค่าแพ็คของ, ค่าเดินทาง</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* 5. Desired Profit Margin */}
                <FormField
                  control={form.control}
                  name="profitMargin"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>กำไรที่ต้องการ (เปอร์เซ็นต์จากต้นทุน)</FormLabel>
                      <div className="relative">
                        <Percent className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <FormControl>
                          <Input type="number" placeholder="20" className="pl-10" {...field} />
                        </FormControl>
                      </div>
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
              </div>
            ) : (
              result && (
                <>
                  <div className="text-center p-6 bg-secondary rounded-lg">
                    <p className="text-sm font-medium text-muted-foreground">ราคาที่ควรตั้งขาย</p>
                    <p className="text-5xl font-bold text-primary tracking-tight mt-2">
                      {result.sellingPrice.toFixed(2)}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
                    <div className="p-4 bg-muted/50 rounded-lg">
                       <p className="text-sm font-medium text-muted-foreground flex items-center justify-center gap-2"><TrendingUp />ค่าธรรมเนียมแพลตฟอร์ม</p>
                       <p className="text-2xl font-semibold text-foreground mt-1">{result.platformFeeAmount.toFixed(2)}</p>
                    </div>
                     <div className="p-4 bg-muted/50 rounded-lg">
                       <p className="text-sm font-medium text-muted-foreground flex items-center justify-center gap-2"><Wallet />กำไรที่จะได้รับ</p>
                       <p className="text-2xl font-semibold text-green-600 mt-1">{result.profit.toFixed(2)}</p>
                    </div>
                  </div>
                </>
              )
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
