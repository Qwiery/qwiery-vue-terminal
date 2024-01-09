import {
  CommandMessage,
  ErrorMessage,
  Message,
  TextMessage,
  WarningMessage,
} from "@orbifold/entities";

export default class MessageRendering {
  public static renderMessages(messages: Message[]): string {
    return messages
      .map((message: Message) => this.renderSingleMessage(message))
      .join("<br/>");
  }

  private static renderSingleMessage(message: Message): string {
  let m:Message;
  switch (message.typeName) {
      case "TextMessage":
        m= message as TextMessage;
        if (m.annotations?.color) {
          return `<span class="terminal-render-text" style="color:${m.annotations.color}">${m.text}</span>`;
        }
        return `<span class="terminal-render-text">${m.text}</span>`;

      case "ErrorMessage":
        m = message as ErrorMessage;
        return `<span class="terminal-render-error">${m.text}</span>`;

      case "WarningMessage":
       m = message as WarningMessage;
        return `<span class="terminal-render-warning">${m.text}</span>`;

      case "CommandMessage":
        m = message as CommandMessage;
        return `<span class="terminal-render-command">${m.toString()}</span>`;
    }
    throw new Error(`Message type '${message.typeName}' has no renderer yet.`);
  }
}
