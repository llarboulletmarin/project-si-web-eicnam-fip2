import { BindingPipe } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import {SparqlService} from "../../service/sparql.service";
import { ActivatedRoute } from '@angular/router';
import {RouteConstant} from "../../constant/route.constant";
import {DomSanitizer} from "@angular/platform-browser";
import { RecordsModel } from 'src/app/model/records.model';

@Component({
  selector: 'app-explore',
  templateUrl: './explore.component.html',
})

export class ExploreComponent implements OnInit{

  protected readonly RouteConstant = RouteConstant;

  genres: { genreLabel: string, genreId: string }[] = [];

  // genreSelected: string ='';

  // genres: GenreModel[] = [];

  artistes: { artisteId : string, artisteLabel: string} [] = [];
  // artiste: string[] = [];
  // artisteLabel: string[] = [];

  songs: {songID: string, songLabel: string, artistId: string, artistLabel: string, countryOfOrigin: string, spotifyID: string, publicationDate: string} [] = [];
  
  records: RecordsModel[] = [];

  // musique: string[] = [];
  // musiqueLabel: string[] = [];
  // datePublication: string[] = [];

  constructor(private sparqlService: SparqlService, private route: ActivatedRoute, private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    const query1 = `
    SELECT ?genreId ?genreLabel
    WHERE { 
      VALUES ?genreId {
        wd:Q6010  # Rap
        wd:Q211756 # Dance-pop
        wd:Q188450 # Electro pop
        wd:Q131272 # Soul
        wd:Q138020 #hip hop français
      }
      ?genreId rdfs:label ?genreLabel.
      FILTER(LANGMATCHES(LANG(?genreLabel), "fr"))
    }    
    `;
    this.sparqlService.queryWikidata(query1).then((data) => {
      this.genres= data.results.bindings.map((binding: any) => {
        const genreId = binding.genreId.value;
        const genreLabel = binding.genreLabel.value;
        return {
          genreId: genreId,
          genreLabel: genreLabel,
        };
      })
    });

    this.exploreByPerformer();

    this.exploreNewSongs();

  }

  exploreByPerformer() : void {

    const query = `
    SELECT ?artiste ?artisteLabel
    WHERE {
      VALUES ?artiste {
        wd:Q185002  # Mylène Farmer
        wd:Q1744     # Madonna
        wd:Q185828     # Daft Punk
        wd:Q258693    # Lorie
        wd:Q36153 #Beyoncé
      }
      ?artiste rdfs:label ?artisteLabel.
      FILTER(LANGMATCHES(LANG(?artisteLabel), "fr"))
    }    
    `;
    this.sparqlService.queryWikidata(query).then((data) => {
      this.artistes= data.results.bindings.map((binding: any) => {
        const artisteId = binding.artiste.value;
        const artisteLabel = binding.artisteLabel.value;
        return {
          artisteId: artisteId,
          artisteLabel: artisteLabel,
        };
      })
    });

  }


  exploreNewSongs() : void {

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
          this.records = data.results.bindings.map((binding: any) => {
            const songId = binding.song.value;
            const song = binding.songLabel ? binding.songLabel.value : null;
            const artistId = binding.firstArtist ? binding.firstArtist.value : null;
            const artist = binding.firstArtistLabel ? binding.firstArtistLabel.value : null;
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
  }

  handleGenreCardClick(genreLabel: string) {

  }  
  
  handlePerformerCardClick(genre: string) {


  }

  handleNewSongsCardClick(genre: string) {

  }
}
