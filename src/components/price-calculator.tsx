'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Calculator,
  DollarSign,
  Percent,
  Truck,
  Store,
  Lightbulb,
  Sparkles,
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
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { getPsychologicalPriceSuggestion } from '@/app/actions';
import type { SuggestPsychologicalPriceOutput } from '@/ai/flows/suggest-pricing';

const PLATFORM_FEES: { [key: string]: number } = {
  shopee: 7.5,
  lazada: 5.5,
  tiktok: 6.0,
};

const formSchema = z
  .object({
    cost: z.coerce.number().min(0.01, 'Cost must be greater than 0.'),
    profitMargin: z.coerce
      .number()
      .min(0, 'Profit margin cannot be negative.'),
    shippingCost: z.coerce
      .number()
      .min(0, 'Shipping cost cannot be negative.'),
    platform: z.string({ required_error: 'Please select a platform.' }),
    customFee: z.coerce.number().optional(),
  })
  .refine(
    (data) => {
      if (data.platform === 'custom') {
        return (
          data.customFee !== undefined &&
          data.customFee >= 0 &&
          data.customFee < 100
        );
      }
      return true;
    },
    {
      message: 'Custom fee must be a number between 0 and 99.99.',
      path: ['customFee'],
    }
  );

type FormValues = z.infer<typeof formSchema>;

export default function PriceCalculator() {
  const { toast } = useToast();
  const [result, setResult] = useState<{ calculatedPrice: number } | null>(null);
  const [aiSuggestion, setAiSuggestion] = useState<SuggestPsychologicalPriceOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cost: undefined,
      profitMargin: 20,
      shippingCost: 0,
      platform: 'shopee',
      customFee: undefined,
    },
  });

  const selectedPlatform = form.watch('platform');

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setResult(null);
    setAiSuggestion(null);

    const { cost, profitMargin, shippingCost, platform, customFee } = values;
    const platformFee =
      platform === 'custom' ? customFee! : PLATFORM_FEES[platform];

    if (platformFee >= 100) {
      toast({
        variant: 'destructive',
        title: 'Invalid Fee',
        description: 'Platform fee must be less than 100%.',
      });
      setIsLoading(false);
      return;
    }

    const price =
      (cost * (1 + profitMargin / 100) + shippingCost) / (1 - platformFee / 100);

    setResult({ calculatedPrice: price });

    const aiResponse = await getPsychologicalPriceSuggestion(price);

    if ('error' in aiResponse) {
      toast({
        variant: 'destructive',
        title: 'AI Suggestion Error',
        description: aiResponse.error,
      });
      setAiSuggestion(null);
    } else {
      setAiSuggestion(aiResponse);
    }

    setIsLoading(false);
  }

  return (
    <div className="w-full max-w-4xl">
      <Card className="w-full shadow-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary text-primary-foreground rounded-full w-16 h-16 flex items-center justify-center mb-4">
            <Calculator className="w-8 h-8" />
          </div>
          <CardTitle className="font-headline text-3xl">Shop Profit Calc</CardTitle>
          <CardDescription>
            Calculate your product&apos;s selling price to ensure you make a profit.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="cost"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cost Price</FormLabel>
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
                <FormField
                  control={form.control}
                  name="profitMargin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Desired Profit Margin</FormLabel>
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
                <FormField
                  control={form.control}
                  name="shippingCost"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Shipping Cost</FormLabel>
                      <div className="relative">
                        <Truck className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <FormControl>
                          <Input type="number" placeholder="0" className="pl-10" {...field} />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="platform"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Platform</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <Store className="inline-block h-4 w-4 mr-2 text-muted-foreground" />
                              <SelectValue placeholder="Select a platform" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="shopee">Shopee</SelectItem>
                            <SelectItem value="lazada">Lazada</SelectItem>
                            <SelectItem value="tiktok">TikTok Shop</SelectItem>
                            <SelectItem value="custom">Custom</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {selectedPlatform === 'custom' && (
                    <FormField
                      control={form.control}
                      name="customFee"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Custom Fee (%)</FormLabel>
                          <div className="relative">
                            <Percent className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <FormControl>
                              <Input type="number" placeholder="5.5" className="pl-10" {...field} />
                            </FormControl>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              </div>
              <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90" disabled={isLoading}>
                {isLoading ? 'Calculating...' : 'Calculate Price'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {(isLoading || result) && (
        <Card className="mt-8 w-full shadow-2xl">
          <CardHeader>
            <CardTitle className="font-headline text-2xl text-center">Your Selling Price</CardTitle>
          </CardHeader>
          <CardContent>
              <div className="text-center p-6 bg-secondary rounded-lg">
                <p className="text-sm font-medium text-muted-foreground">You should sell your product at:</p>
                {isLoading && !result ? (
                  <Skeleton className="h-16 w-64 mx-auto mt-2" />
                ) : (
                  result && (
                    <p className="text-6xl font-bold text-primary tracking-tight mt-2">
                      {result.calculatedPrice.toFixed(2)}
                    </p>
                  )
                )}
              </div>

              {(isLoading || aiSuggestion) && <Separator className="my-8" />}

              {isLoading && !aiSuggestion ? (
                 <div className="text-center">
                    <Skeleton className="h-8 w-48 mx-auto" />
                    <Skeleton className="h-6 w-full mt-4" />
                    <Skeleton className="h-6 w-3/4 mt-2 mx-auto" />
                 </div>
              ) : (
                aiSuggestion && (
                  <div className="text-center">
                    <h3 className="text-xl font-headline flex items-center justify-center gap-2">
                      <Sparkles className="h-6 w-6 text-accent" />
                      AI-Powered Pricing Suggestion
                    </h3>
                    <p className="text-muted-foreground mt-2 mb-4 max-w-2xl mx-auto">{aiSuggestion.reasoning}</p>
                    <div className="inline-block p-4 border-2 border-dashed border-accent rounded-lg">
                      <p className="text-sm font-medium text-muted-foreground">Suggested Price:</p>
                      <p className="text-4xl font-bold text-accent tracking-tight">
                        {aiSuggestion.suggestedPrice.toFixed(2)}
                      </p>
                    </div>
                  </div>
                )
              )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
