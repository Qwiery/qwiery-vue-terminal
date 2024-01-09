import TerminalController from "./terminalController";
import type { TerminalIO, ExecutionFunction } from "@orbifold/entities";
import _ from "lodash";
import { Utils } from "@orbifold/utils";
import { Message, MessageFactory } from "@orbifold/entities";
export default class InputHandler {
  public redirect: { [key: string]: string } = {};
  private _redirect = {
    clear: "!clear",
  };
  constructor() {}
  public handleInput(input: TerminalIO): Message[] {
    // pick up redirects
    _.assign(this._redirect, this.redirect);
    if (_.isNil(input)) {
      return [];
    }
    if (Utils.isSimpleValue(input)) {
      return this.handleString(<string>input.toString());
    }
    if (input instanceof Message) {
      return [<Message>input];
    }
    if (_.isError(input)) {
      return [MessageFactory.fromError(<Error>input)];
    }
    if (_.isArray(input)) {
      const ar = <TerminalIO[]>input;
      if (ar.length === 0) {
        return [];
      }
      const firstItem = input[0];
      if (firstItem instanceof Message) {
        return <Message[]>input;
      }
      if (_.isString(firstItem)) {
        return (<string[]>ar).map((s: string) => MessageFactory.fromString(s));
      }
      if (_.isError(firstItem)) {
        return (<Error[]>ar).map((error: Error) =>
          MessageFactory.fromError(error)
        );
      }
    }
    throw new Error(
      "InputHandler: cannot handle input of type " + typeof input
    );
  }
  handleString(input: string): Message[] {
    if (_.isEmpty(input)) {
      return [MessageFactory.fromString("")]; // necessary for newline
    }
    const keys = Object.keys(this._redirect);
    const foundRedirect =
      keys.find((k) => k.toLowerCase() === input.trim().toLowerCase()) || null;

    if (foundRedirect) {
      input = this._redirect[foundRedirect];
    }
    if (input.startsWith("!")) {
      return this.handleCommand(input);
    }
    return [MessageFactory.fromString(input)];
  }
  handleCommand(input: string): Message[] {
    const actual = input.substring(1);
    let [commandName, ...args] = actual.split(" ");
    commandName = commandName.trim().toLowerCase();
    return [MessageFactory.fromCommand(commandName, args)];
  }
}
