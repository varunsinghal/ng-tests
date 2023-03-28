import { MessageService } from "./message.service";

describe("MessageService", () => {
    let messageService: MessageService;

    beforeEach(() => {
        messageService = new MessageService();
    })

    it("should add message", () => {
        messageService.add("dummy-message");
        expect(messageService.messages.length).toBe(1);
    });

    it("should clear message", () => {
        messageService.add("dummy-message");
        messageService.clear();
        expect(messageService.messages.length).toBe(0);
    });

});