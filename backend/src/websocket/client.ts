import { io } from '../http';
import { ConnectionsService } from '../services/ConnectionsService';
import { MessagesService } from '../services/MessagesService';
import { UsersService } from '../services/UserService';

interface IParams {
    text: string;
    email: string;
}

io.on('connect', (socket) => {
    const connectionService = new ConnectionsService();
    const userService = new UsersService();
    const messageService = new MessagesService();

    socket.on('client_first_access', async (params) => {
        const socket_id = socket.id;
        const { text, email } = params as IParams;
        let user_id = null;

        const userExists = await userService.findByEmail(email);

        if (!userExists) {
            const user = await userService.create(email);

            await connectionService.create({
                socket_id,
                user_id: user.id
            });
            user_id = user.id;
        }
        else {
            const connection = await connectionService.findByUserId(userExists.id);

            if (!connection) {
                await connectionService.create({
                    socket_id,
                    user_id: userExists.id
                });
            }
            else {
                connection.socket_id = socket_id;
                await connectionService.create(connection);
            }

            user_id = userExists.id;
        }

        await messageService.create({
            text,
            user_id
        });
    });
});