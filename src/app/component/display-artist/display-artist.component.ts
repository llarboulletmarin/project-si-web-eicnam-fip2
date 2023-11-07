import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RecordsModel } from 'src/app/model/records.model';
import {DomSanitizer} from "@angular/platform-browser";
import {RouteConstant} from "../../constant/route.constant";
import {SparqlService} from "../../service/sparql.service";

@Component({
  selector: 'app-display-artist',
  templateUrl: './display-artist.component.html',
})


export class DisplayArtistComponent implements OnInit{

  records: RecordsModel[] = [];
  recordSelected: RecordsModel = new RecordsModel();

  artisteLabel: string ='';

  constructor(private sparqlService: SparqlService, private route: ActivatedRoute, private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    const artisteMapping = [
      { artisteLabel: "Mylène Farmer", artisteId: "Q185002" },
      { artisteLabel: "Madonna", artisteId: "Q1744" },
      { artisteLabel: "Daft Punk", artisteId: "Q185828" },
      { artisteLabel: "Lorie", artisteId: "Q258693" },
      { artisteLabel: "Beyoncé", artisteId: "Q36153" },
    ];

    this.route.queryParams.subscribe(((params) => {
      this.artisteLabel = params['artisteLabel'];

      const artiste = artisteMapping.find(item => item.artisteLabel === this.artisteLabel);

      const dynamicID = artiste?.artisteId;

      const query = `
      SELECT DISTINCT ?song ?songLabel (SAMPLE(?artist) AS ?firstArtist) (SAMPLE(?artistLabel) AS ?firstArtistLabel) (SAMPLE(?spotify) AS ?IDspotify) ?countryOfOriginLabel ?publicationDate
      WHERE {
        ?song wdt:P31 wd:Q7366 ;
              wdt:P175 wd:${dynamicID} ;
              wdt:P2207 ?spotify.
        
        OPTIONAL {
          ?song wdt:P495 ?countryOfOrigin.
          ?song wdt:P577 ?publicationDate.
        }
        SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
      }
      GROUP BY ?song ?songLabel ?countryOfOriginLabel ?publicationDate 
      ORDER BY ASC(?songLabel)
      LIMIT 10
      `

      this.sparqlService.queryWikidata(query).then((data) => {
        this.records = data.results.bindings.map((binding: any) => {
          const songId = binding.song ? binding.song.value : null;
          const song = binding.songLabel ? binding.songLabel.value : null;
          const artistId = binding.firstArtist ? binding.firstArtist.value : dynamicID;
          const artist = binding.firstArtistLabel ? binding.firstArtistLabel.value : this.artisteLabel;
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

        console.log(this.records);
      })

    }))

  }

  public selectRecord(record: RecordsModel) {
    this.recordSelected = record;
  }

  

}
