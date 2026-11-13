import React from "react";
import { Anime } from "./Anime";
import { Caligari } from "./Caligari";
import { Noir } from "./Noir";
import { Paris } from "./Paris";
import { Rain } from "./Rain";

// One film per subtitle language, in the order of the lines in timeline.json.
export const SCENES: readonly React.FC<{ t: number }>[] = [Anime, Rain, Noir, Paris, Caligari];
