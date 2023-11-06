import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-display-artist',
  templateUrl: './display-artist.component.html',
})


export class DisplayArtistComponent implements OnInit{


  ngOnInit(): void {
    const artisteMapping = [
      { artisteLabel: "Jay-Z", artisteId: "Q62766" },
      { artisteLabel: "Madonna", artisteId: "Q1744" },
      { artisteLabel: "Daft Punk", artisteId: "Q185828" },
      { artisteLabel: "Drake", artisteId: "Q33240" },
      { artisteLabel: "Beyoncé", artisteId: "Q36153" },
    ];


  }

  

}
