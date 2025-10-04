
'use client';

import { useState, useEffect } from 'react';
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
import { ArrowLeft, Table, Info, LoaderCircle, ServerCrash } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';


export type StockItem = {
  id: string;
  name: string;
  stock: number;
  price: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
};

const getStatusVariant = (status: StockItem['status']) => {
  switch (status) {
    case 'In Stock':
      return 'default';
    case 'Low Stock':
      return 'secondary';
    case 'Out of Stock':
      return 'destructive';
    default:
      return 'outline';
  }
};

export default function NotionTablePage() {
  const [data, setData] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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

    fetchData();
  }, []);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
             <div key={i} className="flex items-center space-x-4 p-4">
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
              <li>ตรวจสอบว่า Integration ของคุณได้ถูกเชิญให้เข้าถึง Database ใน Notion แล้ว</li>
               <li><span className="font-mono bg-destructive-foreground/20 p-1 rounded">Error: {error}</span></li>
            </ul>
          </AlertDescription>
        </Alert>
      );
    }

    if (data.length === 0) {
        return (
             <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>ไม่พบข้อมูล</AlertTitle>
                <AlertDescription>
                    ไม่พบข้อมูลสินค้าในฐานข้อมูล Notion หรือฐานข้อมูลอาจจะว่างเปล่า
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
              <TableHead className="text-center">สถานะ</TableHead>
              <TableHead className="text-right">จำนวนในสต็อก</TableHead>
              <TableHead className="text-right">ราคา (บาท)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell className="text-center">
                  <Badge variant={getStatusVariant(item.status)}>{item.status}</Badge>
                </TableCell>
                <TableCell className="text-right">{item.stock}</TableCell>
                <TableCell className="text-right font-bold">{item.price.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </UiTable>
      </div>
    );
  }

  return (
    <main className="flex min-h-screen w-full flex-col items-center bg-background p-4 sm:p-8">
      <div className="w-full max-w-4xl space-y-6">
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
            {renderContent()}

            <div className="text-center pt-4">
               <Button asChild>
                  <Link href="/">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    กลับไปที่เครื่องคำนวณ
                  </Link>
                </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
