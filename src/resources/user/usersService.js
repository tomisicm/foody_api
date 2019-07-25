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

      doc = Object.assign(doc, { ...user })

      doc = await doc.save()

      return doc
    } catch (e) {
      console.error(e)
      throw e
    }
  }
}
const usersService = new UsersService()

export default usersService
