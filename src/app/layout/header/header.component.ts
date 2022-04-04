import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  toggle() {
    //On Full Screen
    console.log("clicked")
    var wrapper = document.querySelector(".app");
    wrapper?.classList.toggle("has-compact-menu");
  }
}
