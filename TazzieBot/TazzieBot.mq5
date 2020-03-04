//+------------------------------------------------------------------+
//|                                                    TazzieBot.mq5 |
//|                        Copyright 2020, JMRSquared Software Corp. |
//|                                           https://jmrsquared.com |
//+------------------------------------------------------------------+
#property copyright "Copyright 2020, JMRSquared Software Corp."
#property link      "https://jmrsquared.com"
#property version   "1.00"

input double volume=0.01;
input double stop_loss=100;
input double take_profit=100;

#include<Trade\Trade.mqh>
CTrade trade;

//+------------------------------------------------------------------+
//|                                                                  |
//+------------------------------------------------------------------+
void OnTick()
  {

   double Balance=AccountInfoDouble(ACCOUNT_BALANCE);
   double Equity=AccountInfoDouble(ACCOUNT_EQUITY);

   double myMovingAverageArray1[];
   double myMovingAverageArray2[];

   int movingAverageDefinition1 = iMA(_Symbol,_Period,20,0,MODE_EMA,PRICE_CLOSE);
   int movingAverageDefinition2 = iMA(_Symbol,_Period,50,0,MODE_EMA,PRICE_CLOSE);
   ArraySetAsSeries(myMovingAverageArray1,true);
   ArraySetAsSeries(myMovingAverageArray2,true);

   CopyBuffer(movingAverageDefinition1,0,0,3,myMovingAverageArray1);

   CopyBuffer(movingAverageDefinition2,0,0,3,myMovingAverageArray2);

   if(myMovingAverageArray1[0]>myMovingAverageArray2[0] && myMovingAverageArray1[1]>myMovingAverageArray2[1])
     {
      if(Equity >= Balance && PositionsTotal() == 0)
        {
         Comment("Buy");
         double Ask=NormalizeDouble(SymbolInfoDouble(_Symbol,SYMBOL_ASK),_Digits);
         CheckforBreakEven(Ask); 
         trade.Buy(volume,_Symbol,Ask,Ask-stop_loss*_Point,Ask+take_profit*_Point,NULL);
        }
     }

   if(myMovingAverageArray1[0]<myMovingAverageArray2[0] && myMovingAverageArray1[1]<myMovingAverageArray2[1])
     {
      if(Equity > Balance&& PositionsTotal() == 0)
        {
         Comment("Sell");
         double Bid=NormalizeDouble(SymbolInfoDouble(_Symbol,SYMBOL_BID),_Digits);
         trade.Buy(volume,_Symbol,Bid,Bid+stop_loss*_Point,Bid-take_profit*_Point,NULL);
        }
     }
  }
  
  void CheckforBreakEven(double Ask){
      for(int i = PositionsTotal()-1;i>=0;i--){
         ulong positionTicket = PositionGetInteger(POSITION_TICKET);
         double positionBuyPrice = PositionGetDouble(POSITION_PRICE_OPEN);
         double positionStopLoss = PositionGetDouble(POSITION_SL);
         double positionTakeProfit = PositionGetDouble(POSITION_TP);
         
      }
  }
  
  
