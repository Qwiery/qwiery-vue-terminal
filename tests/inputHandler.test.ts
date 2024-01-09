import { describe, test, it, expect } from "vitest";
import {
  ErrorMessage,
  Message,
  TextMessage,
  MessageFactory,
} from "@orbifold/entities";
import InputHandler from "../src/components/inputHandler";
describe("InputHandler", () => {
  it("should turn it all to messages", async () => {
    const handler = new InputHandler();

    expect(handler.handleInput(null)).toEqual([]);
    expect(handler.handleInput(undefined)).toEqual([]);

    expect(handler.handleInput("")).toBeInstanceOf(Array);
    expect(handler.handleInput("")[0]).toBeInstanceOf(TextMessage);
    expect(handler.handleInput("  ")[0]).toBeInstanceOf(TextMessage);

    expect(handler.handleInput("hello")[0]).toBeInstanceOf(TextMessage);
    expect(handler.handleInput(123)[0]).toBeInstanceOf(TextMessage);
    expect(handler.handleInput(new Error("a"))[0]).toBeInstanceOf(ErrorMessage);

    let m = handler.handleInput(MessageFactory.fromString("a"))[0];
    expect(m).toBeInstanceOf(TextMessage);
    expect(m.text).toBe("a");

    m = handler.handleInput(458)[0];
    expect(m).toBeInstanceOf(TextMessage);
    expect(m.text).toBe("458");

    m = handler.handleInput(1.3)[0];
    expect(m).toBeInstanceOf(TextMessage);
    expect(m.text).toBe("1.3");

    m = handler.handleInput(true)[0];
    expect(m).toBeInstanceOf(TextMessage);
    expect(m.text).toBe("true");
  });
});
