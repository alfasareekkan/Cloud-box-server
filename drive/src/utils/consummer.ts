import amqp, { Message,Connection } from 'amqplib/callback_api'
import User from '../model/User'
export let amqbConnection: Connection;



const createMQConsumer = (amqpURl: string, queueName: string) => {
  console.log('Connecting to RabbitMQ...')
  return () => {
    amqp.connect(amqpURl, (errConn, conn) => {
      if (errConn) {
        throw errConn
      }
amqbConnection = conn;


      conn.createChannel((errChan, chan) => {
        if (errChan) {
          throw errChan
        }

        console.log('Connected to RabbitMQ')
        chan.assertQueue(queueName, { durable: true })
        chan.consume(queueName, (msg: Message | null) => {
          if (msg) {
            const parsed = JSON.parse(msg.content.toString())
            switch (parsed.action) {
              case 'REGISTER':
                User.create({
                      userId: parsed.data._id,
                      firstName: parsed.data.firstName,
                      lastName: parsed.data.lastName,
                      email: parsed.data.email,
                      password: parsed.data.password,
                      refreshToken:parsed.data.refreshToken
                }).then((re) => {
                  console.log(re);
              
                      
                    })
                break
              case 'LOGIN':
                console.log('Consuming LOGIN action', parsed.data)
                break
              default:
                break
            }
          }
        }, { noAck: true })
      })
    })
  }
}

export default createMQConsumer