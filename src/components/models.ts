import { Utils } from "@orbifold/utils";

export class MessageFactory {
  static fromString(text: string): TextMessage {
    return new TextMessage(text);
  }
  static fromError(error: Error | string): ErrorMessage {
    if (typeof error === "string") {
      return new ErrorMessage(error);
    }
    return new ErrorMessage(error.message);
  }
  static fromAny(something: any): Message | Message[] | null {
    if (something instanceof Message) {
      return something;
    }
    if (something instanceof Error) {
      return MessageFactory.fromError(something);
    }
    if (typeof something === "string") {
      return MessageFactory.fromString(something);
    }
    if (something instanceof Array) {
      if (something.length === 0) {
        return null;
      }
      const firstItem = something[0];
      if (firstItem instanceof Message) {
        return something;
      }
      if (firstItem instanceof Error) {
        return something.map((error: Error) => MessageFactory.fromError(error));
      }
      if (typeof firstItem === "string") {
        return something.map((text: string) => MessageFactory.fromString(text));
      }
    }
    return null;
  }
  static fromCommand(comandName:string, args: string[]=[]): CommandMessage {
    return new CommandMessage(comandName, args);
  }
}

/**
 * Represents a base message.
 */
export class Message {
  public typeName="Message";
  constructor(public id: string = Utils.id(), public annotations = {}) {}

  /**
   * Creates a Message instance from a JSON object.
   * @param json - The JSON object representing the message.
   * @returns A new Message instance.
   */
  public static fromJson(json: any): Message {
    const message = new Message();
    message.id = json.id || Utils.id();
    message.annotations = json.annotations || {};
    return message;
  }

  /**
   * Converts the Message instance to a JSON object.
   * @returns The JSON representation of the message.
   */
  public toJSON(): any {
    return {
      id: this.id,
      typeName: this.typeName,
      annotations: this.annotations,
    };
  }
}

/**
 * Represents a text message.
 */
export class TextMessage extends Message {
  public   typeName: string = "TextMessage";
  constructor(public text: string = "", id: string = Utils.id()) {
    super(id);
  }

  static fromString(text: string): TextMessage {
    return new TextMessage(text);
  }
  /**
   * Creates a TextMessage instance from a JSON object.
   * @param json - The JSON object representing the TextMessage.
   * @returns A TextMessage instance.
   * @throws Error if the JSON is empty.
   */
  public static fromJson(json: any): TextMessage {
    if (Utils.isEmpty(json)) {
      throw new Error("JSON is empty");
    }
    const message = new TextMessage(json.text);
    message.id = json.id || Utils.id();
    return message;
  }

  /**
   * Converts the TextMessage instance to a JSON object.
   * @returns The JSON object representing the TextMessage.
   */
  public toJSON(): any {
    return {
      ...super.toJSON(),
      text: this.text,
    };
  }
}
export class ErrorMessage extends TextMessage {
  public   typeName: string = "ErrorMessage";
  constructor(public error: Error, id: string = Utils.id()) {
    super(error.message, id);
  }
  static fromError(error: Error): ErrorMessage {
    return new ErrorMessage(error);
  }
  static fromString(msg: string): ErrorMessage {
    return new ErrorMessage(new Error(msg));
  }
}
export class WarningMessage extends TextMessage {
  public   typeName: string = "WarningMessage";
  constructor(public error: Error, id: string = Utils.id()) {
    super(error.message, id);
  }
  
  static fromString(msg: string): ErrorMessage {
    return new ErrorMessage(new Error(msg));
  }
}

export class CommandMessage extends Message {
  public   typeName: string = "CommandMessage";
  /**
   *
   */
  constructor(
    public command: string,
    public args: string[]= [],
    public id: string = Utils.id()
  ) {
    super();
  }
  static fromString(command: string): CommandMessage {
    return new CommandMessage(command);
  }
  static fromJson(json: any): CommandMessage {
    const message = new CommandMessage(json.command, json.args ||[]);
    message.id = json.id || Utils.id();
    return message;
  }
  //toString override
  public toString(): string {
    return `!${this.command} ${this.args.join(" ")}`;
  }
  public toJSON(): any {
    return {
      ...super.toJSON(),
      command: this.command,
      args: this.args || [],
    };
  }
}
