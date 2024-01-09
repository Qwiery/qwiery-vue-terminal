import { Message, MessageFactory, TextMessage } from "./models";
import TerminalController from "./terminalController";
import type { TerminalIO, ExecutionFunction } from "./types";
import _ from "lodash";
import {Utils} from "@orbifold/utils";
export default class InputHandler {
  constructor() {}
  public handleInput(input: TerminalIO): Message[] {
    
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
