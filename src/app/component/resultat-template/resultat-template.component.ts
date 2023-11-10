import { Component } from '@angular/core';
import { isNil } from 'cypress/types/lodash';
import {SparqlService} from "../../service/sparql.service";

@Component({
  selector: 'app-resultat-template',
  templateUrl: './resultat-template.component.html'
})
export class ResultatTemplateComponent {

  result: any;
  capitales: string[] = [];

  constructor(private sparqlService: SparqlService) {}

  ngOnInit(): void {
    const query = `
      SELECT ?capitalLabel
      WHERE {
          ?country wdt:P31 wd:Q3624078 .
          ?country wdt:P36 ?capital .
          SERVICE wikibase:label { bd:serviceParam wikibase:language "fr". }
      }
    `;

    this.sparqlService.queryWikidata(query).then((data) => {
      console.log(data);
      this.capitales = data.results.bindings.map((binding: any) => binding.capitalLabel.value);
    });

  }
}
