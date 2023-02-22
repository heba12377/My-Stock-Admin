import { HttpClient, HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, OnInit , Inject} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { ProductService } from 'src/app/Services/product/product.service';
import Swal from 'sweetalert2';

export interface DialogData{
  animal: string
  name: string
}
export class FormFieldHintExample {}
@Component({
  selector: 'app-add-product-dialog',
  templateUrl: './add-product-dialog.component.html',
  styleUrls: ['./add-product-dialog.component.css']
})
export class AddProductDialogComponent implements OnInit{
  constructor(
    public dialogRef: MatDialogRef<AddProductDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private Service:ProductService,
    private build:FormBuilder,
    private http: HttpClient,
    private router:ActivatedRoute
    ) {}
  ngOnInit(): void {
    this.form = this.build.group({
        _id:[''],
        title:['', Validators.required],
        price:['', Validators.required],
        description:['', Validators.required],
        image:['', Validators.required],
        category:['', Validators.required],
      });
    this.getCatergory();
    this.getSelectedCateory(event);
  }

    onNoClick(): void {
      this.dialogRef.close();
  }
  base64:any = '';
  form!: FormGroup;
  categories:[]|any= [];
  selectedFile!: File;
  getCatergory(){
    this.Service.getAllCategories().subscribe((res:any)=>{
      this.categories = res.data;
      console.log(this.categories[2]._id);
      console.log(this.categories.name);
    })
  }

  getSelectedCateory(event:any){
    this.form.get('category')!.setValue(event.target.value);
    console.log(this.form);
  }


  getImgPath(event:any){
    const file = (event.target as HTMLInputElement).files![0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload= ()=>{
      this.base64 = reader.result;
      console.log(this.base64);
    }

    this.form.get('image')!.setValue(file);
    this.form.patchValue({
      image: file,
    });
    this.form.get('image')!.updateValueAndValidity();
    }

    addProduct(){
      const formData:any = new FormData();
      formData.append('title', this.form.get('title')!.value);
      formData.append('price', this.form.get('price')!.value);
      formData.append('category', this.form.get('category')!.value);
      formData.append('description', this.form.get('description')!.value);
      formData.append('image', this.form.get('image')!.value);
      this.Service.createProduct(formData).subscribe(res=>{
      console.log(res);
      this.dialogRef.close();
      Swal.fire("Product Added successfully","","success");
      this.dialogRef.close();
    })
  }

}

