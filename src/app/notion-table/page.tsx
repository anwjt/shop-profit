
'use client';

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
import { ArrowLeft, Table, Info } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

// Mock data simulating a response from a Notion database
const mockStockData = [
  { id: '1', name: 'เคสโทรศัพท์ลายแมว', stock: 85, price: 159, status: 'In Stock' },
  { id: '2', name: 'เสื้อยืดสีขาว', stock: 120, price: 299, status: 'In Stock' },
  { id: '3', name: 'แก้วน้ำเก็บความเย็น', stock: 0, price: 450, status: 'Out of Stock' },
  { id: '4', name: 'พาวเวอร์แบงค์ 10000mAh', stock: 5, price: 790, status: 'Low Stock' },
  { id: '5', name: 'หูฟังไร้สาย TWS', stock: 32, price: 1290, status: 'In Stock' },
  { id: '6', name: 'คีย์บอร์ด Mechanical', stock: 2, price: 2500, status: 'Low Stock' },
];

const getStatusVariant = (status: string) => {
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

  return (
    <main className="flex min-h-screen w-full flex-col items-center bg-background p-4 sm:p-8">
      <div className="w-full max-w-4xl space-y-6">
        <Card className="w-full shadow-lg bg-card/70 backdrop-blur-sm border-white/20">
          <CardHeader className="text-center">
            <div className="mx-auto bg-primary text-primary-foreground rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <Table className="w-8 h-8" />
            </div>
            <CardTitle className="font-headline text-3xl">
              ตารางข้อมูลจาก Notion (ตัวอย่าง)
            </CardTitle>
            <CardDescription>
              นี่คือตัวอย่างหน้าจอสำหรับแสดงข้อมูลสต็อกสินค้าที่ดึงมาจาก Notion
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert variant="default" className="mt-4 bg-yellow-100/50 border-yellow-300">
              <Info className="h-4 w-4 text-yellow-800" />
              <AlertTitle className="text-yellow-800">ข้อมูลจำลอง</AlertTitle>
              <AlertDescription className="text-yellow-700">
                ข้อมูลที่แสดงในตารางนี้เป็นเพียงข้อมูลตัวอย่าง ไม่ได้ดึงมาจาก Notion API โดยตรง เนื่องด้วยข้อจำกัดด้านความปลอดภัยในการใช้ API Key ในฝั่ง Client-side
              </AlertDescription>
            </Alert>
            
            <div className="overflow-x-auto">
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
                    {mockStockData.map((item) => (
                    <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell className="text-center">
                            <Badge variant={getStatusVariant(item.status) as any}>{item.status}</Badge>
                        </TableCell>
                        <TableCell className="text-right">{item.stock}</TableCell>
                        <TableCell className="text-right font-bold">{item.price.toFixed(2)}</TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </UiTable>
            </div>

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

    