import TerminalController, {
  TerminalChannels,
} from "../src/components/terminalController";
import { describe, test, it, expect } from "vitest";
import { ErrorMessage, Message } from "@orbifold/entities";

describe("TerminalController", () => {
  it("should r", async () => {
    const controller = new TerminalController();
    controller.executor = (input: string) => {
      return Promise.resolve(ErrorMessage.fromString("an error"));
    };
    let received = false;
    controller.on(TerminalChannels.Output, (messages: Message[]) => {
      received =
        messages && messages.length == 1 && messages[0].text == "an error";
    });
    controller.execute("whatever");
    // sleep a while
    await new Promise((resolve) => setTimeout(resolve, 300));
    expect(received).toBe(true);
  });
  
});
