import { Component } from "@angular/core";
import * as XLSX from "xlsx";

@Component({
  selector: "app-dashboard",
  templateUrl: "./default-layout.component.html",
})
export class DefaultLayoutComponent {
  public depositInfo = [];
  public totalDeposit = 0;
  public totalCommission = 0;
  public totalVolume = 0;

  public tradeInfo = [];

  processDepositInfo = (data: any[]) => {
    this.depositInfo = data;
    this.totalDeposit = 0;
    data.forEach((d, index) => {
      this.depositInfo[index].Commision = (d.Volume / 100) * 2;
      this.depositInfo[index].Total =
        this.depositInfo[index].Commision + d.Volume;
      this.totalCommission += this.depositInfo[index].Commision;
      this.totalVolume += d.Volume;
      this.totalDeposit += this.depositInfo[index].Total;
    });
  };

  processTradeInfo = (data: any[]) => {};

  onFileChange(event: any) {
    /* wire up file reader */
    const target: DataTransfer = <DataTransfer>event.target;
    if (target.files.length !== 1) {
      throw new Error("Cannot use multiple files");
    }
    const reader: FileReader = new FileReader();
    reader.readAsBinaryString(target.files[0]);
    reader.onload = (e: any) => {
      /* create workbook */
      const binarystr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(binarystr, { type: "binary" });

      for (let index = 0; index < wb.SheetNames.length; index++) {
        /* selected the first sheet */
        const wsname: string = wb.SheetNames[index];
        const ws: XLSX.WorkSheet = wb.Sheets[wsname];

        switch (index) {
          case 2:
            this.processTradeInfo(XLSX.utils.sheet_to_json(ws));
            break;
          case 3:
            this.processDepositInfo(XLSX.utils.sheet_to_json(ws));
            break;
        }

        /* save data */
        const data = XLSX.utils.sheet_to_json(ws); // to get 2d array pass 2nd parameter as object {header: 1}
        console.log("excel data >>", index, data); // Data will be logged in array format containing objects
      }
    };
  }
}
