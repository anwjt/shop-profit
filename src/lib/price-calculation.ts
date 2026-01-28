
export const PLATFORM_FEES: { [key: string]: { [key: string]: { name: string, fee: number, orderFee?: number, paymentFee?: number } } } = {
  shopee: {
    'shopee-mobile': { name: 'โทรศัพท์มือถือ (Mobile Phones)', fee: 5.35, paymentFee: 3.21 },
    'shopee-tablet': { name: 'แท็บเล็ต (Tablets)', fee: 5.35, paymentFee: 3.21 },
    'shopee-computer': { name: 'คอมพิวเตอร์ / แล็ปท็อป (Laptops)', fee: 5.35, paymentFee: 3.21 },
    'shopee-large-appliance': { name: 'เครื่องใช้ไฟฟ้าใหญ่ (แอร์/ตู้เย็น/เครื่องซักผ้า)', fee: 5.89, paymentFee: 3.21 },
    'shopee-camera': { name: 'กล้องและโดรน (Cameras & Drones)', fee: 5.35, paymentFee: 3.21 },
    'shopee-console': { name: 'เครื่องเกมคอนโซล (Game Consoles)', fee: 5.35, paymentFee: 3.21 },
    'shopee-small-appliance': { name: 'เครื่องใช้ไฟฟ้าเล็ก (หม้อหุงข้าว/เตารีด/พัดลม)', fee: 6.96, paymentFee: 3.21 },
    'shopee-storage': { name: 'อุปกรณ์เก็บข้อมูล (Storage / Hard Disk)', fee: 8.56, paymentFee: 3.21 },
    'shopee-printer': { name: 'ปริ้นเตอร์และอุปกรณ์ (Printers)', fee: 8.56, paymentFee: 3.21 },
    'shopee-gadget': { name: 'อุปกรณ์เสริมมือถือ / Gadgets', fee: 8.56, paymentFee: 3.21 },
    'shopee-audio': { name: 'เครื่องเสียง / หูฟัง / ลำโพง', fee: 8.56, paymentFee: 3.21 },
    'shopee-monitor': { name: 'จอมอนิเตอร์ (Monitors)', fee: 8.56, paymentFee: 3.21 },
    'shopee-network': { name: 'อุปกรณ์เน็ตเวิร์ค (Network)', fee: 8.56, paymentFee: 3.21 },
    'shopee-fmcg': { name: 'สินค้าอุปโภคบริโภค (FMCG)', fee: 10.70, paymentFee: 3.21 },
    'shopee-home-living': { name: 'ของใช้ในบ้าน / เครื่องครัว', fee: 10.70, paymentFee: 3.21 },
    'shopee-beauty': { name: 'ความงาม / สกินแคร์ (Beauty)', fee: 10.70, paymentFee: 3.21 },
    'shopee-pet': { name: 'อุปกรณ์สัตว์เลี้ยง (Pet Supplies)', fee: 10.70, paymentFee: 3.21 },
    'shopee-toys': { name: 'ของเล่นและเกม (Toys & Games)', fee: 10.70, paymentFee: 3.21 },
    'shopee-automotive': { name: 'ยานยนต์และอุปกรณ์ (Automotive)', fee: 10.70, paymentFee: 3.21 },
    'shopee-tools': { name: 'ไดเอรื่องมือช่าง / อุปกรณ์สวน', fee: 10.70, paymentFee: 3.21 },
    'shopee-fashion': { name: 'แฟชั่น / เสื้อผ้า / รองเท้า / กระเป๋า', fee: 13.91, paymentFee: 3.21 },
    'shopee-wotch': { name: 'นาฬิกา / แว่นตา / เครื่องประดับ', fee: 13.91, paymentFee: 3.21 },
    'shopee-digital': { name: 'สินค้าดิจิทัล / บัตรเติมเงิน', fee: 13.91, paymentFee: 3.21 },
    'shopee-other': { name: 'สินค้าทั่วไป / อื่นๆ', fee: 13.91, paymentFee: 3.21 },
  },
  lazada: {
    'lazada-digital-goods': { name: 'สินค้าดิจิทัล (Digital Goods)', fee: 7.00, paymentFee: 3.21 },
    'lazada-mobile': { name: 'โทรศัพท์มือถือ (Mobile Phones)', fee: 5.35, paymentFee: 3.21 },
    'lazada-tablet': { name: 'แท็บเล็ต (Tablets)', fee: 7.49, paymentFee: 3.21 },
    'lazada-large-appliance': { name: 'เครื่องใช้ไฟฟ้าใหญ่ (แอร์/ตู้เย็น/เครื่องซักผ้า/ทีวี)', fee: 7.60, paymentFee: 3.21 },
    'lazada-small-appliance': { name: 'เครื่องใช้ไฟฟ้าเล็ก (หม้อหุงข้าว/เตารีด/พัดลม)', fee: 8.56, paymentFee: 3.21 },
    'lazada-computer': { name: 'คอมพิวเตอร์ / แล็ปท็อป (Laptops)', fee: 8.56, paymentFee: 3.21 },
    'lazada-camera': { name: 'กล้องและโดรน (Cameras & Drones)', fee: 8.56, paymentFee: 3.21 },
    'lazada-gadget': { name: 'Smartwatch / อุปกรณ์เสริมมือถือ (Gadgets)', fee: 9.63, paymentFee: 3.21 },
    'lazada-console': { name: 'เครื่องเกมคอนโซล (Game Consoles)', fee: 9.63, paymentFee: 3.21 },
    'lazada-audio': { name: 'เครื่องเสียง / ลำโพง / หูฟัง', fee: 9.63, paymentFee: 3.21 },
    'lazada-storage': { name: 'อุปกรณ์เก็บข้อมูล (Storage / Hard Disk)', fee: 9.63, paymentFee: 3.21 },
    'lazada-monitor': { name: 'จอมอนิเตอร์ / ปริ้นเตอร์', fee: 9.63, paymentFee: 3.21 },
    'lazada-fmcg-general': { name: 'สินค้าอุปโภคบริโภค (FMCG)', fee: 10.90, paymentFee: 3.21 },
    'lazada-beauty': { name: 'ความงาม / สกินแคร์ (Beauty)', fee: 10.90, paymentFee: 3.21 },
    'lazada-wotch': { name: 'นาฬิกา / แว่นตา (Watches & Sunglasses)', fee: 10.90, paymentFee: 3.21 },
    'lazada-pet': { name: 'อุปกรณ์สัตว์เลี้ยง (Pet Supplies)', fee: 10.90, paymentFee: 3.21 },
    'lazada-home-living': { name: 'ของใช้ในบ้าน / เครื่องครัว / เฟอร์นิเจอร์', fee: 10.90, paymentFee: 3.21 },
    'lazada-tools': { name: 'เครื่องมือช่าง / อุปกรณ์สวน', fee: 10.90, paymentFee: 3.21 },
    'lazada-toys': { name: 'ของเล่นและเกม (Toys & Games)', fee: 10.90, paymentFee: 3.21 },
    'lazada-automotive': { name: 'ยานยนต์และอุปกรณ์ (Automotive)', fee: 10.90, paymentFee: 3.21 },
    'lazada-sport': { name: 'กีฬาและกิจกรรมกลางแจ้ง', fee: 10.90, paymentFee: 3.21 },
    'lazada-fashion': { name: 'แฟชั่น / เสื้อผ้า / รองเท้า / กระเป๋า', fee: 11.60, paymentFee: 3.21 },
    'lazada-other': { name: 'สินค้าทั่วไป / อื่นๆ', fee: 11.60, paymentFee: 3.21 },
  },
  'tiktok shop': {
    'fashion': { name: 'สินค้าแฟชั่น', fee: 6.42, orderFee: 3.21 },
    'electronics': { name: 'สินค้าอิเล็กทรอนิกส์', fee: 5.35, orderFee: 3.21 },
    'lifestyle': { name: 'สินค้าไลฟ์สไตล์', fee: 5.35, orderFee: 3.21 },
  },
};

export const SHOPEE_EXTRA_FEES = {
  creditCard: 0.06 * 1.07,
  spayLater: 0.06 * 1.07,
};

export const SHOPEE_INFRA_FEE = 1.07;

export interface CalculationInput {
  platform: string;
  category: string;
  cost: number;
  otherCosts?: { value: number }[];
  profitMargin?: number;
  profitAmount?: number; // Added to allow fixed profit amount
  discount?: number;
  affiliateCommission?: number;
}

export type CalculationResult = {
  sellingPrice: number;
  platformFeeAmount: number;
  profit: number;
  commissionAmount: number;
  orderFeeAmount: number;
  paymentFeeAmount: number;
  affiliateCommissionAmount: number;
  otherCosts: number;
  platform: string;
  commissionPercent: number;
  orderFeePercent: number;
  paymentFeePercent: number;
  priceForFeeCalculation: number;
  discount: number;
  shopeeCreditCardPrice: number;
  shopeeSPayLaterPrice: number;
  totalCost: number;
};

const calculateSellingPriceInternal = (baseCost: number, profitAmount: number, discount: number, feeRate: number, fixedFee: number = 0): number => {
  const numerator = baseCost + profitAmount + discount + fixedFee;
  const denominator = 1 - feeRate;
  if (denominator <= 0) return Infinity;
  return numerator / denominator;
}

export const calculatePrice = (values: CalculationInput): CalculationResult | null => {
  const { cost, profitMargin = 0, profitAmount: fixedProfitAmount, otherCosts = [], platform, category, discount = 0, affiliateCommission = 0 } = values;

  if (!platform || !category || !PLATFORM_FEES[platform] || !PLATFORM_FEES[platform][category]) {
    return null;
  }

  const platformCategoryData = PLATFORM_FEES[platform][category];
  const commissionPercent = platformCategoryData.fee;
  const orderFeePercent = platformCategoryData.orderFee || 0;
  const paymentFeePercent = platformCategoryData.paymentFee || 0;

  const totalOtherCosts = otherCosts.reduce((sum, current) => sum + (current.value || 0), 0);
  const totalCost = cost + totalOtherCosts;

  // Use fixed profit amount if provided, otherwise calculate from margin
  const profitAmount = fixedProfitAmount !== undefined ? fixedProfitAmount : (cost * profitMargin) / 100;

  const platformFeeRate = (commissionPercent + orderFeePercent + paymentFeePercent) / 100;
  const affiliateRate = affiliateCommission / 100;
  const totalFeeRate = platformFeeRate + affiliateRate;

  let shopeePrices: { shopeeCreditCardPrice: number, shopeeSPayLaterPrice: number } = {
    shopeeCreditCardPrice: 0,
    shopeeSPayLaterPrice: 0,
  };

  let fixedFee = 0;

  if (platform === 'shopee') {
    fixedFee = SHOPEE_INFRA_FEE;
  }

  const sellingPrice = calculateSellingPriceInternal(totalCost, profitAmount, discount, totalFeeRate, fixedFee);

  if (sellingPrice === Infinity) {
    return null;
  }

  const priceForFeeCalculation = sellingPrice - discount;
  const commissionAmount = priceForFeeCalculation * (commissionPercent / 100);
  const orderFeeAmount = priceForFeeCalculation * (orderFeePercent / 100);
  const paymentFeeAmount = priceForFeeCalculation * (paymentFeePercent / 100);

  const totalPlatformFee = commissionAmount + orderFeeAmount + paymentFeeAmount + fixedFee;
  const affiliateCommissionAmount = sellingPrice * affiliateRate;

  const finalProfit = sellingPrice - discount - totalCost - totalPlatformFee - affiliateCommissionAmount;

  if (platform === 'shopee') {
    const baseCommission = PLATFORM_FEES[platform][category].fee - (3 * 1.07);
    const baseFeeRate = (baseCommission / 100) + affiliateRate;

    const creditCardFeeRate = baseFeeRate + SHOPEE_EXTRA_FEES.creditCard;
    const spayLaterFeeRate = baseFeeRate + SHOPEE_EXTRA_FEES.spayLater;

    shopeePrices.shopeeCreditCardPrice = calculateSellingPriceInternal(totalCost, profitAmount, discount, creditCardFeeRate, fixedFee);
    shopeePrices.shopeeSPayLaterPrice = calculateSellingPriceInternal(totalCost, profitAmount, discount, spayLaterFeeRate, fixedFee);
  }

  return {
    sellingPrice,
    platformFeeAmount: totalPlatformFee,
    profit: finalProfit,
    commissionAmount,
    orderFeeAmount,
    paymentFeeAmount,
    affiliateCommissionAmount,
    otherCosts: totalOtherCosts,
    platform,
    commissionPercent,
    orderFeePercent,
    paymentFeePercent,
    priceForFeeCalculation,
    discount,
    totalCost,
    ...shopeePrices,
  };
};

export const getPlatformCategories = () => {
  return Object.keys(PLATFORM_FEES).reduce((acc, platform) => {
    acc[platform] = Object.keys(PLATFORM_FEES[platform]).map(catId => {
      const category = PLATFORM_FEES[platform][catId];
      const fee = category.fee || 0;
      const paymentFee = category.paymentFee || 0;
      const orderFee = category.orderFee || 0;
      const totalFee = fee + orderFee + paymentFee;

      let breakdown = `${fee.toFixed(2)}% + ${paymentFee.toFixed(2)}%`;
      if (orderFee > 0) breakdown += ` + ${orderFee.toFixed(2)}%`;

      return {
        id: catId,
        name: `${category.name} (รวม ${totalFee.toFixed(2)}% [${breakdown}])`
      }
    });
    return acc;
  }, {} as { [key: string]: { id: string, name: string }[] });
}

export const formatPrice = (price: number | undefined) => {
  if (typeof price !== 'number') return '0.00';
  return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

export const getPsychologicalPrice = (price: number | undefined) => {
  if (typeof price !== 'number' || price <= 0) return 0;
  const roundedPrice = Math.floor(price);
  const lastDigit = roundedPrice % 10;

  if (lastDigit < 5) {
    return roundedPrice - lastDigit - 1;
  } else {
    return roundedPrice - lastDigit + 9;
  }
}


