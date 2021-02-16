const rollModel = require('./roll.model')

class RollRepository {
  async init(authorId) {
    await rollModel.sync()
    this.authorId = authorId
  }

  async load(macro) {
    const loadMacro = await rollModel.findOne({
      where: { user: this.authorId, macro: macro },
    })
    return loadMacro ? loadMacro.value : null
  }

  async save(macro, value) {
    const updateMacro = await rollModel.findOne({
      where: { user: this.authorId, macro: macro },
    })
    if (updateMacro) {
      updateMacro.value = value
      await updateMacro.save()
      return updateMacro.id
    } else {
      try {
        const newMacro = await rollModel.create({
          user: this.authorId,
          macro: macro,
          value: value,
        })
        return newMacro.id
      } catch (e) {
        console.error(e)
      }
      return -1
    }
  }

  async remove(macro) {
    const removeMacro = await rollModel.findOne({
      where: { user: this.authorId, macro: macro },
    })
    if (removeMacro) {
      await removeMacro.destroy()
      return true
    }
    return false
  }

  async findAll() {
    const macros = await rollModel.findAll({
      where: { user: this.authorId },
    })
    return macros
  }
}

module.exports = new RollRepository()
