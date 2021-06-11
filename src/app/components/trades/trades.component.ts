import { Component, Input } from "@angular/core";
import { interval, Subscription } from "rxjs";
import { startWith, switchMap } from "rxjs/operators";
import { AppService } from "../../app.service";

@Component({
  selector: "app-trades",
  templateUrl: "./trades.component.html",
})
export class TradesComponent {
  constructor(private _appService: AppService) {
    this.getMarketStatus();
  }
  @Input() public tradeInfo = [];
  @Input() public totalDeposit = 0;
  @Input() public totalCommission = 0;
  @Input() public totalVolume = 0;

  public sortColumn: string = "Percentage";

  public totalPortfolioAmount = 0;
  public profitOrLossAmount = 0;
  public profitCoins = 0;
  public lossCoins = 0;
  public oneusdtPrice = 0;
  public isPriceCalculated = false;

  public marketStatus$: Subscription = null;
  public marketStatus = [];

  getMarketStatus = () => {
    this.marketStatus$ = interval(1000)
      .pipe(
        startWith(0),
        switchMap(() => this._appService.getMarketStatus())
      )
      .subscribe((data) => {
        this.marketStatus = data.markets;
        this.calculatePortfolio();
      });
  };

  calculatePortfolio = () => {
    if (
      this.tradeInfo &&
      this.tradeInfo.length &&
      this.marketStatus &&
      this.marketStatus.length
    ) {
      this.totalPortfolioAmount = 0;
      this.profitOrLossAmount = 0;
      this.profitCoins = 0;
      this.lossCoins = 0;
      this.tradeInfo.forEach((trade) => {
        trade.CurrentPrice = this.marketStatus.find(
          (market) =>
            market.baseMarket + market.quoteMarket ===
            trade.Market.toLowerCase()
        ).last;

        if (trade.Market.toLowerCase() === "oneusdt") {
          const usdtInrCoin = this.marketStatus.find(
            (market) => market.baseMarket + market.quoteMarket === "usdtinr"
          );

          this.oneusdtPrice = trade.CurrentPrice;
          trade.CurrentPrice = (this.oneusdtPrice * usdtInrCoin.last).toFixed(
            3
          );
          if (!this.isPriceCalculated) {
            trade.Price *= 80;
            this.isPriceCalculated = true;
          }
        }
        trade.PriceDifference = trade.CurrentPrice - trade.Price;
        trade.Total = trade.CurrentPrice * trade.Volume;
        trade.profitOrLossAmount = trade.Volume * trade.PriceDifference;

        if (trade.profitOrLossAmount > 0) {
          this.profitCoins += 1;
        } else {
          this.lossCoins += 1;
        }

        trade.Percentage = (
          (trade.PriceDifference / trade.CurrentPrice) *
          100
        ).toPrecision(3);

        this.totalPortfolioAmount += trade.Total;
      });

      this.profitOrLossAmount = this.totalDeposit - this.totalPortfolioAmount;
    }
  };

  ngOnChanges() {
    this.calculatePortfolio();
  }

  ngOnDestroy() {
    this.marketStatus$.unsubscribe();
  }
}
