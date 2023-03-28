import { Component, Input, NO_ERRORS_SCHEMA } from "@angular/core";
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

// without mocking child component.
describe("HeroesComponent (TestBed - Deep)", () => {
    let fixture: ComponentFixture<HeroesComponent>;
    let HEROES;
    let mockHeroService: jasmine.SpyObj<HeroService>;

    beforeEach(() => {
        HEROES = [
            {id: 1, name: 'hero-name', strength:9},
        ]
        mockHeroService = jasmine.createSpyObj(HeroService, ['getHeroes']);
        TestBed.configureTestingModule({
            declarations: [
                HeroesComponent,
                HeroComponent,
            ],
            providers: [
                {provide: HeroService, useValue: mockHeroService},
            ],
            "schemas": [NO_ERRORS_SCHEMA],
        });
        fixture = TestBed.createComponent(HeroesComponent);
        
    });

    it("should render each hero as a HeroComponent", () => {
        mockHeroService.getHeroes.and.returnValue(of(HEROES));
        fixture.detectChanges();
        expect(fixture.debugElement.queryAll(By.css('li')).length).toBe(1);
        expect(fixture.debugElement.queryAll(By.directive(HeroComponent)).length).toBe(1);
    })
})