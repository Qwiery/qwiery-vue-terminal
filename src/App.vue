<template>
	<div style="position:absolute; top:200px; left:200px; width: 900px;">
		<h2>Vue3 Terminal</h2>
		<Terminal :executor="executor" :banner="banner" :commands="commands"/>
	</div>
</template>
<script setup lang="ts">
import { CommandMessage, ErrorMessage, TextMessage } from './components/models';

async function executor(input: string) {
	return "you said " + input + "";
}
const commands = {
	a: () => {
		return TextMessage.fromString('you said sadfa');
	},
}
const banner = `Terminal Vue 3 Component`;
</script>