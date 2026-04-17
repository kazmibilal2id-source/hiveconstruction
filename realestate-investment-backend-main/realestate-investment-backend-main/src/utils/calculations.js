const calculateProfit = (investment, saleOrMarketValue, propertyTotalCost, totalInvestedByAllInvestors) => {
  if (!investment || !saleOrMarketValue || !propertyTotalCost || !totalInvestedByAllInvestors) {
    return 0;
  }

  const totalProfit = saleOrMarketValue - propertyTotalCost;
  const investorsPool = totalProfit * 0.75;
  const shareRatio = investment.amount / totalInvestedByAllInvestors;
  return investorsPool * shareRatio;
};

const calculateProfitDistribution = ({ salePrice, totalPropertyCost, investments }) => {
  const totalInvestedByAllInvestors = investments.reduce((sum, item) => sum + item.amount, 0);
  const totalProfit = salePrice - totalPropertyCost;
  const hiveShare = totalProfit * 0.25;
  const investorsPool = totalProfit * 0.75;

  const investorBreakdown = investments.map((investment) => {
    const shareRatio = totalInvestedByAllInvestors ? investment.amount / totalInvestedByAllInvestors : 0;
    const profit = investorsPool * shareRatio;

    return {
      investmentId: investment._id,
      investorId: investment.investorId,
      amount: investment.amount,
      shareRatio,
      profit,
      payout: investment.amount + Math.max(profit, 0)
    };
  });

  return {
    totalProfit,
    hiveShare,
    investorsPool,
    totalInvestedByAllInvestors,
    investorBreakdown
  };
};

function calculateInvestorReturn(investment, property, currentMarketValue, totalInvestedByAllInvestors) {
  const today = new Date();
  const oneYear = new Date(investment.investmentDate);
  oneYear.setFullYear(oneYear.getFullYear() + 1);

  if (property.status === "sold" && property.salePrice < property.totalCost) {
    return investment.amount;
  }

  if (property.status === "sold" && property.soldDate <= oneYear) {
    return investment.amount + calculateProfit(investment, property.salePrice, property.totalCost, totalInvestedByAllInvestors);
  } else if (property.status !== "sold" && today > oneYear) {
    return (
      investment.amount +
      calculateProfit(investment, currentMarketValue, property.totalCost, totalInvestedByAllInvestors)
    );
  } else if (investment.status === "withdrawn") {
    return investment.amount;
  } else if (property.status === "sold" && property.salePrice < property.totalCost) {
    return investment.amount;
  }

  return investment.amount;
}

module.exports = {
  calculateProfit,
  calculateProfitDistribution,
  calculateInvestorReturn
};
