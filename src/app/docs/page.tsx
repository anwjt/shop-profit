
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { ArrowLeft, BookMarked, Calculator, Briefcase, CreditCard, Percent, ShieldCheck, Info, Table as TableIcon, History, Settings } from "lucide-react";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function DocsPage() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center bg-background p-4 sm:p-8">
      <div className="w-full max-w-4xl space-y-6">
        <Card className="w-full shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto bg-primary text-primary-foreground rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <BookMarked className="w-8 h-8" />
            </div>
            <CardTitle className="font-headline text-3xl">
              คู่มือการใช้งานและสูตรคำนวณ
            </CardTitle>
            <CardDescription>
              ทำความเข้าใจวิธีการทำงานของเครื่องมือและฟังก์ชันทั้งหมด (ฉบับละเอียด)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <section>
              <h2 className="text-xl font-bold mb-2 flex items-center gap-2"><ShieldCheck className="text-primary"/>ทำไมต้องใช้เครื่องมือนี้?</h2>
              <p className="text-muted-foreground">
                การตั้งราคาขายบนแพลตฟอร์มอีคอมเมิร์ซมีความซับซ้อนจากค่าธรรมเนียมหลายประเภท หากคำนวณผิดพลาดอาจทำให้คุณขาดทุนโดยไม่รู้ตัว เครื่องมือนี้ถูกสร้างขึ้นเพื่อแก้ปัญหานี้โดยเฉพาะ:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                <li><span className="font-semibold text-foreground">ความแม่นยำสูง:</span> รวมค่าธรรมเนียมที่จำเป็นเกือบทั้งหมด ทำให้คุณเห็นกำไรที่แท้จริง</li>
                <li><span className="font-semibold text-foreground">ประหยัดเวลา:</span> ไม่ต้องนั่งคำนวณด้วยตนเองที่แสนจะวุ่นวายและเสี่ยงต่อการผิดพลาด</li>
                <li><span className="font-semibold text-foreground">รับประกันกำไร:</span> ช่วยให้คุณตั้งราคาขายที่ครอบคลุมทุกค่าใช้จ่ายและได้กำไรตามที่ต้องการ</li>
                 <li><span className="font-semibold text-foreground">จัดการสต็อก:</span> เชื่อมต่อกับ Notion เพื่อจัดการข้อมูลสต็อกและคำนวณราคาได้ในที่เดียว</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold mb-4 border-b pb-2">ฟังก์ชันการทำงานหลัก</h2>
               <Accordion type="single" collapsible className="w-full" defaultValue="calculator">
                 <AccordionItem value="calculator">
                  <AccordionTrigger className="text-lg font-semibold"><Calculator className="mr-2 text-primary"/>เครื่องคำนวณราคา</AccordionTrigger>
                  <AccordionContent>
                      <p className="text-muted-foreground mb-4">
                        หัวใจของการคำนวณคือการหาราคาขาย (Selling Price) ที่เมื่อถูกหักค่าธรรมเนียมทั้งหมดแล้ว จะยังคงเหลือเพียงพอสำหรับต้นทุนและกำไรที่คุณต้องการ สูตรหลักที่ใช้คือ:
                      </p>
                      <div className="mt-4 p-4 bg-muted rounded-lg text-center font-mono text-sm sm:text-base">
                      ราคาขาย = (ต้นทุนรวม + กำไรที่ต้องการ + ส่วนลด) / (1 - อัตราค่าธรรมเนียมรวม)
                      </div>
                       <p className="text-muted-foreground mt-2 text-xs">
                        *ต้นทุนรวม = ราคาต้นทุนสินค้า + ค่าใช้จ่ายอื่นๆ <br/>
                        *อัตราค่าธรรมเนียมรวม = (%ค่าคอมมิชชั่น + %ค่าธรรมเนียมอื่นๆ) + %ค่าคอม Affiliate
                      </p>
                       <div className="mt-4 p-4 bg-yellow-100/80 dark:bg-yellow-900/20 rounded-lg border border-yellow-300 dark:border-yellow-800 text-sm">
                        <h4 className="font-bold text-yellow-800 dark:text-yellow-300">ทำไมต้องบวก "ส่วนลด" เข้าไปในตัวตั้ง?</h4>
                        <p className="text-yellow-700 dark:text-yellow-400 mt-1">
                          เพราะค่าธรรมเนียมส่วนใหญ่จะถูกคิดจาก "ราคาขายหลังหักส่วนลด" การบวกส่วนลดเข้าไปในสูตรก่อนหาร จะทำให้ราคาขายที่คำนวณได้ "สูงขึ้น" เพื่อชดเชยค่าธรรมเนียมที่จะหายไปจากการให้ส่วนลดนั้นเอง จึงมั่นใจได้ว่าแม้จะลดราคาให้ลูกค้าแล้ว กำไรของคุณจะยังคงเท่าเดิมตามที่ตั้งใจไว้
                        </p>
                      </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="notion">
                  <AccordionTrigger className="text-lg font-semibold"><TableIcon className="mr-2 text-primary"/>การจัดการสต็อกด้วย Notion</AccordionTrigger>
                  <AccordionContent>
                      <p className="text-muted-foreground mb-4">
                        คุณสามารถเชื่อมต่อแอปนี้กับฐานข้อมูลใน Notion เพื่อจัดการสต็อกสินค้าของคุณได้โดยตรง ทำให้การคำนวณราคาขายสำหรับสินค้าที่มีอยู่เป็นไปอย่างรวดเร็ว
                      </p>
                      <ul className="list-disc list-inside mt-2 space-y-2 text-muted-foreground">
                        <li><span className="font-semibold text-foreground">ดูภาพรวม:</span> หน้า "Notion Table" จะแสดงรายการสินค้าทั้งหมดที่ถูกจัดกลุ่มตามชื่อ พร้อมจำนวน SKU และสถานะการขาย</li>
                        <li><span className="font-semibold text-foreground">จัดการ SKU:</span> คุณสามารถเพิ่ม, ลบ, หรือแก้ไขข้อมูลหลัก (ชื่อ, ต้นทุน) และสถานะของสินค้าได้จากในแอป</li>
                        <li><span className="font-semibold text-foreground">คำนวณราคาทันที:</span> ในหน้ารายละเอียดสินค้า คุณสามารถกดปุ่มคำนวณราคาสำหรับ SKU นั้นๆ ได้ทันทีโดยไม่ต้องกรอกข้อมูลใหม่</li>
                      </ul>
                      <p className="text-xs text-muted-foreground mt-4">
                        *หากต้องการเชื่อมต่อ โปรดดูวิธีการตั้งค่าที่ไฟล์ `README.md`
                      </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="history">
                  <AccordionTrigger className="text-lg font-semibold"><History className="mr-2 text-primary"/>ประวัติการคำนวณ</AccordionTrigger>
                  <AccordionContent>
                     <p className="text-muted-foreground">
                       ทุกครั้งที่คุณคำนวณราคาในหน้าหลัก ผลลัพธ์จะถูกบันทึกไว้ในหน้า "ประวัติ" (เข้าถึงได้จากปุ่มบนหน้าแรก) ทำให้คุณสามารถย้อนกลับมาดูรายการคำนวณล่าสุดได้ ข้อมูลนี้จะถูกเก็บไว้ในเบราว์เซอร์ของคุณเป็นเวลา 30 วัน
                     </p>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="settings">
                  <AccordionTrigger className="text-lg font-semibold"><Settings className="mr-2 text-primary"/>การตั้งค่าการแสดงผล</AccordionTrigger>
                  <AccordionContent>
                     <p className="text-muted-foreground">
                       คุณสามารถปรับแต่งหน้าตาของแอปได้โดยกดที่ไอคอนรูปฟันเฟือง (Settings) บนหน้าแรก ซึ่งจะช่วยให้คุณสามารถ:
                     </p>
                      <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                        <li>เลือกธีมสีระหว่าง "สว่าง" (Light Mode) และ "มืด" (Dark Mode)</li>
                        <li>เลือกรูปแบบตัวอักษร (Font) ที่ต้องการได้</li>
                      </ul>
                       <p className="text-muted-foreground mt-2">
                         การตั้งค่าที่คุณเลือกจะถูกบันทึกไว้ในเบราว์เซอร์สำหรับการใช้งานครั้งถัดไป
                       </p>
                  </AccordionContent>
                </AccordionItem>

              </Accordion>
            </section>
            

            <section>
              <h2 className="text-xl font-bold mb-2 flex items-center gap-2"><Percent className="text-primary"/>รายละเอียดค่าธรรมเนียมแต่ละแพลตฟอร์ม</h2>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="shopee">
                  <AccordionTrigger>Shopee</AccordionTrigger>
                  <AccordionContent>
                    <p className="font-semibold mb-2">ค่าธรรมเนียมของ Shopee ประกอบด้วย (ราคารวม VAT 7% แล้ว):</p>
                    <p className="text-xs text-muted-foreground italic mb-3">ข้อมูลอ้างอิงล่าสุด: 20 มกราคม 2568</p>
                    <ul className="list-decimal list-inside space-y-2 mt-2 text-muted-foreground">
                        <li>
                            <span className="font-semibold text-foreground">ค่าธรรมเนียมการขาย (Commission Fee):</span> หักจากราคาขายสินค้าหลังหักส่วนลดร้านค้า อัตราแตกต่างกันไปในแต่ละหมวดหมู่
                        </li>
                        <li>
                            <span className="font-semibold text-foreground">ค่าธรรมเนียมธุรกรรมการชำระเงิน (Transaction Fee):</span> หักจากยอดรวมที่ผู้ซื้อชำระผ่านทุกช่องทาง <span className="font-bold">เครื่องมือของเรารวมค่าธรรมเนียมนี้เข้าไปในค่าคอมมิชชั่นหลักแล้ว (ประมาณ 3.21%)</span> เพื่อให้การคำนวณครอบคลุมมากที่สุด
                        </li>
                        <li>
                            <span className="font-semibold text-foreground">ค่าธรรมเนียมโปรแกรมส่งเสริมการขาย (Service Program Fee):</span> เช่น โปรแกรมส่งฟรี (Free Shipping), โปรแกรมเงินคืน (Cashback) เป็นต้น <span className="font-bold">เครื่องมือนี้ยังไม่รวมค่าธรรมเนียมส่วนนี้</span>
                        </li>
                    </ul>
                    <Tabs defaultValue="main" className="w-full mt-4">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="main">ค่าธรรมเนียมหลัก</TabsTrigger>
                        <TabsTrigger value="installment">
                          <CreditCard className="mr-2 h-4 w-4" />ค่าผ่อนชำระ
                        </TabsTrigger>
                      </TabsList>
                      <TabsContent value="main">
                        <p className="text-sm text-muted-foreground mt-2 mb-2">อัตราค่าธรรมเนียมโดยประมาณที่ใช้ในเครื่องคำนวณ (รวมค่าคอมมิชชั่นและค่าธุรกรรมแล้ว)</p>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>หมวดหมู่สินค้า</TableHead>
                              <TableHead className="text-right">ค่าธรรมเนียมรวม (โดยประมาณ)</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            <TableRow>
                              <TableCell>สินค้าแฟชั่น</TableCell>
                              <TableCell className="text-right font-bold">~12.84%</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>สินค้าอิเล็กทรอนิกส์</TableCell>
                              <TableCell className="text-right font-bold">~11.77%</TableCell>
                            </TableRow>
                             <TableRow>
                              <TableCell>สินค้าไลฟ์สไตล์</TableCell>
                              <TableCell className="text-right font-bold">~11.24%</TableCell>
                            </TableRow>
                             <TableRow>
                              <TableCell>สินค้าทั่วไป (นอกกลุ่มอิเล็กฯ)</TableCell>
                              <TableCell className="text-right font-bold">~11.77%</TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </TabsContent>
                      <TabsContent value="installment">
                         <p className="text-sm text-muted-foreground mt-2 mb-2">กรณีที่ลูกค้าชำระเงินผ่านช่องทางพิเศษ จะมีค่าธรรมเนียม<span className="font-bold">บวกเพิ่ม</span>จากค่าธรรมเนียมหลัก</p>
                         <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>ช่องทางการชำระเงิน</TableHead>
                              <TableHead className="text-right">ค่าธรรมเนียมเพิ่มเติม (สูงสุด)</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            <TableRow>
                              <TableCell>ผ่อนชำระผ่านบัตรเครดิต</TableCell>
                              <TableCell className="text-right font-bold">6.42%</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>SPayLater</TableCell>
                              <TableCell className="text-right font-bold">6.42%</TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                         <p className="mt-2 text-xs text-muted-foreground">*ในหน้าเครื่องคำนวณจะมีการแสดงราคาแนะนำสำหรับกรณีนี้แยกไว้ให้ต่างหาก</p>
                      </TabsContent>
                    </Tabs>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="lazada">
                  <AccordionTrigger>Lazada</AccordionTrigger>
                  <AccordionContent>
                    <p className="font-semibold mb-2">ค่าธรรมเนียมของ Lazada ประกอบด้วย (ราคารวม VAT 7% แล้ว):</p>
                    <p className="text-xs text-muted-foreground italic mb-3">ข้อมูลอ้างอิงล่าสุด: 5 มิถุนายน 2568</p>
                     <ul className="list-decimal list-inside space-y-2 mt-2 text-muted-foreground">
                        <li>
                            <span className="font-semibold text-foreground">ค่าธรรมเนียมมาร์เก็ตเพลส (Marketplace Fee):</span> หักจากราคาขายสินค้า อัตราสูงสุดแตกต่างกันไปในแต่ละหมวดหมู่
                        </li>
                        <li>
                            <span className="font-semibold text-foreground">ค่าธรรมเนียมการชำระเงิน (Payment Fee):</span> หัก 3.21% จากราคาขายสินค้า
                        </li>
                    </ul>
                     <p className="text-sm text-muted-foreground mt-4 mb-2">อัตราค่าธรรมเนียมที่ใช้ในเครื่องคำนวณ (ใช้เรทสูงสุดของแต่ละหมวดหมู่ + ค่าชำระเงิน)</p>
                     <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>หมวดหมู่สินค้า</TableHead>
                          <TableHead className="text-right">ค่ามาร์เก็ตเพลส</TableHead>
                          <TableHead className="text-right">ค่าชำระเงิน</TableHead>
                          <TableHead className="text-right">รวม (ที่ใช้ในแอป)</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                         <TableRow>
                          <TableCell>สินค้าแฟชั่น (สูงสุด)</TableCell>
                          <TableCell className="text-right">9.63%</TableCell>
                          <TableCell className="text-right">3.21%</TableCell>
                          <TableCell className="text-right font-bold">12.84%</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>สินค้าอิเล็กทรอนิกส์ (สูงสุด)</TableCell>
                          <TableCell className="text-right">8.56%</TableCell>
                          <TableCell className="text-right">3.21%</TableCell>
                           <TableCell className="text-right font-bold">11.77%</TableCell>
                        </TableRow>
                         <TableRow>
                          <TableCell>สินค้าทั่วไป (สูงสุด)</TableCell>
                          <TableCell className="text-right">8.56%</TableCell>
                           <TableCell className="text-right">3.21%</TableCell>
                           <TableCell className="text-right font-bold">11.77%</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>สินค้าอุปโภคบริโภค (สูงสุด)</TableCell>
                          <TableCell className="text-right">8.56%</TableCell>
                           <TableCell className="text-right">3.21%</TableCell>
                          <TableCell className="text-right font-bold">11.77%</TableCell>
                        </TableRow>
                         <TableRow>
                          <TableCell>บัตรกำนัลดิจิทัล</TableCell>
                          <TableCell className="text-right">7.49%</TableCell>
                           <TableCell className="text-right">3.21%</TableCell>
                          <TableCell className="text-right font-bold">10.70%</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="tiktok">
                  <AccordionTrigger>TikTok Shop</AccordionTrigger>
                  <AccordionContent>
                     <p className="font-semibold mb-2">ค่าธรรมเนียมของ TikTok Shop ประกอบด้วย (ราคารวม VAT 7% แล้ว):</p>
                     <p className="text-xs text-muted-foreground italic mb-3">ข้อมูลอ้างอิงล่าสุด: 1 มกราคม 2568</p>
                      <ul className="list-decimal list-inside space-y-2 mt-2 text-muted-foreground">
                        <li>
                            <span className="font-semibold text-foreground">ค่าคอมมิชชั่น (Commission Fee):</span> หักจากราคาขายของสินค้าหลังหักส่วนลดแล้ว อัตราแตกต่างกันในแต่ละหมวดหมู่
                        </li>
                        <li>
                            <span className="font-semibold text-foreground">ค่าธรรมเนียมคำสั่งซื้อ (Order Fee):</span> หัก 3.21% จากราคาขายของสินค้าหลังหักส่วนลดแล้ว
                        </li>
                    </ul>
                    <p className="text-sm text-muted-foreground mt-4 mb-2">อัตราค่าธรรมเนียมที่ใช้ในเครื่องคำนวณ (รวมค่าคอมมิชชั่นและค่าธรรมเนียมคำสั่งซื้อแล้ว)</p>
                     <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>หมวดหมู่สินค้า</TableHead>
                          <TableHead className="text-right">ค่าคอมมิชชั่น</TableHead>
                          <TableHead className="text-right">ค่าธรรมเนียมคำสั่งซื้อ</TableHead>
                          <TableHead className="text-right">รวม (ที่ใช้ในแอป)</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>สินค้าแฟชั่น</TableCell>
                          <TableCell className="text-right">6.42%</TableCell>
                          <TableCell className="text-right">3.21%</TableCell>
                          <TableCell className="text-right font-bold">9.63%</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>สินค้าอิเล็กทรอนิกส์</TableCell>
                          <TableCell className="text-right">5.35%</TableCell>
                          <TableCell className="text-right">3.21%</TableCell>
                           <TableCell className="text-right font-bold">8.56%</TableCell>
                        </TableRow>
                         <TableRow>
                          <TableCell>สินค้าไลฟ์สไตล์</TableCell>
                          <TableCell className="text-right">5.35%</TableCell>
                           <TableCell className="text-right">3.21%</TableCell>
                           <TableCell className="text-right font-bold">8.56%</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-2 flex items-center gap-2"><Briefcase className="text-primary"/>กรณีศึกษา: ตัวอย่างการคำนวณจริง</h2>
              <p className="text-muted-foreground mb-4">
                ดูตัวอย่างเพื่อทำความเข้าใจว่าเครื่องมือคำนวณราคาขายจากข้อมูลต่างๆ ที่คุณป้อนเข้ามาได้อย่างไร
              </p>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="case-shopee">
                  <AccordionTrigger>ตัวอย่าง: ขายเคสโทรศัพท์บน Shopee</AccordionTrigger>
                  <AccordionContent className="text-sm">
                    <p className="font-semibold mb-2">สถานการณ์:</p>
                    <ul className="list-disc list-inside space-y-1 mb-4 p-4 bg-muted rounded-lg">
                      <li>ราคาต้นทุนสินค้า: <span className="font-bold">100</span> บาท</li>
                      <li>ค่าแพ็คของ (ค่าใช้จ่ายอื่น): <span className="font-bold">5</span> บาท</li>
                      <li>ต้องการกำไร: <span className="font-bold">20%</span> (ของต้นทุนสินค้า = 20 บาท)</li>
                      <li>สร้างคูปองส่วนลดให้ลูกค้า: <span className="font-bold">10</span> บาท</li>
                      <li>ตั้งค่าคอม Affiliate: <span className="font-bold">3%</span></li>
                      <li>หมวดหมู่สินค้า: อิเล็กทรอนิกส์ (ค่าธรรมเนียมรวม ≈ <span className="font-bold">11.77%</span>)</li>
                    </ul>
                    <p className="font-semibold mb-2">ขั้นตอนการคำนวณ:</p>
                    <ol className="list-decimal list-inside space-y-2">
                      <li><span className="font-semibold">ต้นทุนรวม:</span> 100 (ต้นทุน) + 5 (ค่าแพ็ค) = <span className="font-bold">105</span> บาท</li>
                      <li><span className="font-semibold">กำไรที่ต้องการ:</span> 100 * 20% = <span className="font-bold">20</span> บาท</li>
                      <li><span className="font-semibold">อัตราค่าธรรมเนียมรวม:</span> 11.77% (แพลตฟอร์ม) + 3% (Affiliate) = <span className="font-bold">14.77%</span> หรือ 0.1477</li>
                      <li><span className="font-semibold">แทนค่าในสูตร:</span>
                        <div className="font-mono p-3 bg-muted my-2 rounded-md text-xs sm:text-sm">
                          ราคาขาย = (ต้นทุนรวม + กำไร + ส่วนลด) / (1 - อัตราค่าธรรมเนียมรวม)<br/>
                          ราคาขาย = (105 + 20 + 10) / (1 - 0.1477)<br/>
                          ราคาขาย = 135 / 0.8523 ≈ <span className="font-bold">158.39</span> บาท
                        </div>
                      </li>
                      <li><span className="font-semibold">พิสูจน์กำไร:</span>
                        <ul className="list-disc list-inside mt-2 p-3 bg-green-100/50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                          <li>รายรับจากลูกค้า (ตั้งขาย): <span className="font-bold text-blue-600 dark:text-blue-400">158.39</span> บาท</li>
                          <li>หักส่วนลดร้านค้า: -10.00 บาท (เหลือยอดสำหรับคิดค่าธรรมเนียม <span className="font-bold">148.39</span>)</li>
                          <li>หักค่าธรรมเนียม Shopee (11.77% ของ 148.39): <span className="text-red-600 dark:text-red-400">-17.46</span> บาท</li>
                          <li>หักค่าคอม Affiliate (3% ของราคาขาย 158.39): <span className="text-red-600 dark:text-red-400">-4.75</span> บาท</li>
                          <li>หักต้นทุนรวม: <span className="text-red-600 dark:text-red-400">-105.00</span> บาท</li>
                          <li><span className="font-bold">กำไรสุทธิ: 158.39 - 10 - 17.46 - 4.75 - 105 = <span className="text-green-600 dark:text-green-400 font-bold text-base">21.18</span> บาท*</span></li>
                        </ul>
                         <p className="text-xs text-muted-foreground mt-1">*กำไรที่ได้อาจสูงกว่าที่คาดการณ์เล็กน้อยเนื่องจากการปัดเศษทศนิยม</p>
                      </li>
                    </ol>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="case-lazada">
                  <AccordionTrigger>ตัวอย่าง: ขายเสื้อผ้าบน Lazada</AccordionTrigger>
                   <AccordionContent className="text-sm">
                    <p className="font-semibold mb-2">สถานการณ์:</p>
                    <ul className="list-disc list-inside space-y-1 mb-4 p-4 bg-muted rounded-lg">
                      <li>ราคาต้นทุนสินค้า: <span className="font-bold">250</span> บาท</li>
                      <li>ค่ากล่อง (ค่าใช้จ่ายอื่น): <span className="font-bold">10</span> บาท</li>
                      <li>ต้องการกำไร: <span className="font-bold">80</span> บาท (กำหนดเป็นตัวเลข)</li>
                      <li>สร้างคูปองส่วนลดให้ลูกค้า: <span className="font-bold">20</span> บาท</li>
                      <li>ตั้งค่าคอม Affiliate: <span className="font-bold">5%</span></li>
                      <li>หมวดหมู่สินค้า: แฟชั่น (ค่าธรรมเนียมรวม = <span className="font-bold">12.84%</span>)</li>
                    </ul>
                    <p className="font-semibold mb-2">ขั้นตอนการคำนวณ:</p>
                    <ol className="list-decimal list-inside space-y-2">
                      <li><span className="font-semibold">ต้นทุนรวม:</span> 250 (ต้นทุน) + 10 (ค่ากล่อง) = <span className="font-bold">260</span> บาท</li>
                      <li><span className="font-semibold">กำไรที่ต้องการ:</span> <span className="font-bold">80</span> บาท</li>
                      <li><span className="font-semibold">อัตราค่าธรรมเนียมรวม:</span> 12.84% (แพลตฟอร์ม) + 5% (Affiliate) = <span className="font-bold">17.84%</span> หรือ 0.1784</li>
                      <li><span className="font-semibold">แทนค่าในสูตร:</span>
                        <div className="font-mono p-3 bg-muted my-2 rounded-md text-xs sm:text-sm">
                          ราคาขาย = (260 + 80 + 20) / (1 - 0.1784)<br/>
                          ราคาขาย = 360 / 0.8216 ≈ <span className="font-bold">438.17</span> บาท
                        </div>
                      </li>
                      <li><span className="font-semibold">พิสูจน์กำไร:</span>
                        <ul className="list-disc list-inside mt-2 p-3 bg-green-100/50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                          <li>รายรับจากลูกค้า (ตั้งขาย): <span className="font-bold text-blue-600 dark:text-blue-400">438.17</span> บาท</li>
                           <li>หักส่วนลดร้านค้า: -20.00 บาท (เหลือยอดสำหรับคิดค่าธรรมเนียม <span className="font-bold">418.17</span>)</li>
                          <li>หักค่าธรรมเนียม Lazada (12.84% ของ 418.17): <span className="text-red-600 dark:text-red-400">-53.69</span> บาท</li>
                          <li>หักค่าคอม Affiliate (5% ของราคาขาย 438.17): <span className="text-red-600 dark:text-red-400">-21.91</span> บาท</li>
                          <li>หักต้นทุนรวม: <span className="text-red-600 dark:text-red-400">-260.00</span> บาท</li>
                           <li><span className="font-bold">กำไรสุทธิ: 438.17 - 20 - 53.69 - 21.91 - 260 = <span className="text-green-600 dark:text-green-400 font-bold text-base">82.57</span> บาท*</span></li>
                        </ul>
                         <p className="text-xs text-muted-foreground mt-1">*กำไรที่ได้อาจสูงกว่าที่คาดการณ์เล็กน้อยเนื่องจากการปัดเศษทศนิยม</p>
                      </li>
                    </ol>
                  </AccordionContent>
                </AccordionItem>
                 <AccordionItem value="case-tiktok">
                  <AccordionTrigger>ตัวอย่าง: ขายแก้วน้ำบน TikTok Shop</AccordionTrigger>
                   <AccordionContent className="text-sm">
                    <p className="font-semibold mb-2">สถานการณ์:</p>
                    <ul className="list-disc list-inside space-y-1 mb-4 p-4 bg-muted rounded-lg">
                      <li>ราคาต้นทุนสินค้า: <span className="font-bold">80</span> บาท</li>
                      <li>ไม่มีค่าใช้จ่ายอื่น</li>
                      <li>ต้องการกำไร: <span className="font-bold">25%</span> (ของต้นทุนสินค้า = 20 บาท)</li>
                      <li>ไม่ได้สร้างคูปองส่วนลด</li>
                      <li>ไม่ได้เข้าร่วม Affiliate</li>
                      <li>หมวดหมู่สินค้า: ไลฟ์สไตล์ (ค่าธรรมเนียมรวม = <span className="font-bold">8.56%</span>)</li>
                    </ul>
                    <p className="font-semibold mb-2">ขั้นตอนการคำนวณ:</p>
                    <ol className="list-decimal list-inside space-y-2">
                      <li><span className="font-semibold">ต้นทุนรวม:</span> <span className="font-bold">80</span> บาท</li>
                      <li><span className="font-semibold">กำไรที่ต้องการ:</span> 80 * 25% = <span className="font-bold">20</span> บาท</li>
                       <li><span className="font-semibold">อัตราค่าธรรมเนียมรวม:</span> <span className="font-bold">8.56%</span> หรือ 0.0856</li>
                      <li><span className="font-semibold">แทนค่าในสูตร:</span>
                        <div className="font-mono p-3 bg-muted my-2 rounded-md text-xs sm:text-sm">
                          ราคาขาย = (ต้นทุนรวม + กำไร + ส่วนลด) / (1 - อัตราค่าธรรมเนียมรวม)<br/>
                          ราคาขาย = (80 + 20 + 0) / (1 - 0.0856)<br/>
                          ราคาขาย = 100 / 0.9144 ≈ <span className="font-bold">109.36</span> บาท
                        </div>
                      </li>
                      <li><span className="font-semibold">พิสูจน์กำไร:</span>
                        <ul className="list-disc list-inside mt-2 p-3 bg-green-100/50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                          <li>รายรับจากลูกค้า (ตั้งขาย): <span className="font-bold text-blue-600 dark:text-blue-400">109.36</span> บาท</li>
                          <li>หักค่าธรรมเนียม TikTok (8.56% ของ 109.36): <span className="text-red-600 dark:text-red-400">-9.36</span> บาท</li>
                          <li>หักต้นทุนรวม: <span className="text-red-600 dark:text-red-400">-80.00</span> บาท</li>
                           <li><span className="font-bold">กำไรสุทธิ: 109.36 - 9.36 - 80 = <span className="text-green-600 dark:text-green-400 font-bold text-base">20.00</span> บาท</span></li>
                        </ul>
                      </li>
                    </ol>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </section>
            
            <Alert variant="default" className="mt-4">
              <Info className="h-4 w-4" />
              <AlertTitle>ข้อจำกัดความรับผิดชอบ</AlertTitle>
              <AlertDescription>
                ราคาที่คำนวณได้เป็นเพียงการประมาณการจากข้อมูลพื้นฐาน และยังไม่รวมค่าใช้จ่ายหรือส่วนลดที่อาจเกิดขึ้นจากแคมเปญส่งเสริมการขายต่างๆ (เช่น ส่วนลดในเทศกาล, คูปองส่วนลดจากแพลตฟอร์ม) หรือค่าขนส่งพิเศษ โปรดตรวจสอบรายละเอียดของแคมเปญและค่าธรรมเนียมอื่นๆ เพิ่มเติมเพื่อให้ได้ราคาที่แม่นยำที่สุด
              </AlertDescription>
            </Alert>

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
