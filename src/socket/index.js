import { Server } from "socket.io";

let io;

/*
|--------------------------------------------------------------------------
| Initialize Socket.io
|--------------------------------------------------------------------------
*/

export const initializeSocket = (
  server
) => {

  io = new Server(server, {
    cors: {
      origin:
        process.env.CLIENT_URL,

      credentials: true,
    },
  });

  /*
  |--------------------------------------------------------------------------
  | Connection Event
  |--------------------------------------------------------------------------
  */

  io.on(
    "connection",
    (socket) => {

      console.log(
        `Socket Connected: ${socket.id}`
      );

      /*
      |--------------------------------------------------------------------------
      | Disconnect Event
      |--------------------------------------------------------------------------
      */

      socket.on(
        "disconnect",
        () => {
          console.log(
            `Socket Disconnected: ${socket.id}`
          );
        }
      );
    }
  );

  return io;
};

/*
|--------------------------------------------------------------------------
| Get Socket Instance
|--------------------------------------------------------------------------
*/

export const getIO = () => {

  if (!io) {
    throw new Error(
      "Socket.io has not been initialized"
    );
  }

  return io;
};