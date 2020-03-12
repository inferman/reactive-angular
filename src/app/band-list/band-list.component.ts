import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Observable, Subject, merge, combineLatest, forkJoin } from "rxjs";
import { tap, map, mergeMap, startWith, mapTo } from "rxjs/operators";

// import { AutoUnsubscribe } from "../../decorators/auto-unsubscribe";

import { BandDataService } from "../band-data.service";
import { UserDataService } from "../user-data.service";
import { Band } from "../model";
import { shareReplay } from "rxjs/operators";

@Component({
  selector: "app-band-list",
  templateUrl: "band-list.component.html"
})
export class BandListComponent implements OnInit, OnDestroy {
  model$: Observable<{ bands: Band[]; isLoading: boolean }>;
  refreshClickSubject$: Subject<any> = new Subject();

  constructor(
    private activatedRoute: ActivatedRoute,
    private bandDataService: BandDataService,
    private _us: UserDataService
  ) {}

  ngOnInit() {
    const refreshDataClick$ = this.refreshClickSubject$.asObservable();
    const refreshTrigger$ = refreshDataClick$.pipe(startWith({}), mapTo({}));
    const combinedTrigger$ = combineLatest([
      refreshTrigger$,
      this.activatedRoute.queryParams
    ]).pipe(
      map(([_, params]) => {
        if (params.active === undefined) {
          return undefined;
        }
        return params.active === "true";
      })
    );

    const bandList$ = combinedTrigger$.pipe(
      mergeMap((isActive: boolean) =>
        forkJoin(this.getData(isActive), this._us.currentUser)
      ),
      map(([bands, currentUser]) =>
        bands.map(b =>
          b.id === currentUser.favoriteBandId ? { ...b, favorite: true } : b
        )
      )
    );

    this.model$ = merge(
      refreshTrigger$.pipe(map(_ => ({ bands: [], isLoading: true }))),
      bandList$.pipe(map(bands => ({ bands, isLoading: false })))
    );
  }

  private getData(isActive: boolean): Observable<Band[]> {
    return this.bandDataService.getBands(isActive).pipe(shareReplay());
  }

  ngOnDestroy() {}
}
