import { Component, OnDestroy, OnInit } from "@angular/core";
import { Observable } from "rxjs";

// import { AutoUnsubscribe } from "../../decorators/auto-unsubscribe";

import { BandDataService } from "../band-data.service";
import { Band } from "../model";
import { shareReplay } from 'rxjs/operators';

@Component({
  selector: "app-band-list",
  templateUrl: "band-list.component.html"
})
export class BandListComponent implements OnInit, OnDestroy {
  bandList$: Observable<Band[]>;

  constructor(private bandDataService: BandDataService) {}

  ngOnInit() {
    this.bandList$ = this.bandDataService.getBands().pipe(shareReplay());
  }

  ngOnDestroy() {}
}
