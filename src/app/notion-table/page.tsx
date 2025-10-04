
'use client';

import { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table as UiTable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ArrowLeft, Table, Info, LoaderCircle, ServerCrash, PlusCircle, MoreHorizontal, Trash2, Edit, Calculator, TrendingUp, Wallet, Package, Sparkles, CreditCard, ShoppingCart, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useToast } from "@/hooks/use-toast";
import { PLATFORM_FEES, calculatePrice, type CalculationResult, getPlatformCategories, formatPrice, getPsychologicalPrice } from '@/lib/price-calculation';

export type StockItem = {
  id: string;
  name:string;
  sku: string;
  price: number;
  status: 'ขายแล้ว' | 'รอขาย';
  platform: string;
  category: string;
};

const stockItemSchema = z.object({
    name: z.string().min(1, 'ชื่อสินค้าห้ามว่าง'),
    sku: z.string().min(1, 'SKU ห้ามว่าง'),
    price: z.coerce.number().min(0, 'ราคาต้องเป็นตัวเลขไม่ติดลบ'),
    status: z.enum(['ขายแล้ว', 'รอขาย']),
    platform: z.string().min(1, "กรุณาเลือกแพลตฟอร์ม"),
    category: z.string().min(1, "กรุณาเลือกหมวดหมู่"),
});

type StockItemFormData = z.infer<typeof stockItemSchema>;

const getStatusVariant = (status: StockItem['status']) => {
  switch (status) {
    case 'ขายแล้ว':
      return 'default';
    case 'รอขาย':
      return 'secondary';
    default:
      return 'outline';
  }
};

const platformCategories = getPlatformCategories();

const ResultDisplay = ({ item }: { item: StockItem | null }) => {
    const [noProfit, setNoProfit] = useState(false);
    const [editProfit, setEditProfit] = useState(false);
    const [customProfit, setCustomProfit] = useState(20);

    const calculationResult = useMemo(() => {
        if (!item) return null;

        let profitValue: { profitMargin?: number; profitAmount?: number } = { profitMargin: 20 };

        if (noProfit) {
            profitValue = { profitMargin: 0 };
        } else if (editProfit) {
            profitValue = { profitMargin: customProfit };
        }

        return calculatePrice({
            platform: item.platform.toLowerCase(),
            category: item.category,
            cost: item.price,
            ...profitValue,
        });
    }, [item, noProfit, editProfit, customProfit]);

    const handleNoProfitChange = (checked: boolean) => {
        setNoProfit(checked);
        if (checked) {
            setEditProfit(false);
        }
    };

    const handleEditProfitChange = (checked: boolean) => {
        setEditProfit(checked);
        if (checked) {
            setNoProfit(false);
        }
    };

    return (
        <DialogContent className="max-w-2xl">
            <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                    <Calculator /> {`ผลคำนวณสำหรับ "${item?.name}"`}
                </DialogTitle>
                <DialogDescription>
                    ผลการคำนวณราคาขายสำหรับสินค้าชิ้นนี้บนแพลตฟอร์มที่เลือก
                </DialogDescription>
            </DialogHeader>
            {calculationResult ? (
                <div className="py-4 max-h-[70vh] overflow-y-auto pr-4 space-y-4">
                    <Card>
                        <CardContent className="p-4 space-y-4">
                           <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-2">
                                    <Checkbox id="noProfit" checked={noProfit} onCheckedChange={handleNoProfitChange} />
                                    <Label htmlFor="noProfit" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                        ไม่ต้องคำนวณกำไร
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                     <Checkbox id="editProfit" checked={editProfit} onCheckedChange={handleEditProfitChange} />
                                    <Label htmlFor="editProfit" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                        แก้ไขกำไร (%)
                                    </Label>
                                </div>
                            </div>
                            {editProfit && (
                                <div className="relative">
                                    <Input
                                        type="number"
                                        value={customProfit}
                                        onChange={(e) => setCustomProfit(Number(e.target.value))}
                                        className="pl-8"
                                    />
                                     <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">%</span>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <div className="text-center p-6 bg-muted rounded-lg">
                        <p className="text-sm font-medium text-muted-foreground">ราคาที่ควรตั้งขาย</p>
                        <p className="text-5xl font-bold text-primary tracking-tight mt-1">
                            ≈ ฿{getPsychologicalPrice(calculationResult.sellingPrice).toLocaleString('en-US')}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                            (คำนวณจริง: ฿{formatPrice(calculationResult.sellingPrice)})
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-muted rounded-lg">
                            <p className="text-sm font-medium text-muted-foreground flex items-center justify-center gap-2 mb-2">
                                <TrendingUp />ค่าธรรมเนียมแพลตฟอร์มรวม
                            </p>
                            <p className="text-2xl font-semibold text-foreground text-center">฿{formatPrice(calculationResult.platformFeeAmount)}</p>
                        </div>
                        <div className="p-4 bg-muted rounded-lg">
                            <p className="text-sm font-medium text-muted-foreground flex items-center justify-center gap-2">
                                <Wallet />กำไรที่จะได้รับ
                            </p>
                            <p className={`text-2xl font-semibold mt-1 text-center ${calculationResult.profit > 0 ? 'text-green-600' : 'text-foreground'}`}>
                                ฿{formatPrice(calculationResult.profit)}
                            </p>
                        </div>
                    </div>
                    {calculationResult.platform === 'shopee' && (
                        <Card className="w-full">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Sparkles className="h-5 w-5 text-yellow-500" />ราคาแนะนำ (ผ่อนชำระ)
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                                <div className="text-center p-4 bg-muted rounded-lg">
                                    <p className="text-sm font-medium text-muted-foreground flex items-center justify-center gap-2 mb-2"><CreditCard /> บัตรเครดิต</p>
                                    <p className="text-2xl font-bold text-primary tracking-tight">≈ ฿{getPsychologicalPrice(calculationResult.shopeeCreditCardPrice).toLocaleString('en-US')}</p>
                                </div>
                                <div className="text-center p-4 bg-muted rounded-lg">
                                    <p className="text-sm font-medium text-muted-foreground flex items-center justify-center gap-2 mb-2"><Sparkles className="h-4 w-4" /> SPayLater</p>
                                    <p className="text-2xl font-bold text-primary tracking-tight">≈ ฿{getPsychologicalPrice(calculationResult.shopeeSPayLaterPrice).toLocaleString('en-US')}</p>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            ) : (
                <div className="py-4">
                    <Alert variant="destructive">
                        <Info className="h-4 w-4" />
                        <AlertTitle>ไม่สามารถคำนวณได้</AlertTitle>
                        <AlertDescription>
                            โปรดตรวจสอบว่าสินค้ามีหมวดหมู่ที่ถูกต้องสำหรับแพลตฟอร์มนี้
                        </AlertDescription>
                    </Alert>
                </div>
            )}
        </DialogContent>
    );
};

export default function NotionTablePage() {
  const [data, setData] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<StockItem | null>(null);
  const [resultItem, setResultItem] = useState<StockItem | null>(null);
  const { toast } = useToast();

  const { register, handleSubmit, reset, setValue, control, watch, formState: { errors } } = useForm<StockItemFormData>({
    resolver: zodResolver(stockItemSchema),
    defaultValues: {
        status: 'รอขาย',
        platform: 'Shopee',
        category: 'other',
    }
  });

  const selectedPlatformForForm = watch('platform');
  
  useEffect(() => {
    fetchData();
  }, []);
  
  useEffect(() => {
    if(selectedPlatformForForm) {
        setValue('category', '');
    }
  }, [selectedPlatformForForm, setValue]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/notion');
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      setData(result);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenForm = (item: StockItem | null = null) => {
    setEditingItem(item);
    if (item) {
        reset({
            name: item.name,
            sku: item.sku,
            price: item.price,
            status: item.status,
            platform: item.platform,
            category: item.category,
        });
    } else {
        reset({ name: '', sku: '', price: 0, status: 'รอขาย', platform: 'Shopee', category: '' });
    }
    setIsFormOpen(true);
  };

  const handleOpenResult = (item: StockItem) => {
    setResultItem(item);
  };

  const handleFormSubmit = async (formData: StockItemFormData) => {
    const url = '/api/notion';
    const method = editingItem ? 'PATCH' : 'POST';
    const body = JSON.stringify(editingItem ? { ...formData, id: editingItem.id } : formData);

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Operation failed');
      }

      const result: StockItem = await response.json();

      if (editingItem) {
        setData(data.map(item => (item.id === result.id ? result : item)));
        toast({ title: "✅ อัปเดตสำเร็จ", description: `สินค้า "${result.name}" ถูกแก้ไขแล้ว` });
      } else {
        setData([result, ...data].sort((a, b) => a.name.localeCompare(b.name)));
        toast({ title: "✅ เพิ่มสินค้าสำเร็จ", description: `"${result.name}" ถูกเพิ่มในรายการแล้ว` });
      }

      setIsFormOpen(false);
    } catch (e: any) {
      toast({ variant: "destructive", title: "เกิดข้อผิดพลาด", description: e.message });
    }
  };

  const updateItemStatus = async (item: StockItem, newStatus: StockItem['status']) => {
    try {
        const response = await fetch('/api/notion', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: item.id, status: newStatus }),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Status update failed');
        }
        const updatedItem = await response.json();
        setData(data.map(d => d.id === item.id ? updatedItem : d));
        toast({ title: "อัปเดตสถานะสำเร็จ", description: `สถานะของ "${item.name}" ถูกเปลี่ยนเป็น "${newStatus}"` });
    } catch (e: any) {
        toast({ variant: "destructive", title: "เกิดข้อผิดพลาด", description: e.message });
    }
  }

  const handleDelete = async (itemId: string) => {
    try {
        const response = await fetch('/api/notion', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: itemId }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to delete');
        }

        setData(data.filter(item => item.id !== itemId));
        toast({ title: "🗑️ ลบสำเร็จ", description: "สินค้าถูกลบออกจากรายการแล้ว" });

    } catch(e: any) {
        toast({ variant: "destructive", title: "เกิดข้อผิดพลาด", description: e.message });
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
             <div key={i} className="flex items-center space-x-4 p-4">
                <div className="w-28"><Skeleton className="h-6 w-full" /></div>
                <div className="space-y-2 flex-grow">
                    <Skeleton className="h-4 w-3/4" />
                </div>
                <Skeleton className="h-6 w-24 rounded-full" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-20" />
            </div>
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <Alert variant="destructive">
          <ServerCrash className="h-4 w-4" />
          <AlertTitle>เกิดข้อผิดพลาดในการเชื่อมต่อกับ Notion</AlertTitle>
          <AlertDescription>
            <p>ไม่สามารถดึงข้อมูลได้ โปรดตรวจสอบการตั้งค่าและลองใหม่อีกครั้ง:</p>
            <ul className="list-disc list-inside mt-2 text-xs">
              <li>ตรวจสอบว่า `NOTION_API_KEY` และ `NOTION_DATABASE_ID` ในไฟล์ `.env.local` ถูกต้อง</li>
              <li>ตรวจสอบว่า Integration ของคุณได้ถูกเชิญให้เข้าถึง Database ใน Notion และได้รับสิทธิ์ในการ "Read", "Update", และ "Insert"</li>
              <li>ตรวจสอบว่าชื่อและประเภทของคอลัมน์ (Property) ใน Notion ตรงกับที่กำหนดใน `src/app/api/notion/route.ts`</li>
              <li><span className="font-mono bg-destructive-foreground/20 p-1 rounded">Error: {error}</span></li>
            </ul>
          </AlertDescription>
        </Alert>
      );
    }

    if (data.length === 0 && !loading) {
        return (
             <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>ไม่พบข้อมูล</AlertTitle>
                <AlertDescription>
                    ไม่พบข้อมูลสินค้าในฐานข้อมูล Notion หรือฐานข้อมูลอาจจะว่างเปล่า ลองเพิ่มสินค้าชิ้นแรกของคุณดูสิ
                </AlertDescription>
            </Alert>
        )
    }

    return (
      <div className="overflow-x-auto rounded-lg border">
        <UiTable>
          <TableHeader>
            <TableRow>
              <TableHead>ชื่อสินค้า</TableHead>
              <TableHead>แพลตฟอร์ม</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead className="text-right">ต้นทุน (บาท)</TableHead>
              <TableHead className="text-center">สถานะ</TableHead>
              <TableHead className="text-right w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>
                    <Button variant="outline" size="sm" onClick={() => handleOpenResult(item)} disabled={!item.platform || !item.category}>
                        <Calculator className="mr-2 h-3 w-3" />
                        {item.platform}
                    </Button>
                </TableCell>
                <TableCell>{item.sku}</TableCell>
                <TableCell className="text-right font-bold">{item.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                <TableCell className="text-center">
                    {item.status === 'รอขาย' ? (
                        <Button variant="secondary" size="sm" onClick={() => updateItemStatus(item, 'ขายแล้ว')}>
                           <ShoppingCart className="mr-2 h-4 w-4" /> ขายแล้ว
                        </Button>
                    ) : (
                       <Badge variant="default" className="bg-green-600 hover:bg-green-700">
                         <CheckCircle className="mr-2 h-4 w-4" />
                         ขายแล้ว
                       </Badge>
                    )}
                </TableCell>
                <TableCell className="text-right">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleOpenForm(item)}>
                                <Edit className="mr-2 h-4 w-4" />
                                <span>แก้ไข</span>
                            </DropdownMenuItem>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                        <Trash2 className="mr-2 h-4 w-4 text-destructive" />
                                        <span className='text-destructive'>ลบ</span>
                                    </DropdownMenuItem>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                    <AlertDialogTitle>คุณแน่ใจหรือไม่?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        การกระทำนี้ไม่สามารถย้อนกลับได้ สินค้าจะถูกลบ (เก็บในถังขยะ) ออกจากฐานข้อมูล Notion ของคุณ
                                    </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                    <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDelete(item.id)} className='bg-destructive hover:bg-destructive/90'>ยืนยันการลบ</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </UiTable>
      </div>
    );
  }

  return (
    <>
      <main className="flex min-h-screen w-full flex-col items-center bg-background p-4 sm:p-8">
        <div className="w-full max-w-5xl space-y-6">
          <Card className="w-full shadow-lg">
            <CardHeader className="text-center">
              <div className="mx-auto bg-primary text-primary-foreground rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <Table className="w-8 h-8" />
              </div>
              <CardTitle className="font-headline text-3xl">
                ตารางสต็อกสินค้า (จาก Notion)
              </CardTitle>
              <CardDescription>
                ข้อมูลสต็อกสินค้าที่ดึงมาจากฐานข้อมูลใน Notion ของคุณแบบ Real-time
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-end">
                <Button onClick={() => handleOpenForm()}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    เพิ่มสินค้าใหม่
                </Button>
              </div>

              {renderContent()}

              <div className="text-center pt-4">
                <Button asChild>
                    <Link href="/">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      กลับไปหน้าหลัก
                    </Link>
                  </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[425px]">
            <form onSubmit={handleSubmit(handleFormSubmit)}>
                <DialogHeader>
                    <DialogTitle>{editingItem ? 'แก้ไขสินค้า' : 'เพิ่มสินค้าใหม่'}</DialogTitle>
                    <DialogDescription>
                        {editingItem ? 'แก้ไขรายละเอียดสินค้าด้านล่าง' : 'กรอกรายละเอียดสินค้าใหม่เพื่อเพิ่มในฐานข้อมูล'}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">ชื่อสินค้า</Label>
                        <div className="col-span-3">
                            <Input id="name" {...register('name')} className={errors.name ? 'border-destructive' : ''} />
                            {errors.name && <p className="text-xs text-destructive mt-1">{errors.name.message}</p>}
                        </div>
                    </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="platform" className="text-right">แพลตฟอร์ม</Label>
                        <div className="col-span-3">
                            <Select onValueChange={(value) => setValue('platform', value)} defaultValue={editingItem?.platform || 'Shopee'}>
                                <SelectTrigger>
                                    <SelectValue placeholder="เลือกแพลตฟอร์ม" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Shopee">Shopee</SelectItem>
                                    <SelectItem value="Lazada">Lazada</SelectItem>
                                    <SelectItem value="TikTok Shop">TikTok Shop</SelectItem>
                                </SelectContent>
                            </Select>
                             {errors.platform && <p className="text-xs text-destructive mt-1">{errors.platform.message}</p>}
                        </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="category" className="text-right">หมวดหมู่</Label>
                        <div className="col-span-3">
                            <Select onValueChange={(value) => setValue('category', value)} value={watch('category')} disabled={!selectedPlatformForForm}>
                                <SelectTrigger>
                                    <SelectValue placeholder="เลือกหมวดหมู่" />
                                </SelectTrigger>
                                <SelectContent>
                                    {platformCategories[selectedPlatformForForm.toLowerCase()]?.map(cat => (
                                        <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                             {errors.category && <p className="text-xs text-destructive mt-1">{errors.category.message}</p>}
                        </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="price" className="text-right">ต้นทุน</Label>
                        <div className="col-span-3">
                           <Input id="price" type="number" step="0.01" {...register('price')} className={errors.price ? 'border-destructive' : ''}/>
                           {errors.price && <p className="text-xs text-destructive mt-1">{errors.price.message}</p>}
                        </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="sku" className="text-right">SKU</Label>
                        <div className="col-span-3">
                            <Input id="sku" {...register('sku')} className={errors.sku ? 'border-destructive' : ''}/>
                            {errors.sku && <p className="text-xs text-destructive mt-1">{errors.sku.message}</p>}
                        </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="status" className="text-right">สถานะ</Label>
                        <div className="col-span-3">
                            <Select onValueChange={(value) => setValue('status', value as StockItem['status'])} defaultValue={editingItem?.status || 'รอขาย'}>
                                <SelectTrigger>
                                    <SelectValue placeholder="เลือกสถานะ" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="รอขาย">รอขาย</SelectItem>
                                    <SelectItem value="ขายแล้ว">ขายแล้ว</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="ghost">ยกเลิก</Button>
                    </DialogClose>
                    <Button type="submit">{editingItem ? 'บันทึกการเปลี่ยนแปลง' : 'สร้างสินค้า'}</Button>
                </DialogFooter>
            </form>
        </DialogContent>
      </Dialog>
      
      {/* Result Dialog */}
      <Dialog open={!!resultItem} onOpenChange={(isOpen) => !isOpen && setResultItem(null)}>
        <ResultDisplay item={resultItem} />
      </Dialog>
    </>
  );
}
    
    