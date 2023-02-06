import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-form-input',
  templateUrl: './form-input.component.html',
  styleUrls: ['./form-input.component.scss'],
})
export class FormInputComponent implements OnInit {
  @Input() labelText;
  @Input() inputName;
  @Input() inputType;
  @Input() inputDisabled;
  @Input() inputValue;
  @Input() inputHelper;
  @Input() inputError;

  constructor() {}

  ngOnInit() {}
}
