import { cpSync } from "node:fs";
import { scramjetPath } from "@mercuryworkshop/scramjet/path";
import { baremuxPath } from "@mercuryworkshop/bare-mux/node";
import { epoxyPath } from "@mercuryworkshop/epoxy-transport";

cpSync(scramjetPath, "public/scram", { recursive: true });
cpSync(baremuxPath, "public/baremux", { recursive: true });
cpSync(epoxyPath, "public/epoxy", { recursive: true });
