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
      SELECT ?song ?songLabel (SAMPLE(?artist) AS ?firstArtist) (SAMPLE(?artistLabel) AS ?firstArtistLabel) (SAMPLE(?spotify) AS ?IDpotify)
      WHERE {
        ?song wdt:P31 wd:Q7366.
        ?song wdt:P175 ?artist.
        ?song wdt:P2207 ?spotify.
        ?artist rdfs:label ?artistLabel.
        FILTER(LANGMATCHES(LANG(?artistLabel), "en"))
        SERVICE wikibase:label {
          bd:serviceParam wikibase:language "en".
        }
      }
      GROUP BY ?song ?songLabel
    `;

    this.sparqlService.queryWikidata(query).then((data) => {
      this.records = data.results.bindings.map((binding: any) => {
        return {
          songId: binding.song.value,
          song: binding.songLabel.value,
          artistId: binding.firstArtist.value,
          artist: binding.firstArtistLabel.value,
          spotify: this.sanitizer.bypassSecurityTrustResourceUrl("https://open.spotify.com/embed/track/" + binding.IDpotify.value)
        }
      });
      this.recordsFiltered = data.results.bindings.map((binding: any) => {
        return {
          songId: binding.song.value,
          song: binding.songLabel.value,
          artistId: binding.firstArtist.value,
          artist: binding.firstArtistLabel.value,
          spotify: this.sanitizer.bypassSecurityTrustResourceUrl("https://open.spotify.com/embed/track/" + binding.IDpotify.value)
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
