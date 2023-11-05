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
  songLabel: string = '';

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
        
        console.log(dynamicID)

        const query = `
        SELECT ?song ?songLabel
        WHERE {
          ?song wdt:P31 wd:Q7366.
          ?song wdt:P136 wd:${dynamicID}.
          ?song rdfs:label ?songLabel.
          FILTER (LANG(?songLabel) = "fr")
        }
        LIMIT 10
        }    
        `
        this.sparqlService.queryWikidata(query).then((data) => {
          console.log(data);
          this.songLabel = data.results.bindings.map((binding: any) => binding.songLabel.value);
        });


      }))
    
  }


}
