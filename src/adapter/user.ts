import { iUser } from "../model/user";
import iAdapter from "./adapter";

export interface iUserAdapter extends iAdapter<iUser> {
    Authenticate(name: string, pwd: string): Promise<{success: boolean, user: iUser | null}>;
}