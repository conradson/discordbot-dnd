const Discord = require('discord.js')
const pollModel = require('./poll.model')

class PollRepository {
  async init(authorId, username) {
    await pollModel.sync()
    this.authorId = authorId
    this.username = username
  }

  async create(question, answers) {
    try {
      const poll = await pollModel.create({
        user: this.authorId,
        userName: this.username,
        question: question,
        answers: JSON.stringify(answers),
        votes: JSON.stringify({
          '🇦': [],
          '🇧': [],
          '🇨': [],
          '🇩': [],
          '🇪': [],
          '🇫': [],
        }),
      })
      return poll.id
    } catch (e) {
      console.error(e)
    }
    return -1
  }

  async setMessageId(pollId, messageId) {
    const poll = await pollModel.findOne({
      where: { id: pollId },
    })
    poll.messageId = messageId
    await poll.save()
  }

  async update(reaction, user, action) {
    const emojis = ['🇦', '🇧', '🇨', '🇩', '🇪', '🇫']
    const {
      message: {
        id: messageId,
        author: { id: authorId },
      },
      emoji: { name: emojiName },
    } = reaction
    if (!emojis.includes(emojiName)) {
      return
    }
    const { id: userId } = user
    const poll = await pollModel.findOne({
      where: { messageId: messageId },
    })
    if (poll && userId !== authorId) {
      this.toggleReaction(poll, emojiName, userId, action)
      const votes = JSON.parse(poll.votes)
      const answers = JSON.parse(poll.answers)
        .map((answer) => {
          const vote = answer.split(' ')[0]
          if (votes[vote].length) {
            return `${answer} (${votes[vote]
              .map((id) => `<@!${id}>`)
              .join(',')})`
          } else {
            return `${answer}`
          }
        })
        .join('\n')
      const pollEmbed = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setTitle(`Sondage #${poll.id} de ${poll.userName}`)
        .addFields({
          name: poll.question,
          value: answers,
        })
        .setTimestamp()

      reaction.message.edit(pollEmbed)
    }
  }

  async toggleReaction(poll, vote, userID, action) {
    const votes = JSON.parse(poll.votes)
    if (action === 'add') {
      votes[vote] = [userID, ...votes[vote]]
    } else {
      votes[vote] = [...votes[vote].filter((id) => id !== userID)]
    }
    poll.votes = JSON.stringify(votes)
    await poll.save()
  }
}

module.exports = new PollRepository()
