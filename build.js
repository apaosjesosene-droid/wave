import { cpSync } from "node:fs";
import { fileURLToPath } from "node:url";

const nm = (p) => fileURLToPath(new URL("./node_modules/" + p, import.meta.url));

cpSync(nm("@mercuryworkshop/scramjet/dist"), "public/scram", { recursive: true });
cpSync(nm("@mercuryworkshop/bare-mux/dist"), "public/baremux", { recursive: true });
cpSync(nm("@mercuryworkshop/epoxy-transport/dist"), "public/epoxy", { recursive: true });
