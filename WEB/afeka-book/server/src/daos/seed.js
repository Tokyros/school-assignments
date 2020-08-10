import UserDao from '@daos/User/UserDao';
// import PostDao from './Post/PostDao';
// import GameDao from './Game/GameDao';
import { User } from '../entities/User';
// import { Game } from '../entities/Game';
// import { Post } from '../entities/Post';
import * as bcrypt from 'bcrypt';
import { pwdSaltRounds } from '@shared/constants';
import { getRandomInt } from '@shared/functions';


export const initDb = () => {
    const initialUsers = new Array(5).fill(0).map((_, idx) => {
        return new User(`player${idx + 1}`, `player${idx + 1}@FA.com`, bcrypt.hashSync(`player${idx + 1}`, pwdSaltRounds), getRandomInt(), [])
      });
      
      const userDao = new UserDao();
      
      initialUsers.forEach((user) => {
          userDao.add(user).then(() => {
            console.log('added user', user);
          });
      })
}