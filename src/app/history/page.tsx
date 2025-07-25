'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { History, ArrowLeft, Trash2, Info } from 'lucide-react';
import Link from 'next/link';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import type { CalculationResult } from '@/components/price-calculator';

type HistoryItem = CalculationResult & {
    date: string;
};

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('calculationHistory');
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch (error) {
      console.error("Failed to parse history from localStorage", error);
      setHistory([]);
    }
  }, []);

  const clearHistory = () => {
    try {
      localStorage.removeItem('calculationHistory');
      setHistory([]);
    } catch (error) {
      console.error("Failed to clear history from localStorage", error);
    }
  };

  const getPlatformName = (platformId: string) => {
    const names: { [key: string]: string } = {
        shopee: 'Shopee',
        lazada: 'Lazada',
        tiktok: 'TikTok Shop'
    };
    return names[platformId] || 'N/A';
  }

  return (
    <main className="flex min-h-screen w-full flex-col items-center bg-background p-4 sm:p-8">
      <div className="w-full max-w-4xl space-y-6">
        <Card className="w-full shadow-lg bg-card/70 backdrop-blur-sm border-white/20">
          <CardHeader className="text-center">
            <div className="mx-auto bg-primary text-primary-foreground rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <History className="w-8 h-8" />
            </div>
            <CardTitle className="font-headline text-3xl">
              ประวัติการคำนวณ
            </CardTitle>
            <CardDescription>
              รายการคำนวณล่าสุดของคุณที่บันทึกไว้ในเบราว์เซอร์นี้
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {history.length > 0 ? (
                <>
                    <div className="overflow-x-auto">
                        <Table>
                        <TableHeader>
                            <TableRow>
                            <TableHead>วันที่</TableHead>
                            <TableHead>แพลตฟอร์ม</TableHead>
                            <TableHead className="text-right">ต้นทุนรวม</TableHead>
                            <TableHead className="text-right">ราคาขาย</TableHead>
                            <TableHead className="text-right">ค่าธรรมเนียม</TableHead>
                            <TableHead className="text-right">กำไร</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {history.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell>{new Date(item.date).toLocaleDateString('th-TH')}</TableCell>
                                <TableCell>{getPlatformName(item.platform)}</TableCell>
                                <TableCell className="text-right">{item.totalCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                                <TableCell className="text-right font-bold">{item.sellingPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                                <TableCell className="text-right text-red-600">{`-${item.platformFeeAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</TableCell>
                                <TableCell className="text-right text-green-600">{item.profit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                            </TableRow>
                            ))}
                        </TableBody>
                        </Table>
                    </div>
                    <Button variant="destructive" onClick={clearHistory} className="w-full">
                        <Trash2 className="mr-2 h-4 w-4" />
                        ล้างประวัติทั้งหมด
                    </Button>
                </>
            ) : (
                <Alert className="bg-muted/50 border-transparent">
                    <Info className="h-4 w-4" />
                    <AlertTitle>ไม่พบประวัติการคำนวณ</AlertTitle>
                    <AlertDescription>
                        เมื่อคุณเริ่มคำนวณราคาในหน้าหลัก รายการจะถูกบันทึกและแสดงที่นี่
                    </AlertDescription>
                </Alert>
            )}
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
