import { Component } from '@angular/core';
import { isNull } from 'cypress/types/lodash';
import {SparqlService} from "../../service/sparql.service";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html'
})
export class SearchComponent {

  genreLabel: string[] = [];
  genreID: string[] = [];

  constructor(private sparqlService: SparqlService) {}

  ngOnInit(): void {
    const query = `
      SELECT ?genre ?genreLabel
      WHERE {
        ?genre wdt:P31/wdt:P279* wd:Q188451.  # Q188451 représente la classe "genre musical"
        SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
      }
    `;

    this.sparqlService.queryWikidata(query).then((data) => {
      this.genreLabel = data.results.bindings.map((binding: any) => binding.genreLabel.value);
      this.genreID = data.results.bindings.map((binding: any) => binding.genre.value);
    });

  }
}
