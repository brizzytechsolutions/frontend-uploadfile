import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Image } from '../models/image';
import { UploadService } from '../services/upload.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  myImages: Image[] = [];
  preview: string;
  form: FormGroup;
  percentDone: any = 0;

  constructor(
    public fb: FormBuilder,
    public uService: UploadService
    ) {
      this.form = this.fb.group({
        name: [''],
        img: [null]
      });
    }

  ngOnInit(): void {
    this.listAll();
  }

  listAll() {
    this.uService.getAllImg().subscribe((data) => {
      this.myImages = data;
      console.log('Ke ya List', this.myImages);
    });
  }

  uploadFile(event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({
      img: file
    });
    this.form.get('img').updateValueAndValidity();
    // File Preview
    const reader = new FileReader();
    reader.onload = () => {
      this.preview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  submitForm() {
    this.uService.createFiles(
      this.form.value.name,
      this.form.value.img
    ).subscribe((event: HttpEvent<any>) => {
      switch (event.type) {
        case HttpEventType.Sent:
          console.log('Request has been made!');
          break;
        case HttpEventType.ResponseHeader:
          console.log('Response header has been received!');
          break;
        case HttpEventType.UploadProgress:
          this.percentDone =  Math.round(event.loaded / event.total * 100);
          console.log(`Uploaded! ${this.percentDone}%`);
          break;
          case HttpEventType.Response:
            this.percentDone = false;
            console.log('User successfully created', event.body);
            break;
      }
    });
  }
}
