import {Component, OnInit} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import {SparqlService} from "../../service/sparql.service";

@Component({
  selector: 'home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {

  result: any;
  random_song: any;
  title: any;
  artist: any;
  url_spotify: any;

  constructor(
    private sparqlService: SparqlService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    const query = `
      SELECT ?song ?songLabel (SAMPLE(?artistLabel) AS ?firstArtistLabel) (SAMPLE(?spotify) AS ?IDpotify) (SAMPLE(?youtube) AS ?IDYoutube)
      WHERE {
        ?song wdt:P31 wd:Q7366.
        ?song wdt:P175 ?artist.
        ?song wdt:P2207 ?spotify.
        ?song wdt:P1651 ?youtube.

        ?artist rdfs:label ?artistLabel.
        FILTER(LANGMATCHES(LANG(?artistLabel), "en"))

        SERVICE wikibase:label {
          bd:serviceParam wikibase:language "en".
        }
      }
      GROUP BY ?song ?songLabel
    `;

    this.sparqlService.queryWikidata(query).then((data) => {
      this.result = data.results.bindings.map((binding: any) => {
        return {
          song: binding.songLabel.value,
          artist: binding.firstArtistLabel.value,
          spotify: binding.IDpotify.value,
          youtube: binding.IDYoutube.value
        }
      });
      this.random_song = this.result[Math.floor(Math.random() * this.result.length)];
      this.title = this.random_song.song;
      this.artist = this.random_song.artist;

      this.url_spotify = this.sanitizer.bypassSecurityTrustResourceUrl("https://open.spotify.com/embed/track/" + this.random_song.spotify);


    });





  }

}
