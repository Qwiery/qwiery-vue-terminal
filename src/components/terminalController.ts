import { EventEmitter } from "eventemitter3";
import _ from "lodash";
import { Utils } from "@orbifold/utils";
import TerminalHistory from "./terminalHistory";
import InputHandler from "./inputHandler";
import type {
  TerminalIO,
  ExecutionFunction,
  CommandFunction,
} from "@orbifold/entities";

import MessageRendering from "./messageRendering";

import {
  CommandMessage,
  ErrorMessage,
  TextMessage,
  Message,
} from "@orbifold/entities";
export enum TerminalChannels {
  Input = "input",
  Output = "output",
  Command = "command",
}

export default class TerminalController extends EventEmitter {
  public history: TerminalHistory = new TerminalHistory();
  public inputHandler: InputHandler = new InputHandler();
  public commands: null | { [key: string]: CommandFunction } = {};
  public _commands: { [key: string]: CommandFunction } = {
    clear: async (input: string) => [CommandMessage.fromString("clear")],
  };
  public   prefix:string|((controller: TerminalController) => string) = "$ ";
  /**
   * The executor is a function that takes a command and returns something which gets transformed into a printable bunch.
   * @type {((input: Message) => Promise<any>) | null}
   */
  public executor:
    | null
    | ((input: Message) => Promise<string | string[] | null | Error | any>) =
    null;

  private inputStack: string[][] = [];

  constructor() {
    super();
  }

  private InputEvent(message: Message[]): void {
    this.emit(TerminalChannels.Input, message);
  }
  private OutputEvent(message: Message[]): void {
    this.emit(TerminalChannels.Output, message);
  }
  private CommandEvent(message: Message[]): void {
    this.emit(TerminalChannels.Command, message);
  }

  /**
   * Passes a command to be executed.
   * @param command {string} The command to be executed.
   * @return {Promise<void>}
   */
  public async execute(command: TerminalIO): Promise<void> {
    // the handler will deal with potential redirects
    const messages = this.inputHandler.handleInput(command);
    if (messages.length === 0) {
      // no output and the input is reset
      return this.addInput("");
    }

    for (const message of messages) {
      switch (message.typeName) {
        case "CommandMessage":
          await this.handleCommand(<CommandMessage>message);
          break;
        case "ErrorMessage":
          await this.handleError(<ErrorMessage>message);
          break;
        default:
          if (!this.executor) {
            console.warn(`You need to provide an executor function to the terminal component.`)
            return this.addInput(message);

            // return this.raiseEvent(
            //   TextMessage.fromString(
            //     `You need to provide an executor function to the terminal component.`
            //   )
            // );
          }
          const result = this.executor ? await this.executor(message) : null;
          this.addInput(message);
          if (result) {
            this.handleExecutorResult(result);
          }
      }
    }
  }

  async handleCommand(command: CommandMessage) {
    // merge the commands
    _.assign(this._commands, this.commands);
    const commandName = command.command;
    const keys = Object.keys(this._commands);
    const actualKey =
      keys.find((k) => k.toLowerCase() === commandName.trim().toLowerCase()) ||
      null;
    if (actualKey) {
      this.addInput(command);
      const result = await this._commands[actualKey](command.command);
      if (result) {
        return this.raiseEvent(<Message>result);
      }
    } else {
      this.addInput(command);
      return this.raiseEvent(
        ErrorMessage.fromString(`Command '${commandName}' not found.`)
      );
    }
  }

  async handleError(error: ErrorMessage) {
    this.addInput(error.text);
  }

  private sendInputAsOutput(input: string | Message) {
    const msg = _.isString(input)
      ? TextMessage.fromString(input.toString().trim())
      : input;
    msg.annotations = {
      color: "limegreen",
    };
    this.OutputEvent([msg]);
  }

  /**
   * Handles the result of an executor.
   *
   * @param output - The output of the executor, which can be a string, an array of strings, an Error object, or any other value.
   */
  public handleExecutorResult(output: string | string[] | null | Error | any) {
    if (output === null) {
      return;
    }
    if (output instanceof Error) {
      return this.sendError(output);
    }
    if (Array.isArray(output)) {
      const ar = <any[]>output;
      if (ar.length === 0) {
        return;
      }
      const firstItem = ar[0];
      if (firstItem instanceof Error) {
        const messages = output.map((error: Error) =>
          ErrorMessage.fromError(error)
        );
        this.OutputEvent(messages);
      }
      if (Utils.isSimpleValue(firstItem)) {
        const messages = output.map((s: string) => TextMessage.fromString(s));
        this.OutputEvent(messages);
      }
      if (firstItem instanceof Message) {
        ar.forEach((m: Message) => {
          this.handleExecutorResult(m);
        });
      }
    } else {
      if (Utils.isSimpleValue(output)) {
        return this.OutputEvent([
          TextMessage.fromString(output.toString().trim()),
        ]);
      }
      if (output instanceof Message) {
        const m = <Message>output;
        this.raiseEvent(m);
      }
    }
  }
  raiseEvent(message: Message) {
    if (_.isNil(message)) {
      return;
    }
    // should not happen but we are permissive
    if (_.isArray(message)) {
      return (<Array<Message>>(<any>message)).forEach((m) =>
        this.raiseEvent(m)
      );
    }
    switch (message.typeName) {
      case "CommandMessage":
        return this.CommandEvent([message]);
      case "ErrorMessage":
        return this.OutputEvent([message]);
      default:
        return this.OutputEvent([message]);
    }
  }

  private sendError(error: string | Error) {
    if (error instanceof Error && !Utils.isEmpty(error.message)) {
      this.OutputEvent([ErrorMessage.fromError(error)]);
    } else {
      this.OutputEvent([ErrorMessage.fromString(error.toString())]);
    }
  }

  private addInput(input: Message | null) {
    if (_.isNil(input)) {
      return;
    }

    this.sendInputAsOutput(input);
    if (!Utils.isEmpty(input)) {
      const m: Message =
        input instanceof Message
          ? input
          : TextMessage.fromString(input.toString());
      this.history.add(m);
    }
  }

  historyUp() {
    const input = this.history.previous();
    if (input) {
      this.InputEvent([input]);
    }
  }

  historyDown() {
    const input = this.history.next();
    if (input) {
      this.InputEvent([input]);
    }
  }

  tab() {}
}
