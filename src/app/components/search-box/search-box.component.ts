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
    this.spotifyService.searchContent(this.searchText).subscribe( results => {
      this.processResults.emit(results);
    });
  }

}
