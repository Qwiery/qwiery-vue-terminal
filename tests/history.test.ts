import { describe, test, it, expect } from "vitest";
import TerminalHistory from "../src/components/terminalHistory";
import { TextMessage } from "@orbifold/entities";
const m = (input: string) => {
  return TextMessage.fromString(input);
};
describe("History", () => {
  it("should navigate the history", () => {
    const history = new TerminalHistory();
    history.add(m("echo 1"));
    history.add(m("echo 2"));
    history.add(m("echo 3"));
    expect(history.previous().text).toEqual("echo 3");
    expect(history.previous().text).toEqual("echo 2");
    expect(history.previous().text).toEqual("echo 1");
    expect(history.previous()).toEqual(null);
    expect(history.next().text).toEqual("echo 2");
    expect(history.next().text).toEqual("echo 3");
    expect(history.next()).toEqual(null);
  });
});
