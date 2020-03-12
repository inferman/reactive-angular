import { Component, OnDestroy, OnInit } from "@angular/core";
import { Observable, Subject } from "rxjs";
import {map, mergeMap, startWith} from 'rxjs/operators';

// import { AutoUnsubscribe } from "../../decorators/auto-unsubscribe";

import { BandDataService } from "../band-data.service";
import { Band } from "../model";
import { shareReplay } from "rxjs/operators";

@Component({
  selector: "app-band-list",
  templateUrl: "band-list.component.html"
})
export class BandListComponent implements OnInit, OnDestroy {
  bandList$: Observable<Band[]>;
  refreshClickSubject$: Subject<any> = new Subject();

  constructor(private bandDataService: BandDataService) {}

  ngOnInit() {
    const refreshDataClick$ = this.refreshClickSubject$.asObservable();
    this.bandList$ = refreshDataClick$.pipe(
      startWith({}),
      mergeMap(_ => this.getData())
    )
  }

  private getData(): Observable<Band[]> {
    return this.bandDataService.getBands().pipe(shareReplay());
  }

  ngOnDestroy() {}
}
