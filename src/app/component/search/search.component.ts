import {Component, OnInit} from '@angular/core';
import {SparqlService} from "../../service/sparql.service";
import {DomSanitizer} from "@angular/platform-browser";
import {RecordsModel} from "../../model/records.model";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html'
})
export class SearchComponent implements OnInit {

  records: RecordsModel[] = [];
  recordsFiltered: RecordsModel[] = [];
  recordSelected: RecordsModel = new RecordsModel();

  constructor(private sparqlService: SparqlService,
              private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    const query = `
      SELECT ?song ?songLabel (SAMPLE(?artist) AS ?firstArtist) (SAMPLE(?artistLabel) AS ?firstArtistLabel) (SAMPLE(?spotify) AS ?IDpotify) ?countryOfOriginLabel ?publicationDate
      WHERE {
        ?song wdt:P31 wd:Q7366.
        ?song wdt:P175 ?artist.
        ?song wdt:P2207 ?spotify.

        OPTIONAL {
          ?song wdt:P495 ?countryOfOrigin.
        }
        OPTIONAL {
          ?song wdt:P577 ?publicationDate.
        }

        ?artist rdfs:label ?artistLabel.
        FILTER(LANGMATCHES(LANG(?artistLabel), "en"))

        SERVICE wikibase:label {
          bd:serviceParam wikibase:language "en".
        }
      }
      GROUP BY ?song ?songLabel ?countryOfOriginLabel ?publicationDate
    `;

    this.sparqlService.queryWikidata(query).then((data) => {
      this.records = data.results.bindings.map((binding: any) => {
        const songId = binding.song ? binding.song.value : null;
        const song = binding.songLabel ? binding.songLabel.value : null;
        const artistId = binding.firstArtist ? binding.firstArtist.value : null;
        const artist = binding.firstArtistLabel ? binding.firstArtistLabel.value : null;
        const spotify = binding.IDpotify ? this.sanitizer.bypassSecurityTrustResourceUrl("https://open.spotify.com/embed/track/" + binding.IDpotify.value) : null;
        const countryOfOrigin = binding.countryOfOriginLabel ? binding.countryOfOriginLabel.value : null;
        const publicationDate = binding.publicationDate ? binding.publicationDate.value : null;
        return {
          songId: songId,
          song: song,
          artistId: artistId,
          artist: artist,
          spotify: spotify,
          countryOfOrigin: countryOfOrigin,
          publicationDate: publicationDate,
        }
      });
      this.recordsFiltered = data.results.bindings.map((binding: any) => {
        const songId = binding.song ? binding.song.value : null;
        const song = binding.songLabel ? binding.songLabel.value : null;
        const artistId = binding.firstArtist ? binding.firstArtist.value : null;
        const artist = binding.firstArtistLabel ? binding.firstArtistLabel.value : null;
        const spotify = binding.IDpotify ? this.sanitizer.bypassSecurityTrustResourceUrl("https://open.spotify.com/embed/track/" + binding.IDpotify.value) : null;
        const countryOfOrigin = binding.countryOfOriginLabel ? binding.countryOfOriginLabel.value : null;
        const publicationDate = binding.publicationDate ? binding.publicationDate.value : null;
        return {
          songId: songId,
          song: song,
          artistId: artistId,
          artist: artist,
          spotify: spotify,
          countryOfOrigin: countryOfOrigin,
          publicationDate: publicationDate,
        }
      });

    });

  }

  public filterResultsBySong(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    if (filterValue) {
      this.recordsFiltered = this.records.filter(record =>
        record.song.toLowerCase().includes(filterValue.toLowerCase())
      );
    } else {
      this.recordsFiltered = this.records;
    }
  }

  public selectRecord(record: RecordsModel) {
    this.recordSelected = record;
  }




}
