import { BindingPipe } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import {SparqlService} from "../../service/sparql.service";
import { ActivatedRoute } from '@angular/router';
import {RouteConstant} from "../../constant/route.constant";

@Component({
  selector: 'app-explore',
  templateUrl: './explore.component.html',
})

export class ExploreComponent implements OnInit{

  protected readonly RouteConstant = RouteConstant;

  genres: { genreLabel: string, genreId: string }[] = [];

  genreSelected: string ='';

  // genres: GenreModel[] = [];

  artistes: { artisteId : string, artisteLabel: string} [] = [];
  // artiste: string[] = [];
  // artisteLabel: string[] = [];


  musique: string[] = [];
  musiqueLabel: string[] = [];
  datePublication: string[] = [];

  constructor(private sparqlService: SparqlService, private route: ActivatedRoute) {}

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
      // this.genreId = data.results.bindings.map((binding: any) => binding.genreId.value);
      // this.genreLabel = data.results.bindings.map((binding: any) => binding.genreLabel.value);
    });

    this.exploreByPerformer();

    this.exploreNewSongs();

  }

  exploreByPerformer() : void {

    const query = `
    SELECT ?artiste ?artisteLabel
    WHERE {
      VALUES ?artiste {
        wd:Q62766  # Jay-Z
        wd:Q1744     # Madonna
        wd:Q185828     # Daft Punk
        wd:Q33240    # Drake
        wd:Q36153 #Beyonce
      }
      ?artiste rdfs:label ?artisteLabel.
      FILTER(LANGMATCHES(LANG(?artisteLabel), "fr"))
    }    
    `;
    this.sparqlService.queryWikidata(query).then((data) => {
      this.artistes= data.results.bindings.map((binding: any) => {
        const artisteId = binding.artiste.value;
        const artisteLabel = binding.artisteLabel.value;
        console.log(artisteLabel)
        return {
          artisteId: artisteId,
          artisteLabel: artisteLabel,
        };
      })
    });

  }


  exploreNewSongs() : void {
      const query = `
      SELECT ?musique ?musiqueLabel ?datePublication
      WHERE {
        ?musique wdt:P31 wd:Q7366. # Œuvre musicale
      
        ?musique wdt:P577 ?datePublication. # Date de publication
      
        ?musique rdfs:label ?musiqueLabel.
        FILTER(LANGMATCHES(LANG(?musiqueLabel), "fr"))
      }
      ORDER BY DESC(?datePublication)
      LIMIT 5
      `;

      this.sparqlService.queryWikidata(query).then((data) => {
        this.musique = data.results.bindings.map((binding: any) => binding.musique.value);
        this.musiqueLabel = data.results.bindings.map((binding: any) => binding.musiqueLabel.value);
        this.datePublication = data.results.bindings.map((binding: any) => binding.datePublication.value);
      });
  }

  handleGenreCardClick(genreLabel: string) {

  }  
  
  handlePerformerCardClick(genre: string) {


  }

  handleNewSongsCardClick(genre: string) {

  }
}
