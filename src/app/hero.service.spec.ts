import { TestBed } from "@angular/core/testing"
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { HeroService } from "./hero.service";
import { MessageService } from "./message.service"

// HTTP mocking provided by angular.
describe("HeroService", () => {
    let mockMessageService : jasmine.SpyObj<MessageService>;
    let httpTestingController: HttpTestingController;
    let service: HeroService;

    beforeEach(() => {
        mockMessageService = jasmine.createSpyObj(MessageService, ['add']);
        TestBed.configureTestingModule({
            imports: [ HttpClientTestingModule ],
            providers: [
                HeroService,
                {provide: MessageService, useValue: mockMessageService},
            ]
        });
        httpTestingController = TestBed.inject(HttpTestingController);
        service = TestBed.inject(HeroService);
    });

    describe("getHero", () => {
        it("should call correct URL", () => {
            service.getHero(4).subscribe(hero => {
                expect(hero.id).toBe(4);
            });
            const req = httpTestingController.expectOne('api/heroes/4');
            req.flush({id: 4, name: 'name', strength: 3});
            expect(req.request.method).toBe('GET');
            httpTestingController.verify();
        });
    });
    
})