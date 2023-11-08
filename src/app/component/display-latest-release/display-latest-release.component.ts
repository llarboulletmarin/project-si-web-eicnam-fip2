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

  records: RecordsModel[] = [];

  record: RecordsModel = new RecordsModel();
  constructor(private sparqlService: SparqlService, private route: ActivatedRoute, private sanitizer: DomSanitizer) {}


  ngOnInit(): void {

  
    const latestReleaseMapping = [
      { songLabel: "I'm Just Ken", songId: "Q120799552" },
      { songLabel: "Badebussen", songId: "Q121316946" },
      { songLabel: "Les choses qu'on fait", songId: "Q123155026" },
      { songLabel: "Happy Doomsday", songId: "Q118354926" },
      { songLabel: "Six Feet Under", songId: "Q116908998" },
    ];
    
   this.route.queryParams.subscribe(((params => {

    this.songLabel = params ['song'];

    const song = latestReleaseMapping.find(item => item.songLabel === this.songLabel);

    const dynamicID = song?.songId;

    const query = `
    SELECT ?songLabel ?artistLabel ?spotifyID ?countryOfOriginLabel ?publicationDate ?image ?artistId
    WHERE {
  
      wd:${dynamicID} rdfs:label ?songLabel filter(lang(?songLabel) = "en").
  
      wd:${dynamicID} wdt:P2207 ?spotifyID.
                
      wd:${dynamicID} wdt:P175 ?artist . 
      ?artist rdfs:label ?artistLabel filter(lang(?artistLabel) = "en"). 
  
      OPTIONAL {
          ?artist wdt:P18 ?image . 
      }
  
      OPTIONAL {
          wd:${dynamicID} wdt:P495 ?countryOfOrigin . 
          ?countryOfOrigin rdfs:label ?countryOfOriginLabel .
          FILTER(LANGMATCHES(LANG(?countryOfOriginLabel), "en"))
      }
      
      OPTIONAL {
          wd:${dynamicID} wdt:P577 ?publicationDate .
      }
    } 
    `

      this.sparqlService.queryWikidata(query).then((data) => {
        this.records = data.results.bindings.map((binding: any) => {
          const songId = dynamicID;
          const song = binding.songLabel ? binding.songLabel.value : null;
          const artistId = binding.artistId ? binding.artistId.value : null;
          const artist = binding.artistLabel ? binding.artistLabel.value : null;
          console.log(artist)
          const spotify = binding.spotifyID ? this.sanitizer.bypassSecurityTrustResourceUrl("https://open.spotify.com/embed/track/" + binding.spotifyID.value) : null;
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

    })))

    // console.log(this.record.artist);


  }


}
