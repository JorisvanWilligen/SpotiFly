import { Component, OnInit } from '@angular/core';
import {SpotifySong} from '../../models/spotify-song';
import {SpotifyArtist} from '../../models/spotify-artist';
import {SpotifyAlbum} from '../../models/spotify-album';

@Component({
  selector: 'app-result-box',
  templateUrl: './result-box.component.html',
  styleUrls: ['./result-box.component.css']
})
export class ResultBoxComponent implements OnInit {
  songs: SpotifySong[];
  artists: SpotifyArtist[];
  albums: SpotifyAlbum[];

  constructor() { }

  ngOnInit() {
  }

  setResult(result: any) {
    this.songs = result.tracks.items;
    this.artists = result.artists.items;
    this.albums = result.albums.items;
    console.log(this.songs);
  }

}
