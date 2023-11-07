import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { RecordsModel } from 'src/app/model/records.model';
import { SparqlService } from 'src/app/service/sparql.service';

@Component({
  selector: 'app-display-latest-release',
  templateUrl: './display-latest-release.component.html',
})


export class DisplayLatestReleaseComponent implements OnInit{

  songLabel: string = '';
  record: RecordsModel = new RecordsModel();

  constructor(private sparqlService: SparqlService, private route: ActivatedRoute, private sanitizer: DomSanitizer) {}


  ngOnInit(): void {
   this.route.queryParams.subscribe(((params => {
    this.songLabel = params ['songLabel'];

    const query = `
    SELECT ?song ?songLabel ?spotifyID (SAMPLE(?artist) AS ?firstArtist) (SAMPLE(?artistLabel) AS ?firstArtistLabel) (MAX(?publicationDate) AS ?latestPubDate) (SAMPLE(?countryOfOriginLabel) AS ?countryOfOriginLabel)
    WHERE {
      ?song wdt:P31 wd:Q7366 ;
            wdt:P2207 ?spotifyID ;
            wdt:P175 ?artist;
            wdt:P577 ?publicationDate.
      
      FILTER(YEAR(?publicationDate) = 2023).
      
      OPTIONAL {
        ?song wdt:P495 ?countryOfOriginLabel.
      }
      
      ?artist rdfs:label ?artistLabel.
      FILTER(LANG(?artistLabel) = "en").
              
      SERVICE wikibase:label { bd:serviceParam wikibase:language "en" }
    }
    GROUP BY ?song ?songLabel ?spotifyID
    ORDER BY DESC(?latestPubDate)
    LIMIT 5
    `;
      this.sparqlService.queryWikidata(query).then((data) => {
        this.record = data.results.bindings.map((binding: any) => {
          const songID = binding.song ? binding.song.value : null;
          const songLabel = binding.songLabel ? binding.songLabel.value : null;
          const artistId = binding.firstArtist ? binding.firstArtist.value : null;
          const artistLabel = binding.firstArtistLabel ? binding.firstArtistLabel.value : null;
          const spotify = binding.spotifyID ? this.sanitizer.bypassSecurityTrustResourceUrl("https://open.spotify.com/embed/track/" + binding.spotifyID.value) : null;
          const countryOfOrigin = binding.countryOfOriginLabel ? binding.countryOfOriginLabel.value : null;
          const publicationDate = binding.publicationDate ? binding.publicationDate.value : null;
          return {
            song: songID,
            songLabel: songLabel,
            artistId: artistId,
            artist: artistLabel,
            spotify: spotify,
            countryOfOrigin: countryOfOrigin,
            publicationDate: publicationDate,
          }
        });

        

    })

   })))
  }


}
