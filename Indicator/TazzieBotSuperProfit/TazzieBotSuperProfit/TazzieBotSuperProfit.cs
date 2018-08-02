using System;
using cAlgo.API;
using System.Runtime.InteropServices;
using cAlgo.API.Indicators;
using System.Collections.Generic;
using cAlgo.API.Internals;
using System.Diagnostics;

namespace cAlgo.Indicators
{
    [Indicator(IsOverlay = true, TimeZone = TimeZones.UTC, AccessRights = AccessRights.FullAccess)]
    public class TazzieBotSuperProfit : Indicator
    {
        [Parameter(DefaultValue = 35)]
        public int DllPeriod { get; set; }

        [Parameter(DefaultValue = 1.7)]
        public double Period { get; set; }

        [Parameter(DefaultValue = MovingAverageType.Weighted)]
        public MovingAverageType MaType { get; set; }

        [Parameter()]
        public DataSeries Price { get; set; }

        private double StopLoss { get; set; }

        private double TakeProfit { get; set; }

        [Parameter(DefaultValue = 100)]
        public double CurrentBalance { get; set; }

        [Output("Up", PlotType = PlotType.Points, Thickness = 3)]
        public IndicatorDataSeries UpSeries { get; set; }

        [Output("Down", PlotType = PlotType.Points, Color = Colors.Red, Thickness = 3)]
        public IndicatorDataSeries DownSeries { get; set; }

        [Output("Entry", Color = Colors.White, Thickness = 4)]
        public IndicatorDataSeries Entry { get; set; }

        [Output("TP", Color = Colors.Green, Thickness = 4, LineStyle = LineStyle.Solid, PlotType = PlotType.Line)]
        public IndicatorDataSeries TP { get; set; }

        [Output("SL", Color = Colors.Red, Thickness = 4)]
        public IndicatorDataSeries SL { get; set; }

        [Output("Data Series", Color = Colors.Blue, Thickness = 2)]
        public IndicatorDataSeries _dataSeries { get; set; }

        [Output("Trend", Color = Colors.Purple, Thickness = 2)]
        public IndicatorDataSeries _trend { get; set; }

        [Output("Positions")]
        public List<ProfitPosition> profitPositions { get; set; }

        public bool isPlacePosition { get; set; }
        private bool buyPosition { get; set; }
        private bool sellPosition { get; set; }

        public class ProfitPosition
        {
            public TradeType type { get; set; }
            public string label { get; set; }
            public Symbol symbol { get; set; }
            public double entryPrice { get; set; }
            public double? stopLoss { get; set; }
            public double? takeProfit { get; set; }
            public DateTime DateTime { get; set; }
            public ProfitPosition(string type, Symbol symbol, double? stopLoss, double? takeProfit, double entryPrice, string label = "None")
            {
                this.type = type.Contains("Buy") ? TradeType.Buy : TradeType.Sell;
                this.symbol = symbol;
                this.stopLoss = stopLoss;
                this.takeProfit = takeProfit;
                this.entryPrice = entryPrice;
                this.label = label == "None" ? DateTime.Now.ToString() : label;
                DateTime = DateTime.Now;
            }

            public override string ToString()
            {
                return symbol.Code + " " + type + "   Price : " + entryPrice + " , TP : " + takeProfit + " , SL : " + stopLoss;
            }
        }

        private DateTime _openTime;

        private MovingAverage _movingAverage1;
        private MovingAverage _movingAverage2;
        private MovingAverage _movingAverage3;

        protected override void Initialize()
        {
            Print("Started super Profit indicator, Time frame " + MarketSeries.TimeFrame.ToString() + " \r\n " + Symbol);
            profitPositions = new List<ProfitPosition>();

            try
            {
                //p.Start();
                new System.Threading.Thread(() =>
                {
                    Process p = new Process();
                    p.StartInfo.FileName = "WriteSignalToMongo/WriteSignalToMongo";
                    string args = "0" + " BUY " + Symbol.Code + " 1250.0 1270.0 1280.0 1249.0 " + DateTime.Now;
                    p.StartInfo.Arguments = args;
                }).Start();

            } catch (Exception ex)
            {
                Print("ERROR : " + ex.Message);
            }

            //Set the take profit and stop loss
            TakeProfit = 100 * Symbol.PipSize;
            StopLoss = 400 * Symbol.PipSize;

            _dataSeries = CreateDataSeries();
            _trend = CreateDataSeries();

            var period1 = (int)Math.Floor(DllPeriod / Period);
            var period2 = (int)Math.Floor(Math.Sqrt(DllPeriod));

            _movingAverage1 = Indicators.MovingAverage(Price, period1, MaType);
            _movingAverage2 = Indicators.MovingAverage(Price, DllPeriod, MaType);
            _movingAverage3 = Indicators.MovingAverage(_dataSeries, period2, MaType);
            RefreshData();
        }

        public override void Calculate(int index)
        {
            if (index < 1)
                return;

            _dataSeries[index] = 2.0 * _movingAverage1.Result[index] - _movingAverage2.Result[index];
            _trend[index] = _trend[index - 1];

            if (_movingAverage3.Result[index] > _movingAverage3.Result[index - 1])
                _trend[index] = 1;
            else if (_movingAverage3.Result[index] < _movingAverage3.Result[index - 1])
                _trend[index] = -1;

            if (_trend[index] > 0)
            {
                UpSeries[index] = _movingAverage3.Result[index];

                if (_trend[index - 1] < 0.0)
                {
                    UpSeries[index - 1] = _movingAverage3.Result[index - 1];
                    if (IsLastBar)
                    {
                        var stopLoss = MarketSeries.Low[index - 1] - StopLoss * Symbol.PipSize;
                        var takeProfit = MarketSeries.Close[index] + TakeProfit * Symbol.PipSize;
                        var entryPrice = MarketSeries.Close[index - 1];

                        if (MarketSeries.OpenTime[index] != _openTime)
                        {
                            if (entryPrice <= takeProfit && entryPrice >= stopLoss)
                            {
                                buyPosition = true;

                                _openTime = MarketSeries.OpenTime[index];

                                stopLoss += StopLoss;

                                Entry[index] = entryPrice;
                                TP[index] = takeProfit;
                                SL[index] = stopLoss;

                                //isPlacePosition = true;
                                profitPositions.Add(new ProfitPosition("Buy", Symbol, stopLoss, takeProfit, entryPrice));
                                DisplayAlert("Buy signal", takeProfit, stopLoss, entryPrice);

                                ChartObjects.DrawHorizontalLine("Take Profit", takeProfit, Colors.Green, 3);
                                ChartObjects.DrawHorizontalLine("Stop Loss", stopLoss, Colors.Red, 3);
                                ChartObjects.DrawHorizontalLine("Entry", entryPrice, Colors.White, 3);
                            }
                            else
                            {
                                Print("WRONG SIGNALLLLL BUY !!! sl : " + stopLoss + " , tp : " + takeProfit + " , entry " + entryPrice + " , pipsize : " + Symbol.PipSize + " , pipvalue : " + Symbol.PipValue + " , lotsize : " + Symbol.LotSize);
                            }

                        }
                    }
                }

                DownSeries[index] = double.NaN;
            }
            else if (_trend[index] < 0)
            {
                DownSeries[index] = _movingAverage3.Result[index];

                if (_trend[index - 1] > 0.0)
                {
                    DownSeries[index - 1] = _movingAverage3.Result[index - 1];

                    if (IsLastBar)
                    {
                        var stopLoss = MarketSeries.High[index - 1] * Symbol.PipSize;
                        var takeProfit = MarketSeries.Close[index] * Symbol.PipSize;
                        var entryPrice = MarketSeries.Close[index - 1];

                        // takeProfit had a minus

                        if (MarketSeries.OpenTime[index] != _openTime)
                        {
                            sellPosition = true;

                            _openTime = MarketSeries.OpenTime[index];

                            stopLoss += StopLoss;

                            Print("Entry " + entryPrice + " price(ask) -> " + Symbol.Ask + " Stop ......" + MarketSeries.High[index - 1] + " ... " + (stopLoss + StopLoss) + " and (tp) " + MarketSeries.Close[index] + " ... " + (takeProfit - TakeProfit));

                            Entry[index] = entryPrice;
                            TP[index] = takeProfit;
                            SL[index] = stopLoss;

                            //isPlacePosition = true;
                            profitPositions.Add(new ProfitPosition("Sell", Symbol, stopLoss, takeProfit, entryPrice));
                            DisplayAlert("Sell signal", takeProfit, stopLoss, entryPrice);

                            ChartObjects.DrawHorizontalLine("Take Profit", takeProfit, Colors.Green, 3);
                            ChartObjects.DrawHorizontalLine("Stop Loss", stopLoss, Colors.Red, 3);
                            ChartObjects.DrawHorizontalLine("Entry", entryPrice, Colors.White, 3);

                        }
                    }
                }

                UpSeries[index] = double.NaN;
            }
        }

        protected void DisplayAlert(string tradyTypeSignal, double takeProfit, double stopLoss, double entryPrice)
        {
            string entryPricetext = entryPrice != 0.0 ? string.Format("Price : {0}", Math.Round(entryPrice, 4)) : "";
            string takeProfitText = takeProfit != 0.0 ? string.Format("TP : {0}", Math.Round(takeProfit, 4)) : "";
            string stopLossText = stopLoss != 0.0 ? string.Format("SL : {0}", Math.Round(stopLoss, 4)) : "";

            var alertMessage = string.Format("{0} - {4}\n\n{1}\n{2}\n{3}\n\n  $$ Uzzie Signals $$", tradyTypeSignal, entryPricetext, takeProfitText, stopLossText, Symbol.Code);

            try
            {
                Process p = new Process();
                p.StartInfo.FileName = "WriteSignalToMongo/WriteSignalToMongo";
                string args = "0" + " " + tradyTypeSignal + " " + Symbol.Code + " " + Symbol.Ask + " " + stopLoss + " " + takeProfit + " " + entryPrice + " " + DateTime.Now;
                p.StartInfo.Arguments = args;
                // p.Start();
            } catch (Exception ex)
            {
                Print("ERROR : " + ex.Message);
            }
            Print("Vomit signal ..... " + alertMessage);
        }
    }

}
