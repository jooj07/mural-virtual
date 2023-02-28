const allAccess = async (req, res) => {
  res.status(200).send('Public Content.')
}

const userBoard = async (req, res) => {
  res.status(200).send('User Content.')
}

const adminBoard = async (req, res) => {
  res.status(200).send('Admin Content.')
}

const moderatorBoard = async (req, res) => {
  res.status(200).send('Moderator Content.')
}

module.exports = {
  allAccess,
  userBoard,
  adminBoard,
  moderatorBoard
}
