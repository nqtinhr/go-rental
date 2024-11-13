import { makeVar } from "@apollo/client";
import { IUser } from "src/interfaces/common";

export const isAuthenticatedVar = makeVar<boolean>(false);
export const userVar = makeVar<IUser | null>(null);
export const isLoadingVar = makeVar<boolean>(true);
