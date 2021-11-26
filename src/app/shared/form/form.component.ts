import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {
  private readonly _cancel$: EventEmitter<void>;
  form:FormGroup;

  constructor() {
    this._cancel$ = new EventEmitter<void>();
    this.form = new FormGroup({
      title: new FormControl('',Validators.required),
      author: new FormControl('',Validators.required)
    })
  }

  ngOnInit(): void {
  }

  @Output('cancel') get cancel$(): EventEmitter<any> {
    return this._cancel$;
  }

  cancel(): void {
    this._cancel$.emit();
  }

  save(value:any) {
    console.log(value);
  }

}
