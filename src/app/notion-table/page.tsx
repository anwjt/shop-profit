
'use client';

import { useState, useEffect, useMemo } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
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
import { ArrowLeft, Table, Info, LoaderCircle, ServerCrash, PlusCircle, ChevronRight, Filter, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useToast } from "@/hooks/use-toast";
import { getPlatformCategories } from '@/lib/price-calculation';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';

export type StockItem = {
  id: string;
  name: string;
  sku: string;
  price: number;
  status: 'ขายแล้ว' | 'รอขาย';
  platform: string;
  category: string;
};

type GroupedStockItem = {
    name: string;
    skuCount: number;
    platforms: string[];
    items: StockItem[];
    soldCount: number;
    remainingCount: number;
}

const skuSchema = z.object({
  sku: z.string().min(1, "SKU ห้ามว่าง"),
  platform: z.string({required_error: "ต้องเลือกแพลตฟอร์ม"}).min(1, "ต้องเลือกแพลตฟอร์ม"),
});

const formSchema = z.object({
  name: z.string().min(1, 'ชื่อสินค้าห้ามว่าง'),
  price: z.coerce.number().min(0, 'ราคาต้องเป็นตัวเลขไม่ติดลบ'),
  category: z.string().min(1, "กรุณาเลือกหมวดหมู่"),
  skus: z.array(skuSchema).min(1, "ต้องมีอย่างน้อย 1 SKU"),
});

type FormData = z.infer<typeof formSchema>;

const platformCategories = getPlatformCategories();
const platforms = Object.keys(platformCategories).map(p => p.charAt(0).toUpperCase() + p.slice(1).replace('-', ' '));


export default function NotionTablePage() {
  const [data, setData] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [platformFilter, setPlatformFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      price: undefined,
      category: '',
      skus: [{ sku: '', platform: '' }],
    }
  });

  const { register, handleSubmit, reset, setValue, control, watch, formState: { errors } } = form;
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: "skus",
  });

  const selectedPlatformForForm = watch('skus.0.platform');
  
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [platformFilter, rowsPerPage]);

  const groupedData = useMemo(() => {
    const grouped = data.reduce((acc, item) => {
        if (!acc[item.name]) {
            acc[item.name] = {
                name: item.name,
                skuCount: 0,
                platforms: [],
                items: [],
                soldCount: 0,
                remainingCount: 0,
            };
        }
        acc[item.name].skuCount++;
        if (item.platform && !acc[item.name].platforms.includes(item.platform)) {
            acc[item.name].platforms.push(item.platform);
        }
        if (item.status === 'ขายแล้ว') {
            acc[item.name].soldCount++;
        } else {
            acc[item.name].remainingCount++;
        }
        acc[item.name].items.push(item);
        return acc;
    }, {} as { [name: string]: GroupedStockItem });

    return Object.values(grouped);
  }, [data]);

  const filteredData = useMemo(() => {
      return groupedData.filter(item => platformFilter === 'all' || item.platforms.includes(platformFilter));
  }, [groupedData, platformFilter]);

  const paginatedData = useMemo(() => {
      const startIndex = (currentPage - 1) * rowsPerPage;
      const endIndex = startIndex + rowsPerPage;
      return filteredData.slice(startIndex, endIndex);
  }, [filteredData, currentPage, rowsPerPage]);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

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

  const handleOpenForm = () => {
    reset({
      name: '',
      price: undefined,
      category: '',
      skus: [{ sku: '', platform: '' }],
    });
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (formData: FormData) => {
    try {
        const { name, price, category } = formData;
        
        const creationPromises = formData.skus.map(skuItem => {
            const { sku, platform } = skuItem;
            const payload = {
                name,
                price,
                category,
                sku,
                platform,
                status: 'รอขาย'
            };
            return fetch('/api/notion', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
        });

        const responses = await Promise.all(creationPromises);

        for (const response of responses) {
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'An operation failed');
            }
        }

        toast({ title: "✅ เพิ่มสินค้าสำเร็จ", description: `สินค้าใหม่ถูกเพิ่มใน Notion เรียบร้อยแล้ว` });
        fetchData(); // Refresh data from Notion
        setIsFormOpen(false);

    } catch (e: any) {
        toast({ variant: "destructive", title: "เกิดข้อผิดพลาด", description: e.message });
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
             <div key={i} className="flex items-center space-x-4 p-4">
                <div className="space-y-2 flex-grow">
                    <Skeleton className="h-5 w-3/4" />
                </div>
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-16" />
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
               <li>ตรวจสอบว่าคอลัมน์ `Platform` ใน Notion ถูกตั้งค่าเป็น **Select** (ไม่ใช่ Multi-select)</li>
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
      <div className="space-y-4">
        <div className="overflow-x-auto rounded-lg border">
          <UiTable>
            <TableHeader>
              <TableRow>
                <TableHead>ชื่อสินค้า</TableHead>
                <TableHead className="text-center">จำนวน SKU</TableHead>
                <TableHead>จำนวนการขาย</TableHead>
                <TableHead>แพลตฟอร์ม</TableHead>
                <TableHead className="text-right w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.length > 0 ? (
                  paginatedData.map((item) => (
                    <TableRow key={item.name}>
                      <TableCell className="font-medium">
                        <Link href={`/notion-table/${encodeURIComponent(item.name)}`} className="hover:underline">
                            {item.name}
                        </Link>
                      </TableCell>
                      <TableCell className="text-center">{item.skuCount}</TableCell>
                      <TableCell>
                          <div className='text-xs'>
                            <p className='text-green-600'>ขายแล้ว: {item.soldCount}</p>
                            <p className='text-muted-foreground'>คงเหลือ: {item.remainingCount}</p>
                          </div>
                      </TableCell>
                      <TableCell>
                          <div className="flex flex-wrap gap-1">
                              {item.platforms.map(p => <Badge key={p} variant="outline">{p}</Badge>)}
                          </div>
                      </TableCell>
                      <TableCell className="text-right">
                         <Link href={`/notion-table/${encodeURIComponent(item.name)}`}>
                           <ChevronRight className="h-4 w-4 text-muted-foreground" />
                         </Link>
                      </TableCell>
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                        ไม่พบข้อมูลที่ตรงกับตัวกรอง
                    </TableCell>
                </TableRow>
              )}
            </TableBody>
          </UiTable>
        </div>
        
        {/* Pagination Controls */}
        <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
                มี {filteredData.length} รายการ
            </div>
            <div className="flex items-center gap-4">
                 <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">แสดงแถวละ</p>
                    <Select
                        value={`${rowsPerPage}`}
                        onValueChange={(value) => {
                            setRowsPerPage(Number(value));
                            setCurrentPage(1);
                        }}
                        >
                        <SelectTrigger className="h-8 w-[70px]">
                            <SelectValue placeholder={`${rowsPerPage}`} />
                        </SelectTrigger>
                        <SelectContent side="top">
                            {[5, 10, 20, 50].map((pageSize) => (
                            <SelectItem key={pageSize} value={`${pageSize}`}>
                                {pageSize}
                            </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="text-sm font-medium">
                    หน้า {currentPage} จาก {totalPages}
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        <ChevronRight className="h-4 w-4 transform rotate-180" />
                        ก่อนหน้า
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                    >
                        ถัดไป
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>

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
              <div className="flex justify-between items-center">
                 <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <Select onValueChange={setPlatformFilter} defaultValue="all">
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="กรองตามแพลตฟอร์ม" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">ทุกแพลตฟอร์ม</SelectItem>
                            <SelectItem value="Shopee">Shopee</SelectItem>
                            <SelectItem value="Lazada">Lazada</SelectItem>
                            <SelectItem value="TikTok Shop">TikTok Shop</SelectItem>
                        </SelectContent>
                    </Select>
                 </div>
                <Button onClick={handleOpenForm}>
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
        <DialogContent className="sm:max-w-xl">
            <Form {...form}>
              <form onSubmit={handleSubmit(handleFormSubmit)}>
                  <DialogHeader>
                      <DialogTitle>เพิ่มสินค้าใหม่</DialogTitle>
                      <DialogDescription>
                          กรอกรายละเอียดสินค้าใหม่เพื่อเพิ่มในฐานข้อมูล (จะถูกสร้างด้วยสถานะ "รอขาย")
                      </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="name" className="text-right">ชื่อสินค้า</Label>
                          <div className="col-span-3">
                              <Input id="name" {...register('name')} className={errors.name ? 'border-destructive' : ''} />
                              {errors.name && <p className="text-xs text-destructive mt-1">{errors.name.message}</p>}
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
                          <Label htmlFor="category" className="text-right">หมวดหมู่</Label>
                          <div className="col-span-3">
                            <FormField
                                control={control}
                                name="category"
                                render={({ field }) => (
                                <FormItem>
                                  <Select onValueChange={field.onChange} value={field.value} disabled={!selectedPlatformForForm}>
                                    <FormControl>
                                      <SelectTrigger>
                                          <SelectValue placeholder="เลือกหมวดหมู่ (ต้องเลือกแพลตฟอร์มก่อน)" />
                                      </SelectTrigger>
                                    </FormControl>
                                      <SelectContent>
                                          {platformCategories[selectedPlatformForForm?.toLowerCase().replace(' ','-') || '']?.map(cat => (
                                              <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                                          ))}
                                      </SelectContent>
                                  </Select>
                                   {errors.category && <p className="text-xs text-destructive mt-1">{errors.category.message}</p>}
                                </FormItem>
                                )}
                              />
                          </div>
                      </div>

                       <div className='space-y-4 rounded-lg border p-4'>
                        {fields.map((field, index) => (
                          <div key={field.id} className="space-y-3">
                            <div className='flex items-center gap-2'>
                              <Label htmlFor={`skus.${index}.sku`} className="flex-shrink-0">SKU #{index + 1}</Label>
                              <div className='flex-grow'>
                                 <Input id={`skus.${index}.sku`} {...register(`skus.${index}.sku`)} placeholder="รหัสสินค้า" className={errors.skus?.[index]?.sku ? 'border-destructive' : ''} />
                                 {errors.skus?.[index]?.sku && <p className="text-xs text-destructive mt-1">{errors.skus?.[index]?.sku?.message}</p>}
                              </div>
                              {fields.length > 1 && <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}><XCircle className="h-5 w-5 text-destructive" /></Button>}
                            </div>

                            <div className="pl-4">
                              <Label>สำหรับแพลตฟอร์ม</Label>
                              <Controller
                                name={`skus.${index}.platform`}
                                control={control}
                                render={({ field }) => (
                                  <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className="flex flex-wrap gap-4 mt-2"
                                  >
                                    {platforms.map((platform) => (
                                      <FormItem key={platform} className="flex items-center space-x-2 space-y-0">
                                        <FormControl>
                                          <RadioGroupItem value={platform} id={`${field.name}-${platform}`} />
                                        </FormControl>
                                        <Label htmlFor={`${field.name}-${platform}`}>{platform}</Label>
                                      </FormItem>
                                    ))}
                                  </RadioGroup>
                                )}
                              />
                               {errors.skus?.[index]?.platform && <p className="text-xs text-destructive mt-1">{errors.skus?.[index]?.platform?.message}</p>}
                            </div>
                            {index < fields.length - 1 && <hr className='my-4'/>}
                          </div>
                        ))}
                        
                        <Button type="button" variant="outline" size="sm" onClick={() => append({ sku: '', platform: '' })}>
                            <PlusCircle className="mr-2 h-4 w-4" /> เพิ่ม SKU
                        </Button>
                      </div>

                  </div>
                  <DialogFooter>
                      <DialogClose asChild>
                          <Button type="button" variant="ghost">ยกเลิก</Button>
                      </DialogClose>
                      <Button type="submit">สร้างสินค้า</Button>
                  </DialogFooter>
              </form>
            </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
