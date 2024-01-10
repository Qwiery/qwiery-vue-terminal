<template>
  <div style="position: absolute; top: 200px; left: 200px; width: 900px">
    <h2>Vue3 Terminal</h2>
    <Terminal
     :commands="commands"
     :prefix="prefix"
     :keepPrefix="true"
    />
  </div>
</template>
<script setup lang="ts">
import {
  CommandMessage,
  ErrorMessage,
  Message,
  TextMessage,
} from "@orbifold/entities";

function executor(input: Message) {
  if (input instanceof TextMessage) {
    return TextMessage.fromString("you said " + input.text);
  }
}
const commands = {
  ls: () => {
    return TextMessage.fromString("Lists the files in the current directory.");
  },
};
const banner = `Terminal Vue 3 Component`;
const redirect = {
  ls: "show files",
};
const prefix = ()=> new Date().toLocaleTimeString() + " > ";
</script>
