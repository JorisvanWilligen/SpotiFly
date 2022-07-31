import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {SpotifyService} from '../../services/spotify.service';

@Component({
  selector: 'app-search-box',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.css']
})
export class SearchBoxComponent implements OnInit {
  @Output() processResults: EventEmitter<any> = new EventEmitter();
  constructor(private spotifyService: SpotifyService) {}
  public searchText = '';

  ngOnInit() {
  }

  onKey($event: KeyboardEvent) {
    if (this.searchText === '') { return; }
    if (this.checkCache(this.searchText)) {
      this.processResults.emit(this.checkCache(this.searchText));
    } else {
      this.spotifyService.searchContent(this.searchText).subscribe(results => {
        this.setCache(this.searchText, results);
        this.processResults.emit(results);
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

}
