import { BindingPipe } from '@angular/compiler';
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

  imageUrl: string ='';

  artistId: string ='';

  artistInfo: {artistId: string, artistLabel: string, occupation: "", dateOfBirth: string, dateOfCreation: string, nationality: string} []=[];

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

      OPTIONAL {
        ?artist wdt:P434 ?freebaseId .
        SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
        BIND(REPLACE(str(?artist), ".*Q", "Q") AS ?artistId)
        }
    } 
    `

      this.sparqlService.queryWikidata(query).then((data) => {
        this.records = data.results.bindings.map((binding: any) => {
          const songId = dynamicID;
          const song = binding.songLabel ? binding.songLabel.value : null;
          const artistId = binding.artistId ? binding.artistId.value : null;
          const artist = binding.artistLabel ? binding.artistLabel.value : null;
          const spotify = binding.spotifyID ? this.sanitizer.bypassSecurityTrustResourceUrl("https://open.spotify.com/embed/track/" + binding.spotifyID.value) : null;
          const countryOfOrigin = binding.countryOfOriginLabel ? binding.countryOfOriginLabel.value : null;
          const publicationDate = binding.publicationDate ? binding.publicationDate.value : null;
          const image = binding.image ? binding.image.value : null;
          this.imageUrl = image;
          this.artistId = artistId;
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

        const isBand = this.artistId.startsWith("Q27" || "Q18");
        
        const dateProp = isBand ? "wdt:P571" : "wdt:P569";
      
        const dateQuery = `
          SELECT ?date ${isBand ? "" : "?occupationLabel"} ?artistLabel ?nationality ?nationalityLabel
          WHERE {

            ${isBand ? `  wd:${this.artistId} ${dateProp} ?date. wd:Q27554412 wdt:P495 ?nationalityLabel. SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }` : `wd:${this.artistId} ${dateProp} ?date. wd:${this.artistId} wdt:P27 ?nationality . ?nationality rdfs:label ?nationalityLabel filter(lang(?nationalityLabel) = "fr" || lang(?nationalityLabel) = "en").`}


            wd:${this.artistId} rdfs:label ?artistLabel filter(lang(?artistLabel) = "en").
            ${isBand ? "" : `wd:${this.artistId} wdt:P106 ?occupation. ?occupation rdfs:label ?occupationLabel filter(lang(?occupationLabel) = "fr").`}
            
          }
        `;

        this.sparqlService.queryWikidata(dateQuery).then((data) => {

          this.artistInfo.push({ artistId: "", artistLabel: "", occupation: "", dateOfBirth: "", dateOfCreation: "", nationality: ""});

          if (data.results.bindings.length) {
            this.artistInfo[0].artistId = this.artistId;
            this.artistInfo[0].artistLabel = data.results.bindings[0].artistLabel?.value || "";

            if (isBand) {
              // Si l'artiste est un groupe de musique, affectez la date à la propriété dateOfCreation
              this.artistInfo[0].dateOfCreation = data.results.bindings[0].date.value;
              this.artistInfo[0].nationality = data.results.bindings[0].nationalityLabel?.value || "";
              console.log(this.artistInfo);
            } else {
              this.artistInfo[0].dateOfBirth = data.results.bindings[0].date.value;
              this.artistInfo[0].occupation = data.results.bindings[0].occupationLabel?.value || "";
              // this.artistInfo[0].nationality = data.results.bindings[0].countryOfOriginLabel?.value || "";
              this.artistInfo[0].nationality = data.results.bindings[0].nationalityLabel?.value;
            }
          }
        });

    })

    })
    
    ))

  }


}
