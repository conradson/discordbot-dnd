const Discord = require('discord.js')
const pollRepository = require('./poll.repository')
const { getLocale, localize } = require('../../helpers/locale.helper')

module.exports = async (message, args) => {
  const {
    channel,
    author: { id: authorId, username },
  } = message
  const { type } = channel
  const locale = await getLocale(message)

  if (type == 'dm') {
    channel.send('Les sondages ne fonctionnent pas en message privé')
    return
  }
  if (args.length < 1 || args[0] === 'help' || args[0] === 'h') {
    channel.send('TODO help')
    return
  }

  const pollArgs = args.join(' ').match(/\w+|"[^"]+"/g)

  await pollRepository.init(authorId, username)

  const emojis = ['🇦', '🇧', '🇨', '🇩', '🇪', '🇫']

  if (pollArgs.length < 3) {
    channel.send(
      'Veuillez poser une question et proposer au moins deux réponses'
    )
    return
  } else if (pollArgs.length > 7) {
    channel.send('Veuillez saisir au maximum six réponses')
    return
  }

  const question = pollArgs.shift().replace(/['"]+/g, '')

  const answers = pollArgs.map(
    (answer, i) => `${emojis[i]} ${answer.replace(/['"]+/g, '')}`
  )

  pollRepository.create(question, answers).then((pollId) => {
    if (pollId === -1) {
      channel.send('Un problème est survenu lors de la création du sondage.')
      return
    }

    const pollEmbed = new Discord.MessageEmbed()
      .setColor('#0099ff')
      .setTitle(`Sondage de ${username}`)
      .addFields({
        name: question,
        value: `${answers.join('\n')}`,
      })
      .setTimestamp()

    channel
      .send(pollEmbed)
      .then((embedMessage) => {
        answers.forEach((reaction, i) => embedMessage.react(emojis[i]))
        pollRepository.setMessageId(pollId, embedMessage.id)
      })
      .then(() => {
        message.delete()
      })
  })
}
