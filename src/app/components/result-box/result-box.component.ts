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
  audio = new Audio;
  currentlyPlaying: string = '';

  constructor() { }

  ngOnInit() {
  }

  setResult(result: any) {
    this.songs = result.tracks.items;
    this.artists = result.artists.items;
    this.albums = result.albums.items;
  }

  playSound(source: string){
    this.audio.currentTime = 0;
    this.audio.pause();
    if(this.currentlyPlaying != source) {
      this.audio.src = source;
      this.audio.load();
      this.audio.play();
      this.currentlyPlaying = source;
    }else{
      this.currentlyPlaying = '';
    }
  }

  playIcon(source: string){
    if (source == this.currentlyPlaying){
      return '/assets/images/pause.png'
    }else{
      return '/assets/images/play.png'
    }
  }

  gotoPage(page: string){
    window.location.href = page;
  }

}
