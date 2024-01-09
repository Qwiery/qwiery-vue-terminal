<template>
  <div style="position: absolute; top: 200px; left: 200px; width: 900px">
    <h2>Vue3 Terminal</h2>
    <Terminal
      :executor="executor"
      :banner="banner"
      :commands="commands"
      :redirect="redirect"
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
  a: () => {
    return TextMessage.fromString("you said sadfa");
  },
};
const banner = `Terminal Vue 3 Component`;
const redirect = {
  ls: "show files",
};
</script>
