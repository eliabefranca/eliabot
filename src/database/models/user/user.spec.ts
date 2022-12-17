import { database } from '../..';
import { UserCreationAttributes, UserModel } from './user';

describe('UserModel', () => {
  beforeEach(async () => {
    // Clear the test database before each test
    await database.sync({ force: true });
  });

  it('can create a user', async () => {
    const user: UserCreationAttributes = {
      id: 'any_user_id',
      name: 'any_user_name',
      number: 'any_user_number',
    };

    // Save the user to the database
    const createdUser = (await UserModel.create(user)).get();

    expect(createdUser.id).toBe(user.id);
    expect(createdUser.name).toBe(user.name);
  });
});
