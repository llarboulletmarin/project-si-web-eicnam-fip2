import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RecordsModel } from 'src/app/model/records.model';
import {DomSanitizer} from "@angular/platform-browser";
import {RouteConstant} from "../../constant/route.constant";
import {SparqlService} from "../../service/sparql.service";

@Component({
  selector: 'app-display-genre',
  templateUrl: './display-genre.component.html',
})



//const selectGenreId = genreMapping[genreLabel];

export class DisplayGenreComponent implements OnInit {

  genreLabel: string = '';
  records: RecordsModel[] = [];
  recordSelected: RecordsModel = new RecordsModel();

  selectGenreId: string = '';
  songLabel: string = '';

  constructor(private sparqlService: SparqlService, private route: ActivatedRoute, private sanitizer: DomSanitizer) {}


  ngOnInit() : void {

    const genreMapping = [
      { genreLabel: "rap", genreId: "Q6010" },
      { genreLabel: "dance pop", genreId: "Q211756" },
      { genreLabel: "electropop", genreId: "Q188450" },
      { genreLabel: "soul", genreId: "Q131272" },
      { genreLabel: "hip-hop français", genreId: "Q138020" },
    ];
    

      this.route.queryParams.subscribe(((params) => {
        this.genreLabel = params['genreLabel'];

        // Recherche de l'objet correspondant dans genreMapping
        const genre = genreMapping.find(item => item.genreLabel === this.genreLabel);

        const dynamicID = genre?.genreId;

        const query = `
        SELECT DISTINCT ?song ?songLabel (SAMPLE(?artist) AS ?firstArtist) (SAMPLE(?artistLabel) AS ?firstArtistLabel) (SAMPLE(?spotify) AS ?IDspotify) (MAX(?publicationDate) AS ?latestPubDate) ?countryOfOriginLabel ?publicationDate
        WHERE {
          ?song wdt:P31 wd:Q7366.
          ?song wdt:P175 ?artist.
          ?song wdt:P136 wd:${dynamicID}.
          ?song wdt:P2207 ?spotify.
  
          OPTIONAL {
            ?song wdt:P495 ?countryOfOrigin.
          }
          OPTIONAL {
            ?song wdt:P577 ?publicationDate.
          }
  
          ?artist rdfs:label ?artistLabel.
          FILTER(LANGMATCHES(LANG(?artistLabel), "en"))
          FILTER (?artist != wd:Q111154856)
          FILTER (?artist != wd:Q303318)
          FILTER (?artist != wd:Q55217093)
        
          SERVICE wikibase:label {
            bd:serviceParam wikibase:language "en".
          }
        }
        GROUP BY ?song ?songLabel ?countryOfOriginLabel ?publicationDate 
        HAVING ((COUNT(*) = 1) || (MAX(?publicationDate) = ?latestPubDate))
        LIMIT 10 
        `
        
        this.sparqlService.queryWikidata(query).then((data) => {
          this.records = data.results.bindings.map((binding: any) => {
            const songId = binding.song ? binding.song.value : null;
            const song = binding.songLabel ? binding.songLabel.value : null;
            const artistId = binding.firstArtist ? binding.firstArtist.value : null;
            const artist = binding.firstArtistLabel ? binding.firstArtistLabel.value : null;
            const spotify = binding.IDspotify ? this.sanitizer.bypassSecurityTrustResourceUrl("https://open.spotify.com/embed/track/" + binding.IDspotify.value) : null;
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

          

      })
    }))
  }


  public selectRecord(record: RecordsModel) {
    this.recordSelected = record;
  }
    

}
