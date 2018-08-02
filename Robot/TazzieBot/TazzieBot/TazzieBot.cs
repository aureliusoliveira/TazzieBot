using System;
using System.Linq;
using cAlgo.API;
using cAlgo.API.Indicators;
using cAlgo.API.Internals;
using cAlgo.Indicators;
using System.Collections.Generic;

namespace cAlgo
{

    [Robot(TimeZone = TimeZones.UTC, AccessRights = AccessRights.None)]
    public class TazzieBot : Robot
    {
        public TazzieBotSuperProfit superProfit { get; set; }
        private const double PIPS = 300;
        private double Volume = 0;
        private const int MAXPOSITIONS = 6;
        private bool isLooping = false;

        protected override void OnStart()
        {
            Volume = Symbol.QuantityToVolumeInUnits(PIPS / 100);
            superProfit = Indicators.GetIndicator<TazzieBotSuperProfit>(20, 2.7, MovingAverageType.Weighted, MarketSeries.Close, Account.Equity);
            Print("Time to calculate from indicator, Spread : " + Symbol.Spread);
        }

        protected override void OnError(Error error)
        {
            Print("Error : " + error.Code);
        }

        protected override void OnBar()
        {
            superProfit.CurrentBalance = Account.Equity;
        }

        protected override void OnTick()
        {
            if (superProfit.Entry.Count == 0 || isLooping || !Symbol.MarketHours.IsOpened())
            {
                return;
            }

            var now = DateTime.Now;

            Positions.ToList().ForEach(pos =>
            {
                if (now.Subtract(pos.EntryTime).TotalHours > 24 && pos.Pips > PIPS)
                {
                    ClosePosition(pos);
                }
            });

            if (superProfit.profitPositions.Count > 0)
            {
                isLooping = true;
                var positions = superProfit.profitPositions;

                foreach (var position in positions)
                {
                    if (now.Subtract(position.DateTime).TotalHours > 24)
                    {
                        Print("Late signal " + position.ToString());
                        continue;
                    }

                    if (((position.entryPrice > position.takeProfit || position.entryPrice < position.stopLoss) && position.type == TradeType.Buy) || ((position.entryPrice < position.takeProfit || position.entryPrice > position.stopLoss) && position.type == TradeType.Sell))
                    {
                        Print("Fails signal " + position.ToString());
                        continue;
                    }

                    Positions.Where(p => p.TradeType != position.type && p.Pips >= PIPS).ToList().ForEach(pos =>
                    {
                        Print("Floating pips => " + pos.Pips);
                        ClosePosition(pos);
                    });

                    var lastLoss = Positions.Where(p => p.TradeType == position.type).LastOrDefault();
                    if (lastLoss == null)
                    {
                        if (Positions.Count <= MAXPOSITIONS)
                        {
                            var result = ExecuteMarketOrder(position.type, Symbol, Volume, position.ToString(), null, Math.Round((double)position.takeProfit));
                        }
                    }
                    else
                    {
                        if (lastLoss.Pips < 0)
                        {
                            if (position.type == TradeType.Buy)
                            {
                                if (position.stopLoss < Symbol.Bid && position.takeProfit > Symbol.Bid)
                                {
                                    ModifyPosition(lastLoss, position.stopLoss, position.takeProfit);
                                }
                                else
                                {
                                    Print("Trying to buy too late .... buying at " + Symbol.Bid + " from signal : " + position.ToString());
                                }
                            }

                            if (position.type == TradeType.Sell)
                            {
                                if (position.stopLoss > Symbol.Ask && position.takeProfit < Symbol.Ask)
                                {
                                    ModifyPosition(lastLoss, position.stopLoss, position.takeProfit);
                                }
                                else
                                {
                                    Print("Trying to sell too late .... selling at " + Symbol.Bid + " from signal : " + position.ToString());
                                }
                            }
                        }
                        else if (lastLoss.Pips >= PIPS)
                        {
                            ClosePosition(lastLoss);
                            if (Positions.Count <= MAXPOSITIONS)
                            {
                                var result = ExecuteMarketOrder(position.type, Symbol, Volume, position.ToString(), Math.Round((double)position.stopLoss), Math.Round((double)position.takeProfit));
                            }
                        }
                    }
                }
                superProfit.profitPositions.Clear();
                isLooping = false;
            }
        }

        protected override void OnStop()
        {
            Print("Stop was called");

            double volume = 0;
            Positions.ToList().ForEach(pos =>
            {
                if (pos.Pips >= PIPS)
                {
                    ClosePosition(pos);
                }

                if (pos.TradeType == TradeType.Buy)
                {
                    volume = pos.EntryPrice + (((-1 * pos.Pips) - (pos.Pips / 2)) * Symbol.PipValue);
                }
                else
                {
                    volume = pos.EntryPrice - (((-1 * pos.Pips) - (pos.Pips / 2)) * Symbol.PipValue);
                }

                //  var result = ModifyPosition(pos, null, volume);

            });

        }
    }
}
