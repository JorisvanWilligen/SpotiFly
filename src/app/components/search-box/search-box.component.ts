import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {SpotifyService} from '../../services/spotify.service';
import {AnimationOptions} from "ngx-lottie";
import {AnimationItem} from "ngx-lottie/lib/symbols";

@Component({
  selector: 'app-search-box',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.css']
})
export class SearchBoxComponent implements OnInit {
  options: AnimationOptions = {
    path: 'https://assets7.lottiefiles.com/packages/lf20_zcg2skbo.json'
  };
  @Output() processResults: EventEmitter<any> = new EventEmitter();
  constructor(private spotifyService: SpotifyService) {}
  public searchText = '';
  public loading = false;

  ngOnInit() {
  }

  onKey($event: KeyboardEvent) {
    if (this.searchText === '') { return; }
    if (this.checkCache(this.searchText)) {
      this.processResults.emit(this.checkCache(this.searchText));
    } else {
      this.loading = true;
      this.spotifyService.searchContent(this.searchText).subscribe(results => {
        this.setCache(this.searchText, results);
        this.processResults.emit(results);
        setTimeout( () => { this.loading = false;}, 1000 ); // should not use timeout
      });
    }
  }

  checkCache(searchQuery: string) {
    if (sessionStorage.hasOwnProperty('query-' + searchQuery)) {
      return JSON.parse(sessionStorage.getItem('query-' + searchQuery)!);
    }
  }
  setCache(searchQuery: string, results: any) {
    sessionStorage.setItem('query-' + searchQuery, JSON.stringify(results));
  }

  onAnimate(animationItem: AnimationItem): void {
  }
  }
