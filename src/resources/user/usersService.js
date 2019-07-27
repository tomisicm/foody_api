import { User } from './user.model'

class UsersService {
  async createUser(user) {
    try {
      const doc = await User.create({
        ...user
      })

      return doc
    } catch (e) {
      console.error(e)
      throw e
    }
  }

  async editUser(userId, user) {
    try {
      let doc = await User.findById(userId)

      doc.name = user.username
      doc.email = user.email
      doc.profile.profession = user.profession

      doc = await doc.save()

      return doc
    } catch (e) {
      console.error(e)
      throw e
    }
  }

  async getUser(user) {
    try {
      let doc = await User.findById(user._id)
      return doc
    } catch (e) {
      console.error(e)
      throw e
    }
  }
}
const usersService = new UsersService()

export default usersService
