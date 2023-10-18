import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable({
  providedIn: 'root',
})
export class SparqlService {

  private wikidataEndpoint = 'https://query.wikidata.org/sparql';

  constructor() {}

  // Méthode pour effectuer une requête SPARQL
  public async queryWikidata(query: string): Promise<any> {
    try {
      const response = await axios.get(this.wikidataEndpoint, {
        params: {
          query,
          format: 'json',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Erreur lors de la requête SPARQL :', error);
      throw error;
    }
  }
}
