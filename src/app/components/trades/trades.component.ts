import { Component, Input } from "@angular/core";

@Component({
  selector: "app-trades",
  templateUrl: "./trades.component.html",
})
export class TradesComponent {
  @Input() public depositInfo = [];
  @Input() public totalDeposit = 0;
  @Input() public totalCommission = 0;
  @Input() public totalVolume = 0;
}
