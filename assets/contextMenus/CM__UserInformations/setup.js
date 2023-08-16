import {ApplicationCommandType, ContextMenuCommandBuilder} from "discord.js";
import execute from "./execute.js";

const NAME = "user-informations"

const CONTEXTMENU = new ContextMenuCommandBuilder()
    .setName(NAME)
    .setType(ApplicationCommandType.User);

const userInformations = {
    name: NAME,
    contextMenu: CONTEXTMENU.toJSON(),
	execute
}

export default userInformations;