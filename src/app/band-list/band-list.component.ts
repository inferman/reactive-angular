import { Component, OnDestroy, OnInit } from "@angular/core";
import { Observable, Subject, merge } from "rxjs";
import { map, mergeMap, startWith } from "rxjs/operators";

// import { AutoUnsubscribe } from "../../decorators/auto-unsubscribe";

import { BandDataService } from "../band-data.service";
import { Band } from "../model";
import { shareReplay } from "rxjs/operators";

@Component({
  selector: "app-band-list",
  templateUrl: "band-list.component.html"
})
export class BandListComponent implements OnInit, OnDestroy {
  model$: Observable<{ bands: Band[]; isLoading: boolean }>;
  refreshClickSubject$: Subject<any> = new Subject();

  constructor(private bandDataService: BandDataService) {}

  ngOnInit() {
    const refreshDataClick$ = this.refreshClickSubject$.asObservable();
    const refreshTrigger$ = refreshDataClick$.pipe(startWith({}));
    const bandList$ = refreshTrigger$.pipe(mergeMap(_ => this.getData()));
    this.model$ = merge(
      refreshTrigger$.pipe(map(_ => ({ bands: [], isLoading: true }))),
      bandList$.pipe(map(bands => ({ bands, isLoading: false })))
    );
  }

  private getData(): Observable<Band[]> {
    return this.bandDataService.getBands().pipe(shareReplay());
  }

  ngOnDestroy() {}
}
