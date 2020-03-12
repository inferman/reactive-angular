import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule, Routes } from "@angular/router";

import { AppComponent } from "./app.component";
import { BandDataService } from "./band-data.service";
import { BandListComponent } from "./band-list/band-list.component";

const routes: Routes = [
  { path: "bands", component: BandListComponent },
  { path: "", redirectTo: "bands", pathMatch: "full" }
];

@NgModule({
  declarations: [AppComponent, BandListComponent],
  imports: [BrowserModule, HttpClientModule, RouterModule.forRoot(routes)],
  providers: [BandDataService],
  bootstrap: [AppComponent]
})
export class AppModule {}
