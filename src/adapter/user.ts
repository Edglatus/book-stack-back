import { iUser } from "../model/user";
import iAdapter from "./adapter";

export interface iUserAdapter extends iAdapter<iUser> {
    Authenticate(email: string, pwd: string): Promise<{success: boolean, user: iUser | null}>;

    CreateAdapter(): Promise<iUserAdapter>;
}