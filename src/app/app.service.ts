import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable({ providedIn: "root" })
export class AppService {
  constructor(private http: HttpClient) {}

  private configUrl = "https://api.wazirx.com/api/v2";

  getMarketStatus() {
    return this.http.get<any>(`${this.configUrl}/market-status`);
  }

  getMarketTicker() {
    return this.http.get<any>(`${this.configUrl}/tickers`);
  }
}
