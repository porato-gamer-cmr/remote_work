import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css']
})
export class StatsComponent implements OnInit {

  public loading = false;
  public part: number;
  public userId: string;
  public imagePreview: string;
  public errorMessage: string;

  constructor(private httpClient: HttpClient) { }

  ngOnInit() {
    
 
  }

  
  test(event: Event){
    const file = (event.target as HTMLInputElement).files[0];
    //console.log(event.target.files);
    //let file = input.files[0];
    //let reader = new FileReader();
    //reader.readAsText(file);
    console.log(file);
    this.httpClient.post("http://172.16.16.195:8000/stock/sendFile/",file).subscribe(
      (res)=>{console.log("réussite de upload");},
      (error)=>{console.log("echec lors de upload");}
    );
  }

  sendFile(form: NgForm) {
    this.loading = true;
    console.log(form.value.fichier);
    this.httpClient.post("http://172.16.16.195:8000/stock/sendFile/", {"test": form.value.fichier}).subscribe(
      (res)=>{console.log("réussite de upload");},
      (error)=>{console.log("echec lors de upload");}
    );
    
  }

  /** onImagePick(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.thingForm.get('image').patchValue(file);
    this.thingForm.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      if (this.thingForm.get('image').valid) {
        this.imagePreview = reader.result as string;
      } else {
        this.imagePreview = null;
      }
    };
    reader.readAsDataURL(file);
  } **/
  
}
