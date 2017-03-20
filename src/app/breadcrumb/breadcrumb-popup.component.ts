import {Component, Input, ElementRef} from "@angular/core";
import {Observable} from "rxjs/Observable";
import "rxjs/add/observable/of";
import {BreadcrumbDropDown, BreadcrumbDropDownItem} from "./breadcrumb-model";

@Component({
  moduleId: ""+module.id,
  selector: 'dcn-breadcrumb-popup',
  styleUrls: ["breadcrumb.component.css"],
  templateUrl:'breadcrumb-popup.component.html'
})
export class BreadcrumbPopupComponent {

  @Input()
  breadcrumbDropDown: BreadcrumbDropDown;
  filteredItems: BreadcrumbDropDownItem[];

  _showPopup = false;
  get showPopup() {
    return this._showPopup;
  }

  set showPopup(isShow: boolean) {
    this._showPopup = isShow;
    if (!isShow) {
      this.removeListeners();
    }
    else {
      this.addListeners();
    }
  }

  constructor(private elementRef: ElementRef) {
    this.search = this.search.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onClick = this.onClick.bind(this);
  }

  ngOnDestroy() {
    this.removeListeners();
  }

  private addListeners() {
    document.addEventListener("keydown", this.onKeyDown);
    document.addEventListener("click", this.onClick);
  }

  private removeListeners() {
    document.removeEventListener("keydown", this.onKeyDown);
    document.removeEventListener("click", this.onClick);
  }

  get isShowBreadcrumbDropDown(): boolean {

    return this.breadcrumbDropDown &&
      (this.breadcrumbDropDown.getItems != undefined ||
      this.breadcrumbDropDown.items && this.breadcrumbDropDown.items.length > 0);
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.which == 27) {
      this.showPopup = false;
    }
  }

  onClick(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.showPopup = false;
    }
  }

  search(query: string, maxResult: number): Observable<any[]> {
    let search = query.toUpperCase();
    let result = this.items.filter(item => item.label.toLocaleUpperCase().indexOf(search) > -1);
    return Observable.of(result);
  }

  setInitialFilter(event: MouseEvent) {
    event.stopPropagation();

    this.filteredItems = this.items;
    this.showPopup = !this.showPopup;
  }

  get items() {
    if (this.breadcrumbDropDown.getItems) {
      return this.breadcrumbDropDown.getItems();
    }
    else {
      return this.breadcrumbDropDown.items;
    }
  }

  onFilter(filteredBreadcrumbDropDownData) {
    this.filteredItems = filteredBreadcrumbDropDownData;
  }

}
