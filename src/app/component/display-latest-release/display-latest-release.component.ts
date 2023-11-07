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
  record: RecordsModel = new RecordsModel();

  constructor(private sparqlService: SparqlService, private route: ActivatedRoute, private sanitizer: DomSanitizer) {}


  ngOnInit(): void {
   this.route.queryParams.subscribe(((params => {

    console.log(params ['r']);
    
    this.record = params ['r'];

    console.log(this.record);
    })))

  }


}
