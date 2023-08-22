import answers from "../answers.js";

export default class ControlFunctions {
    async checkIfHasRole(member, roleId)  {
        try {
            return member.roles.cache.has(roleId)
        } catch (e) {
            console.log(answers.errorOccurred(e, 'checkIfHasRole').content)
        }
    }
}