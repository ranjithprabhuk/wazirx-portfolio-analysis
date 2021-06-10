import { Component, Input } from "@angular/core";

@Component({
  selector: "app-deposits",
  templateUrl: "./deposits.component.html",
})
export class DepositsComponent {
  @Input() public depositInfo = [];
  @Input() public totalDeposit = 0;
  @Input() public totalCommission = 0;
  @Input() public totalVolume = 0;
}
