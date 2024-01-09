import { Message } from "./models";

export default class TerminalHistory {
  private history: Message[] = [];
  private historyIndex: number = -1;

  public add(input: Message): void {
    if (!input) {
      throw new Error("Input cannot be empty");
    }
    this.history.unshift(input);
    this.historyIndex = -1;
  }

  public previous(): Message | null {
    if (this.historyIndex < this.history.length - 1) {
      this.historyIndex++;
      return this.history[this.historyIndex];
    } else {
      return null;
    }
  }

  public next(): Message | null {
    if (this.historyIndex > 0) {
      this.historyIndex--;
      return this.history[this.historyIndex];
    } else {
      return null;
    }
  }
}
