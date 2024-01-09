<template>
  <div @click="setFocusOnInput()">
    <div ref="terminal" class="terminal-wrapper">
      <div v-if="showBanner">
        <div class="terminal-banner">{{ banner }}</div>
      </div>
      <div class="terminal-content">
        <div v-html="output" class="terminal-output"></div>
        <div class="terminal-input">
          <div class="my-1 mr-2 text-blue-400">
            {{ TerminalController.preamble }}
          </div>
          <input
            v-model="input"
            ref="cmdInput"
            @keydown.enter="execute($event)"
            @keydown.up="historyUp($event)"
            @keydown.down="historyDown($event)"
            @keydown.tab="tab($event)"
            class="terminal-input-field"
            autofocus
          />
        </div>
        <div
          ref="bottom"
          style="height: 50px; background-color: transparent"
        ></div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { defineProps, onMounted, ref } from "vue";
import MessageRendering from "./messageRendering";
import type {
  TerminalIO,
  ExecutionFunction,
  CommandFunction,
} from "@orbifold/entities";
import "../assets/style.css";

import { Utils } from "@orbifold/utils";
const props = defineProps<{
  /** The function to be executed when the Terminal gets input. */
  executor?: ExecutionFunction;
  /** The banner to be displayed on top of the terminal. */
  banner?: string;
  /** The commands that are available in the terminal. */
  commands?: { [key: string]: CommandFunction };
  /** Define aliases. */
  redirect?: { [key: string]: string };
}>();

import TerminalController from "./terminalController";
import { TerminalChannels } from "./terminalController";
import { CommandMessage, Message, TextMessage } from "@orbifold/entities";
const showBanner = ref(true);
const banner = ref("");
let controller: TerminalController | null = null;

/** The HTML Input element. */
const cmdInput = ref<HTMLInputElement>(null!);

/** The bottom of the terminal. Hack to scroll down. */
const bottom = ref<HTMLDivElement>(null!);

/** The command submitted. */
const input = ref<string>("");

/** The accumulated output above the input line. */
const output = ref<string>("");

onMounted(async () => {
  showBanner.value = !Utils.isEmpty(props.banner);
  banner.value = props.banner || "";
});

function createController(): TerminalController {
  const controller = new TerminalController();
  if (props.commands) {
    controller.commands = props.commands;
  }
  if (props.redirect) {
    controller.inputHandler.redirect = props.redirect;
  }
  if (props.executor) {
    controller.executor = props.executor;
  } else {
    controller.executor = async (input: TerminalIO) => {
      return TextMessage.fromString(
        `You need to provide an executor function to the terminal component.`
      );
    };
  }
  controller.on(TerminalChannels.Input, (obj: Message[]) => {
    if (obj.length === 0) {
      return;
    }
    if (obj.length > 1) {
      throw new Error("Only one input message is allowed.");
    }
    const m = obj[0];
    if (m.typeName === "TextMessage") {
      input.value = m.text;
    } else if (m.typeName === "CommandMessage") {
      input.value = "!" + m.command + m.args.join(" ");
    } else {
      throw new Error(`Unknown message type ${m.typeName}.`);
    }
    // scrollToBottom();
  });
  controller.on(TerminalChannels.Output, (obj: Message[]) => {
    output.value += "<br/>" + MessageRendering.renderMessages(obj);
    scrollToBottom();
  });
  controller.on(TerminalChannels.Command, (obj: CommandMessage[]) => {
    for (const cmd of obj) {
      if (cmd.command === "clear") {
        output.value = "";
      }
      if (cmd.command === "error") {
        output.value += "<br/>" + formatError(cmd.command);
      }
    }
  });
  return controller;
}
/**
 * Scroll to the bottom of the terminal.
 */
function scrollToBottom(): void {
  bottom.value?.scrollIntoView({
    behavior: "smooth",
    block: "end",
    inline: "nearest",
  });
}

function formatInput(input: Message[]) {
  return input
    .map((u: Message) => {
      if (u instanceof TextMessage) {
        return u.text;
      }
    })
    .join("<br/>");
}

onMounted(() => {
  setFocusOnInput();
  controller = createController();
});

function setFocusOnInput() {
  cmdInput.value?.focus();
}

function historyUp(event: KeyboardEvent) {
  event.preventDefault();
  controller?.historyUp();
}

function historyDown(event: KeyboardEvent) {
  event.preventDefault();
  controller?.historyDown();
}

function tab(event: KeyboardEvent) {
  event.preventDefault();
  controller?.tab();
}

function execute(event: KeyboardEvent) {
  event.preventDefault();
  controller?.execute(input.value);
  input.value = "";
}
</script>
<style></style>
