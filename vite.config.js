import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import * as path from "path";
import dts from "vite-plugin-dts";
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        dts({
            rollupTypes: true,
            entryRoot: "src",
            tsconfigPath: path.join(__dirname, "tsconfig.json"),
        })
    ],
    build: {
        rollupOptions: {
            external: [               
                "@orbifold/utils",
                "lodash"
            ]
        },
        lib: {
            entry: path.resolve(__dirname, "src/install.ts"),
            fileName: "index",
            // es is for browser, cjs is for node
            formats: ["es"]
        }
    }
})
