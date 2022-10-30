import { ServerType } from "../../../src/config";
import SetupSystemTests from "./system";

describe("System Tests", () => {
    SetupSystemTests("Local", ServerType.Local);
    SetupSystemTests("Remote", ServerType.Test);
});