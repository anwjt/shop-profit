
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
import { ArrowLeft, BookMarked, Calculator, Percent, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function DocsPage() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center bg-background p-4 sm:p-8">
      <div className="w-full max-w-4xl space-y-6">
        <Card className="w-full shadow-lg bg-card/70 backdrop-blur-sm border-white/20">
          <CardHeader className="text-center">
            <div className="mx-auto bg-primary text-primary-foreground rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <BookMarked className="w-8 h-8" />
            </div>
            <CardTitle className="font-headline text-3xl">
              คู่มือการใช้งานและสูตรคำนวณ
            </CardTitle>
            <CardDescription>
              ทำความเข้าใจวิธีการทำงานของเครื่องมือคำนวณราคาขาย
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <section>
              <h2 className="text-xl font-bold mb-2 flex items-center gap-2"><ShieldCheck className="text-primary"/>ทำไมต้องใช้เครื่องมือนี้?</h2>
              <p className="text-muted-foreground">
                การตั้งราคาขายบนแพลตฟอร์มอีคอมเมิร์ซมีความซับซ้อนจากค่าธรรมเนียมหลายประเภท หากคำนวณผิดพลาดอาจทำให้คุณขาดทุนโดยไม่รู้ตัว เครื่องมือนี้ถูกสร้างขึ้นเพื่อแก้ปัญหานี้โดยเฉพาะ:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li><span className="font-semibold">ความแม่นยำสูง:</span> รวมค่าธรรมเนียมที่จำเป็นเกือบทั้งหมด ทำให้คุณเห็นกำไรที่แท้จริง</li>
                <li><span className="font-semibold">ประหยัดเวลา:</span> ไม่ต้องนั่งคำนวณด้วยตนเองที่แสนจะวุ่นวายและเสี่ยงต่อการผิดพลาด</li>
                <li><span className="font-semibold">รับประกันกำไร:</span> ช่วยให้คุณตั้งราคาขายที่ครอบคลุมทุกค่าใช้จ่ายและได้กำไรตามที่ต้องการ</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-2 flex items-center gap-2"><Calculator className="text-primary"/>สูตรการคำนวณหลัก</h2>
              <p className="text-muted-foreground">
                หัวใจของการคำนวณคือการหาราคาขาย (Selling Price) ที่เมื่อถูกหักค่าธรรมเนียมทั้งหมดแล้ว จะยังคงเหลือเพียงพอสำหรับต้นทุนและกำไรที่คุณต้องการ สูตรหลักที่ใช้คือ:
              </p>
              <div className="mt-4 p-4 bg-muted/50 rounded-lg text-center font-mono text-sm sm:text-base">
              (ต้นทุนรวม + กำไรที่ต้องการ + ส่วนลด) / (1 - อัตราค่าธรรมเนียมรวม)
              </div>
               <p className="text-muted-foreground mt-2 text-xs">
                *ต้นทุนรวม = ราคาต้นทุน + ค่าใช้จ่ายอื่นๆ <br/>
                *อัตราค่าธรรมเนียมรวม = %ค่าคอมมิชชั่น + %ค่าธรรมเนียมอื่นๆ + %ค่าคอม Affiliate
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-2 flex items-center gap-2"><Percent className="text-primary"/>รายละเอียดค่าธรรมเนียมแต่ละแพลตฟอร์ม</h2>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="shopee">
                  <AccordionTrigger>Shopee</AccordionTrigger>
                  <AccordionContent>
                    <p className="font-semibold">ค่าธรรมเนียมของ Shopee ประกอบด้วย:</p>
                    <ul className="list-decimal list-inside space-y-2 mt-2 text-muted-foreground">
                        <li>
                            <span className="font-semibold text-foreground">ค่าธรรมเนียมการขาย (Commission Fee):</span> หักจากราคาขายที่ลดราคาแล้ว (ถ้ามี) อัตราแตกต่างกันไปในแต่ละหมวดหมู่สินค้า
                        </li>
                        <li>
                            <span className="font-semibold text-foreground">ค่าธรรมเนียมธุรกรรมการชำระเงิน (Transaction Fee):</span> หักจากยอดรวมที่ผู้ซื้อชำระ (รวมค่าขนส่ง) ผ่านทุกช่องทางการชำระเงิน <span className="font-bold">เครื่องมือของเรารวมค่าธรรมเนียมส่วนนี้เข้าไปในค่าคอมมิชชั่นหลักแล้ว (ประมาณ 3%*1.07)</span> เพื่อให้การคำนวณครอบคลุมมากที่สุด
                        </li>
                        <li>
                            <span className="font-semibold text-foreground">ราคานี้รวมภาษีมูลค่าเพิ่ม (VAT 7%) แล้ว</span>
                        </li>
                    </ul>
                    <p className="mt-2 text-xs text-muted-foreground">*หมายเหตุ: สำหรับการผ่อนชำระผ่านบัตรเครดิต/SPayLater จะมีค่าธรรมเนียมเพิ่มเติม ซึ่งจะแสดงแยกในผลการคำนวณ</p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="lazada">
                  <AccordionTrigger>Lazada</AccordionTrigger>
                  <AccordionContent>
                    <p className="font-semibold">ค่าธรรมเนียมของ Lazada ประกอบด้วย:</p>
                     <ul className="list-decimal list-inside space-y-2 mt-2 text-muted-foreground">
                        <li>
                            <span className="font-semibold text-foreground">ค่าธรรมเนียมมาร์เก็ตเพลส (Marketplace Fee):</span> หักจากราคาขายสินค้า อัตราสูงสุดแตกต่างกันไปในแต่ละหมวดหมู่ (เครื่องมือใช้เรทสูงสุดในการคำนวณ)
                        </li>
                        <li>
                            <span className="font-semibold text-foreground">ค่าธรรมเนียมการชำระเงิน (Payment Fee):</span> หักจากราคาขายสินค้าที่ 3%
                        </li>
                         <li>
                            <span className="font-semibold text-foreground">ราคานี้รวมภาษีมูลค่าเพิ่ม (VAT 7%) แล้ว</span> (เช่น 8% จะกลายเป็น 8.56%)
                        </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="tiktok">
                  <AccordionTrigger>TikTok Shop</AccordionTrigger>
                  <AccordionContent>
                     <p className="font-semibold">ค่าธรรมเนียมของ TikTok Shop ประกอบด้วย:</p>
                      <ul className="list-decimal list-inside space-y-2 mt-2 text-muted-foreground">
                        <li>
                            <span className="font-semibold text-foreground">ค่าคอมมิชชั่น (Commission Fee):</span> หักจากราคาขายของสินค้าหลังจากหักส่วนลดแล้ว อัตราแตกต่างกันในแต่ละหมวดหมู่
                        </li>
                        <li>
                            <span className="font-semibold text-foreground">ค่าธรรมเนียมคำสั่งซื้อ (Order Fee):</span> หรือที่เรียกว่าค่าธรรมเนียมคงที่ (Fixed Fee) หัก 3% จากราคาขายของสินค้าหลังจากหักส่วนลดแล้ว
                        </li>
                         <li>
                            <span className="font-semibold text-foreground">ราคานี้รวมภาษีมูลค่าเพิ่ม (VAT 7%) แล้ว</span>
                        </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </section>

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
