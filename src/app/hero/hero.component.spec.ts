import { Directive, Input, NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing"
import { By } from "@angular/platform-browser";
import { HeroComponent } from "./hero.component";

@Directive({
    selector: '[routerLink]',
    host: { '(click)': 'onClick()' }
})
export class RouterLinkDirectiveStub {
    @Input('routerLink') linkParams: any;
    navigatedTo: any = null;

    onClick() {
        this.navigatedTo = this.linkParams;
    }
}

describe("HeroComponent", () => {
    let fixture: ComponentFixture<HeroComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                HeroComponent,
                RouterLinkDirectiveStub,
            ],
            // schemas: [NO_ERRORS_SCHEMA],
        });
        fixture = TestBed.createComponent(HeroComponent);
    })

    it("should have the correct hero", () => {
        fixture.componentInstance.hero = { id: 1, name:'super', strength: 3};
        fixture.detectChanges();

        expect(fixture.componentInstance.hero.name).toEqual('super');
    });

    it("should render the hero name in an anchor tag", () => {
        fixture.componentInstance.hero = { id: 1, name:'super', strength: 3};
        fixture.detectChanges();

        // using debugElement - preferred 
        expect(fixture.debugElement.query(By.css('a')).nativeElement.textContent).toContain('super');
        // using nativeElement
        expect(fixture.nativeElement.querySelector('a').textContent).toContain('super');
    });


});