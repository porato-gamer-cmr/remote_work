import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
declare  var jQuery:  any;
//import * as $ from 'jquery';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css']
})
export class StatsComponent implements OnInit {

  constructor(private http: HttpClient) { }
  ngOnInit() { 
    /**$('#date-own').yearpicker({
      minViewMode: 2,
      format: 'yyyy'
    }); **/

    (function ($) {
      $(document).ready(function(){
        $( "#date-own" ).datepicker();
      });
    })(jQuery);

  }

      
  }
  
  


  

