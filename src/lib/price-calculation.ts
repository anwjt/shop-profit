
export const PLATFORM_FEES: { [key: string]: { [key: string]: { name: string, fee: number, orderFee?: number, paymentFee?: number } } } = {
    shopee: {
      'electronics': { name: 'สินค้าอิเล็กทรอนิกส์', fee: 8.56 + (3*1.07) },
      'fashion': { name: 'สินค้าแฟชั่น', fee: 9.63 + (3*1.07) },
      'lifestyle': { name: 'สินค้าไลฟ์สไตล์', fee: 8.025 + (3*1.07) },
      'other': { name: 'สินค้าทั่วไป (นอกกลุ่มอิเล็กทรอนิกส์)', fee: 8.56 + (3*1.07) },
    },
    lazada: {
      'electronics': { name: 'สินค้าอิเล็กทรอนิกส์ (สูงสุด)', fee: 8.0 * 1.07, paymentFee: 3.0 * 1.07 },
      'general': { name: 'สินค้าทั่วไป (สูงสุด)', fee: 8.0 * 1.07, paymentFee: 3.0 * 1.07 },
      'fashion': { name: 'สินค้าแฟชั่น (สูงสุด)', fee: 9.0 * 1.07, paymentFee: 3.0 * 1.07 },
      'fmcg': { name: 'สินค้าอุปโภคบริโภค', fee: 8.0 * 1.07, paymentFee: 3.0 * 1.07 },
      'digital': { name: 'บัตรกำนัลดิจิทัล', fee: 7.0 * 1.07, paymentFee: 3.0 * 1.07 },
    },
    tiktok: {
      'fashion': { name: 'สินค้าแฟชั่น', fee: 6.42, orderFee: 3.21 },
      'electronics': { name: 'สินค้าอิเล็กทรอนิกส์', fee: 5.35, orderFee: 3.21 },
      'lifestyle': { name: 'สินค้าไลฟ์สไตล์', fee: 5.35, orderFee: 3.21 },
    },
  };
  
  export const SHOPEE_EXTRA_FEES = {
    creditCard: 0.06 * 1.07,
    spayLater: 0.06 * 1.07,
  };
  
  export interface CalculationInput {
    platform: string;
    category: string;
    cost: number;
    otherCosts?: { value: number }[];
    profitMargin?: number;
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
    shopeeCreditCardPrice?: number;
    shopeeSPayLaterPrice?: number;
    totalCost: number;
  };
  
  const calculateSellingPriceInternal = (baseCost: number, profitAmount: number, discount: number, feeRate: number): number => {
    // This is the core formula to determine the selling price
    const numerator = baseCost + profitAmount + discount;
    const denominator = 1 - feeRate;
    if (denominator <= 0) return Infinity; // Avoid division by zero or negative
    
    // Simplified: Price = (Costs + Profit + Discount) / (1 - TotalFeeRate)
    // Why add discount to numerator? Because fees are calculated on (Price - Discount)
    // So we need to inflate the price to cover the fee loss from the discount.
    return numerator / denominator;
  }
  
  export const calculatePrice = (values: CalculationInput): CalculationResult | null => {
    const { cost, profitMargin = 0, otherCosts = [], platform, category, discount = 0, affiliateCommission = 0 } = values;
  
    if (!platform || !category || !PLATFORM_FEES[platform] || !PLATFORM_FEES[platform][category]) {
      return null;
    }
  
    const platformCategoryData = PLATFORM_FEES[platform][category];
    const commissionPercent = platformCategoryData.fee;
    const orderFeePercent = platformCategoryData.orderFee || 0;
    const paymentFeePercent = platformCategoryData.paymentFee || 0;
  
    const totalOtherCosts = otherCosts.reduce((sum, current) => sum + (current.value || 0), 0);
    const totalCost = cost + totalOtherCosts;
    const profitAmount = (cost * profitMargin) / 100;
  
    const platformFeeRate = (commissionPercent + orderFeePercent + paymentFeePercent) / 100;
    const affiliateRate = affiliateCommission / 100;
    const totalFeeRate = platformFeeRate + affiliateRate;
  
    const sellingPrice = calculateSellingPriceInternal(totalCost, profitAmount, discount, totalFeeRate);
  
    if (sellingPrice === Infinity) {
      return null;
    }
  
    const priceForFeeCalculation = sellingPrice - discount;
    const commissionAmount = priceForFeeCalculation * (commissionPercent / 100);
    const orderFeeAmount = priceForFeeCalculation * (orderFeePercent / 100);
    const paymentFeeAmount = priceForFeeCalculation * (paymentFeePercent / 100);
  
    const totalPlatformFee = commissionAmount + orderFeeAmount + paymentFeeAmount;
    const affiliateCommissionAmount = sellingPrice * affiliateRate;
  
    const finalProfit = sellingPrice - discount - totalCost - totalPlatformFee - affiliateCommissionAmount;
  
    let shopeePrices: { shopeeCreditCardPrice?: number, shopeeSPayLaterPrice?: number } = {};
    if (platform === 'shopee') {
      const baseCommission = PLATFORM_FEES[platform][category].fee - (3*1.07);
      const baseFeeRate = (baseCommission / 100) + affiliateRate;
      
      const creditCardFeeRate = baseFeeRate + SHOPEE_EXTRA_FEES.creditCard;
      const spayLaterFeeRate = baseFeeRate + SHOPEE_EXTRA_FEES.spayLater;
  
      shopeePrices.shopeeCreditCardPrice = calculateSellingPriceInternal(totalCost, profitAmount, discount, creditCardFeeRate);
      shopeePrices.shopeeSPayLaterPrice = calculateSellingPriceInternal(totalCost, profitAmount, discount, spayLaterFeeRate);
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
        acc[platform] = Object.keys(PLATFORM_FEES[platform]).map(catId => ({
            id: catId,
            name: PLATFORM_FEES[platform][catId].name
        }));
        return acc;
    }, {} as {[key: string]: {id: string, name: string}[]});
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
