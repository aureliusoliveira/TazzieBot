var Symbol = (function () {
    function Symbol(code, price) {
        this.Code = code;
        this.Price = price;
    }
    return Symbol;
}());
var Signal = (function () {
    function Signal(riskLevel, tradeType, symbol, stopLoss, takeProfit, entryPrice, date) {
        this.riskLevel = riskLevel;
        if (riskLevel < 25) {
            this.riskClass = 'success';
        }
        else if (riskLevel < 50) {
            this.riskClass = 'info';
        }
        else if (riskLevel < 75) {
            this.riskClass = 'warning';
        }
        else {
            this.riskClass = 'danger';
        }
        this.tradeType = tradeType;
        this.symbol = symbol;
        this.stopLoss = stopLoss;
        this.takeProfit = takeProfit;
        this.entryPrice = entryPrice;
        this.date = date;
    }
    return Signal;
}());
$(window).scroll(function (e) {
});
$(document).ready(function () {
    $(window).resize();
    $(window).scroll();
    var Xapp = new Vue({
        el: '#Xapp',
        data: {
            signals: new Array(),
            currentSignal: new Signal(0, "Sell", new Symbol("XAUUSD", 2000), 0, 1288, 1280.2, Date())
        },
        methods: {
            ShowSignal: function (signal) {
                this.currentSignal = signal;
            }
        },
        mounted: function () {
            for (var i = 0; i < 100; i++) {
                var type = "Sell";
                var rand = Math.random() >= 0.5;
                if (rand) {
                    type = "Buy";
                }
                var signal = new Signal(i, type, new Symbol("XAUUSD", 2000), 0 + i, 1288 + i, 1280.2, new Date());
                console.log(signal);
                this.signals.push(signal);
            }
            this.currentSignal = this.signals[0];
            $('.mdb-select').material_select();
            $('.datepicker').pickadate({
                format: 'dd/mm/yyyy'
            });
            new WOW().init();
        }
    });
});
