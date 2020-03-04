//+------------------------------------------------------------------+
//|                                                    TazzieBot.mq5 |
//|                        Copyright 2020, JMRSquared Software Corp. |
//|                                           https://jmrsquared.com |
//+------------------------------------------------------------------+
#property copyright "Copyright 2020, JMRSquared Software Corp."
#property link      "https://jmrsquared.com"
#property version   "1.00"

input double volume=0.01;
input double sl=1000.0;
input double stop_loss=1000.0;
input double take_profit=400.0;
input double acceptable_profit=5;

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

   double Ask=NormalizeDouble(SymbolInfoDouble(_Symbol,SYMBOL_ASK),_Digits);
   double Bid=NormalizeDouble(SymbolInfoDouble(_Symbol,SYMBOL_BID),_Digits);

   double bid_take_profit = Bid-take_profit*_Point;
   double bid_stop_loss = Bid+stop_loss*_Point;
   double ask_take_profit = Ask+take_profit*_Point;
   double ask_stop_loss = Ask-stop_loss*_Point;

   int movingAverageDefinition1 = iMA(_Symbol,_Period,20,0,MODE_EMA,PRICE_CLOSE);
   int movingAverageDefinition2 = iMA(_Symbol,_Period,50,0,MODE_EMA,PRICE_CLOSE);
   ArraySetAsSeries(myMovingAverageArray1,true);
   ArraySetAsSeries(myMovingAverageArray2,true);

   CopyBuffer(movingAverageDefinition1,0,0,3,myMovingAverageArray1);

   CopyBuffer(movingAverageDefinition2,0,0,3,myMovingAverageArray2);


   if(myMovingAverageArray1[0]>myMovingAverageArray2[0] && myMovingAverageArray1[1]<myMovingAverageArray2[1])
     {
      Comment("Buy");
      CheckforBreakEvenBuy(Ask);
      if(Equity >= Balance && PositionsTotal() == 0)
        {
         trade.Buy(volume,NULL,Ask,ask_stop_loss,ask_take_profit,NULL);
        }
     }

   if(myMovingAverageArray1[0]<myMovingAverageArray2[0] && myMovingAverageArray1[1]>myMovingAverageArray2[1])
     {
      Comment("Sell");
      CheckforBreakEvenSell(Bid);
      if(Equity >= Balance&& PositionsTotal() == 0)
        {
         trade.Sell(volume,NULL,Bid,bid_stop_loss,bid_take_profit,NULL);
        }
     }
  }

//+------------------------------------------------------------------+
//|                                                                  |
//+------------------------------------------------------------------+
void CheckforBreakEvenBuy(double price)
  {
   for(int i = PositionsTotal()-1; i>=0; i--)
     {
      ulong positionTicket = PositionGetInteger(POSITION_TICKET);
      double positionOpenPrice = PositionGetDouble(POSITION_PRICE_OPEN);
      double positionStopLoss = PositionGetDouble(POSITION_SL);
      double positionTakeProfit = PositionGetDouble(POSITION_TP);
      double positionType = PositionGetInteger(POSITION_TYPE);
      double profit = PositionGetDouble(POSITION_PROFIT);

      string symbol = PositionGetSymbol(i);
      if(_Symbol == symbol)
        {
         if(positionType == POSITION_TYPE_BUY && positionTakeProfit > 0 && positionStopLoss > 0 && price > (positionStopLoss+(8)*_Point) && price > (positionOpenPrice+(8)*_Point))
           {
            double newTP = positionTakeProfit;
            double newSL = positionStopLoss+(4)*_Point;
            if(newSL <  (positionOpenPrice+(4)*_Point)){
               newSL = positionOpenPrice+(4)*_Point;
            }
            while(newSL > newTP){
               newTP = positionTakeProfit+(4)*_Point;
            }
            trade.PositionModify(positionTicket,newSL,newTP);
            Print(positionTicket + " We have adjusted a buy position :(price) " + price + " (tp__): " + positionTakeProfit + " (sl__): " + positionStopLoss);
            Print(positionTicket + " We have adjusted a buy position :(price) " + price + " (tp): " + newTP + " (sl): " + newSL);
           } else if(profit >= acceptable_profit)
           {
            trade.PositionClose(positionTicket);
            Print("We reached our target and closed with profit " + profit);
           }
        }
     }
  }

//+------------------------------------------------------------------+
//|                                                                  |
//+------------------------------------------------------------------+
void CheckforBreakEvenSell(double price)
  {
   for(int i = PositionsTotal()-1; i>=0; i--)
     {
    ulong positionTicket = PositionGetInteger(POSITION_TICKET);
      double positionOpenPrice = PositionGetDouble(POSITION_PRICE_OPEN);
      double positionStopLoss = PositionGetDouble(POSITION_SL);
      double positionTakeProfit = PositionGetDouble(POSITION_TP);
      double positionType = PositionGetInteger(POSITION_TYPE);
      double profit = PositionGetDouble(POSITION_PROFIT);

      string symbol = PositionGetSymbol(i);
      if(_Symbol == symbol)
        {
         if(positionType == POSITION_TYPE_SELL && positionTakeProfit > 0 && positionStopLoss > 0 && price < (positionStopLoss-(8)*_Point) && price < (positionOpenPrice-(8)*_Point))
           {
            double newTP = positionTakeProfit;
            double newSL = positionStopLoss-(4)*_Point;
            if(newSL >  (positionOpenPrice-(4)*_Point)){
               newSL = positionOpenPrice-(4)*_Point;
            }
            while(newSL < newTP){
               newTP = positionTakeProfit-(4)*_Point;
            }
            trade.PositionModify(positionTicket,newSL,newTP);
           } else if(profit >= acceptable_profit)
           {
            trade.PositionClose(positionTicket);
            Print("We reached our target and closed with profit " + profit);
           }
        }
     }
  }
//+------------------------------------------------------------------+
