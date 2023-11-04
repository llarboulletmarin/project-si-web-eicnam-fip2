import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {RouteConstant} from "../../constant/route.constant";
import {SparqlService} from "../../service/sparql.service";

@Component({
  selector: 'app-display-genre',
  templateUrl: './display-genre.component.html',
})



//const selectGenreId = genreMapping[genreLabel];

export class DisplayGenreComponent {


  selectGenreId: string = '';

  constructor(private sparqlService: SparqlService, private route: ActivatedRoute) {}


  ngOnInit() : void {

    const genreMapping = [
      { genreLabel: "rap", genreId: "Q6010" },
      { genreLabel: "dance pop", genreId: "Q211756" },
      { genreLabel: "jazz", genreId: "Q8341" },
      { genreLabel: "soul", genreId: "Q131272" },
      { genreLabel: "hip-hop français", genreId: "Q138020" },
    ];
    

      this.route.queryParams.subscribe(((params) => {
        const genreLabel = params['genreLabel'];

        console.log(params["genreLabel"])
        // Recherche de l'objet correspondant dans genreMapping
        const genre = genreMapping.find(item => item.genreLabel === genreLabel);

        const dynamicID = genre?.genreId;
        
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
        `
      }))
    
  }


}
