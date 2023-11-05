import { BindingPipe } from '@angular/compiler';
import { Component } from '@angular/core';
import {SparqlService} from "../../service/sparql.service";
import { ActivatedRoute } from '@angular/router';
import {RouteConstant} from "../../constant/route.constant";

@Component({
  selector: 'app-explore',
  templateUrl: './explore.component.html',
})

export class ExploreComponent {

  protected readonly RouteConstant = RouteConstant;



  //isMouseOver: boolean[] = [];
  genreLabel: string[] = [];
  genreId: string[] = [];

  genres: { genreLabel: string, genreId: string }[] = [];

  // genres: GenreModel[] = [];

  artiste: string[] = [];
  artisteLabel: string[] = [];


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
        wd:Q8341 # Jazz
        wd:Q131272 # Soul
        wd:Q138020 #hip hop français
      }
      ?genreId rdfs:label ?genreLabel.
      FILTER(LANGMATCHES(LANG(?genreLabel), "fr"))
    }    
    `;
    this.sparqlService.queryWikidata(query1).then((data) => {
      console.log(data);
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
        wd:Q642477  # Booba
        wd:Q1744     # Madonna
        wd:Q185828     # Daft Punk
        wd:Q55641    # Spice Girls
        wd:Q17305712 #Burna Boy
      }
      ?artiste rdfs:label ?artisteLabel.
      FILTER(LANGMATCHES(LANG(?artisteLabel), "fr"))
    }    
    `;

    this.sparqlService.queryWikidata(query).then((data) => {
      this.artisteLabel = data.results.bindings.map((binding: any) => binding.artisteLabel.value);
      this.artiste = data.results.bindings.map((binding: any) => binding.artiste.value);
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

  handleGenreCardClick(genre: string) {
    
  }  
  
  handlePerformerCardClick(genre: string) {

  }

  handleNewSongsCardClick(genre: string) {

  }
}
