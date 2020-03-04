/// <reference path="typings/jquery.d.ts" />
/// <reference path="typings/materialize.d.ts" />
/// <reference path="typings/vue.d.ts" />

declare var WOW;
interface JQuery {
    material_select(): any;
    pickadate({}): any;
    carousel({}): any;
}

class Symbol{
  Code:string;
  Price:number;
  constructor(code,price){
    this.Code = code;
    this.Price = price;
  }
}

class Signal{
         riskClass:string;
         riskLevel:number;
         tradeType:string;
         symbol:Symbol;
         entryPrice:number;
         stopLoss:number;
         takeProfit:number;
         date:Date;
         constructor(riskLevel,tradeType,symbol,stopLoss,takeProfit,entryPrice,date)
         {
             this.riskLevel = riskLevel;

             if(riskLevel < 25){
               this.riskClass = 'success';
             }else if(riskLevel < 50){
               this.riskClass = 'info';
             }else if(riskLevel < 75){
               this.riskClass = 'warning';
             }else{
               this.riskClass = 'danger';
             }

             this.tradeType = tradeType;
             this.symbol = symbol;
             this.stopLoss = stopLoss;
             this.takeProfit = takeProfit;
             this.entryPrice = entryPrice;
             this.date = date;
         }
}


$(window).scroll((e) => {

});

$(document).ready(function () {
    //Call the resize method
    $(window).resize();
    $(window).scroll();
    var Xapp = new Vue({
        el: '#Xapp',
        data: {
          signals:new Array<Signal>(),
          currentSignal:new Signal(0,"Sell",new Symbol("XAUUSD",2000),0,1288,1280.2,Date())
        },
        methods: {
              ShowSignal:function(signal:Signal){
                  this.currentSignal = signal;
              }
        },
        mounted: function () {
            for(var i=0;i<100;i++){
              var type = "Sell";
              var rand:Boolean = Math.random() >= 0.5;
              if(rand){
                type = "Buy";
              }
              var signal = new Signal(i,type,new Symbol("XAUUSD",2000),0 + i,1288 + i,1280.2,new Date());
              console.log(signal);
              this.signals.push(signal);
            }
            this.currentSignal = this.signals[0];
            //Initialize material select
            $('.mdb-select').material_select();
            // Data Picker Initialization
            $('.datepicker').pickadate({
                format: 'dd/mm/yyyy'
            });
            //Initialize WOW
            new WOW().init();
        }
    });
});
