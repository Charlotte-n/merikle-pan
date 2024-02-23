import { message } from 'ant-design-vue'
const [messageApi] = message.useMessage()

const Message = () => {
  return MessageType()
}
const MessageType = () => {
  const success = async (value: string) => {
    await messageApi.success(value)
  }
  const error = async (value: string) => {
    await messageApi.error(value)
  }
  const warn = async (value: string) => {
    await messageApi.warning(value)
  }

  return {
    success,
    error,
    warn
  }
}
export default Message()
