import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css']
})
export class StatsComponent implements OnInit {

  constructor(private http: HttpClient) { }
  ngOnInit() { }


  test(event){
      const thingData = new FormData();
      thingData.append("Soprano", "MaitrGims")
      thingData.append('image', event.target.files[0], "imageDePlus");
      this.http.post<any[]>('http://172.16.16.195:8000/stock/sendFile/', thingData).subscribe( (response) => {} );
      //this.http.post<any[]>('http://172.16.16.195:8000/stock/sendFile/', {'thingData': event.target.files[0]}).subscribe( (response) => {} );
       
  }


  
}
