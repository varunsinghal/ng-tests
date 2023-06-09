import { Component, Directive, Input, NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { of } from "rxjs";
import { Hero } from "../hero";
import { HeroService } from "../hero.service";
import { HeroComponent } from "../hero/hero.component";
import { HeroesComponent } from "./heroes.component";

describe("HeroesComponent", () => {
    let component: HeroesComponent;
    let HEROES;
    let mockHeroService: jasmine.SpyObj<HeroService>;

    beforeEach(() => {
        HEROES = [
            { id: 1, name: 'name-1', strength: 8 },
            { id: 2, name: 'name-2', strength: 3 },
        ];
        mockHeroService = jasmine.createSpyObj('HeroService', ['getHeroes', 'addHero', 'deleteHero']);
        component = new HeroesComponent(mockHeroService);
    });

    it("should initialize heroes", () => {
        mockHeroService.getHeroes.and.returnValue(of(HEROES));
        component.getHeroes();
        expect(component.heroes.length).toBe(2);
        expect(mockHeroService.getHeroes).toHaveBeenCalled();
    });

});


// visit again, how to use TestBed with mock service.
// when component is created using TestBed, ngOnInit will 
// be called automatically.
// example - mocking child component.
describe("HeroesComponent (TestBed)", () => {
    let mockHeroService: jasmine.SpyObj<HeroService>;
    let fixture: ComponentFixture<HeroesComponent>;
    let HEROES;

    @Component({
        selector: 'app-hero',
        template: '<div></div>'
    })
    class FakeHeroComponent{
        @Input() hero: Hero;
    }

    beforeEach(() => {
        HEROES = [
            {id: 1, name:'hero-name', strength: 3},
        ]
        mockHeroService = jasmine.createSpyObj(HeroService, ['getHeroes', 'addHero', 'deleteHero']);
        TestBed.configureTestingModule({
            'declarations': [
                HeroesComponent,
                FakeHeroComponent,
            ],
            'providers': [
                {provide: HeroService, useValue: mockHeroService},
            ],
        });
        fixture = TestBed.createComponent(HeroesComponent);
    });

    it("should initialize heroes", () => {
        mockHeroService.getHeroes.and.returnValue(of(HEROES));
        fixture.detectChanges();
        expect(fixture.componentInstance.heroes.length).toBe(1);
    });

    it("should render one li tag", () => {
        mockHeroService.getHeroes.and.returnValue(of(HEROES));
        fixture.detectChanges();
        expect(fixture.debugElement.queryAll(By.css('li')).length).toBe(1);
    });

});


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


// without mocking child component.
describe("HeroesComponent (TestBed - Deep)", () => {
    let fixture: ComponentFixture<HeroesComponent>;
    let HEROES;
    let mockHeroService: jasmine.SpyObj<HeroService>;

    beforeEach(() => {
        HEROES = [
            {id: 1, name: 'hero-name', strength:9},
        ]
        mockHeroService = jasmine.createSpyObj(HeroService, ['getHeroes', 'deleteHero', 'addHero']);
        TestBed.configureTestingModule({
            declarations: [
                HeroesComponent,
                HeroComponent,
                RouterLinkDirectiveStub,
            ],
            providers: [
                {provide: HeroService, useValue: mockHeroService},
            ],
            //"schemas": [NO_ERRORS_SCHEMA],
        });
        fixture = TestBed.createComponent(HeroesComponent);
        
    });

    it("should render each hero as a HeroComponent", () => {
        mockHeroService.getHeroes.and.returnValue(of(HEROES));
        fixture.detectChanges();
        expect(fixture.debugElement.queryAll(By.css('li')).length).toBe(1);
        expect(fixture.debugElement.queryAll(By.directive(HeroComponent)).length).toBe(1);
    });

    it("should receive emit event from child", () => {
        // spyOn(fixture.componentInstance, 'delete');
        mockHeroService.getHeroes.and.returnValue(of(HEROES));
        mockHeroService.deleteHero.and.returnValue(of(HEROES[0]));
        fixture.detectChanges();
        let heroComponents = fixture.debugElement.queryAll(By.directive(HeroComponent));
        (<HeroComponent>heroComponents[0].componentInstance).delete.emit();

        // we need to spyOn parent component to check if delete have been called.
        // expect(fixture.componentInstance.delete).toHaveBeenCalledWith(HEROES[0]);
        // or we can actually check if the hero has been deleted.
        expect(fixture.componentInstance.heroes.length).toBe(0);
    });

    it("should add a new hero when add button is clicked", () => {
        mockHeroService.getHeroes.and.returnValue(of(HEROES));
        mockHeroService.addHero.and.returnValue(of({id: 2, name: 'new-name', strength: 4}));
        fixture.detectChanges();

        let inputElement = fixture.debugElement.query(By.css('input')).nativeElement;
        inputElement.value = 'new-name';
        let addButton = fixture.debugElement.queryAll(By.css('button'))[0];
        addButton.triggerEventHandler('click', null);
        fixture.detectChanges();

        expect(fixture.debugElement.queryAll(By.css('li')).length).toBe(2);
    });

    it("should have a correct route for first hero", () => {
        mockHeroService.getHeroes.and.returnValue(of(HEROES));
        fixture.detectChanges();
        let heroComponents = fixture.debugElement.queryAll(By.directive(HeroComponent));
        let routerLink = heroComponents[0]
            .query(By.directive(RouterLinkDirectiveStub))
            .injector.get(RouterLinkDirectiveStub);
        heroComponents[0].query(By.css('a')).triggerEventHandler('click', null);
        expect(routerLink.navigatedTo).toBe('/detail/1'); 
    });
    
})