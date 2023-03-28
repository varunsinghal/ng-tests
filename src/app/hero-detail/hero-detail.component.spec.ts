import { Location } from "@angular/common";
import { ComponentFixture, fakeAsync, flush, TestBed, tick } from "@angular/core/testing"
import { FormsModule } from "@angular/forms";
import { By } from "@angular/platform-browser";
import { ActivatedRoute } from "@angular/router";
import { of } from "rxjs";
import { HeroService } from "../hero.service";
import { HeroDetailComponent } from "./hero-detail.component"

describe("HeroDetailComponent", () => {
    let fixture: ComponentFixture<HeroDetailComponent>;
    let mockHeroService: jasmine.SpyObj<HeroService>;
    let mocklocation: jasmine.SpyObj<Location>;
    let mockActivatedRoute = {
        snapshot: {
            paramMap: {
                get: () => { return '2' }
            }
        }
    }

    beforeEach(() => {
        mockHeroService = jasmine.createSpyObj(HeroService, ['getHero', 'updateHero']);
        mocklocation = jasmine.createSpyObj(Location, ['back']);
        TestBed.configureTestingModule({
            imports: [FormsModule],
            declarations: [HeroDetailComponent],
            providers: [
                {provide: ActivatedRoute, useValue: mockActivatedRoute},
                {provide: HeroService, useValue: mockHeroService},
                {provide: Location, useValue: mocklocation},
            ]
        });
        fixture = TestBed.createComponent(HeroDetailComponent);
    });

    it("should load correct hero detail when initialized", () => {
        mockHeroService.getHero.and.returnValue(of({id: 2, name: 'hero-name', strength: 3}));
        fixture.detectChanges();
        expect(fixture.debugElement.query(By.css('h2')).nativeElement.textContent).toContain('HERO-NAME');
        expect(mockHeroService.getHero).toHaveBeenCalledWith(2);
    });

    it("should call updateHero when save is called using tick/flush", fakeAsync(() => {
        mockHeroService.getHero.and.returnValue(of({id: 2, name:'hero-name', strength: 3}));
        mockHeroService.updateHero.and.returnValue(of({}));
        fixture.detectChanges();

        fixture.componentInstance.save();
        // tick(250);
        flush();

        expect(mockHeroService.updateHero).toHaveBeenCalled();
    }));

})