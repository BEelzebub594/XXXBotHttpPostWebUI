import { Form, Input, Button, message, Select } from 'antd';
import axios, { AxiosError } from 'axios';
import { useState } from 'react';
import defaults from '../config/defaults.json';

const { TextArea } = Input;

interface CardMessageData {
  Desc: string;
  ThumbUrl: string;
  Title: string;
  ToWxid: string;
  Url: string;
  Wxid: string;
}

interface TextMessageData {
  At: string;
  Content: string;
  ToWxid: string;
  Type: number;
  Wxid: string;
}

interface BatchMessageData {
  Content: string;
  ToWxids: string;
  Wxid: string;
}

interface ApiResponse {
  Code: number;
  Success: boolean;
  Message: string;
  Data: any;
  Debug: string;
}

type MessageType = 'card' | 'text' | 'batch';

interface ReceiverGroups {
  [key: string]: string[];
}

const API_ENDPOINTS: Record<MessageType, string> = defaults.api;
const RECEIVER_GROUPS: ReceiverGroups = defaults.receiver.groups;

const PostForm = () => {
  const [messageType, setMessageType] = useState<MessageType>('card');
  const [loading, setLoading] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<string>('');
  const [form] = Form.useForm();

  const cardInitialValues: CardMessageData = {
    Desc: "",
    ThumbUrl: "",
    Title: "",
    ToWxid: defaults.receiver.default_wxid,
    Url: "",
    Wxid: defaults.sender.wxid
  };

  const textInitialValues: TextMessageData = {
    At: "",
    Content: "",
    ToWxid: defaults.receiver.default_wxid,
    Type: 0,
    Wxid: defaults.sender.wxid
  };

  const batchInitialValues: BatchMessageData = {
    Content: "",
    ToWxids: defaults.receiver.default_wxid,
    Wxid: defaults.sender.wxid
  };

  const handleSubmit = async (values: CardMessageData | TextMessageData | BatchMessageData) => {
    setLoading(true);
    try {
      const url = API_ENDPOINTS[messageType];

      // 如果是批量消息且选择了群组，使用群组的接收者列表
      if (messageType === 'batch' && selectedGroup && (values as BatchMessageData).ToWxids === '') {
        const groupWxids = RECEIVER_GROUPS[selectedGroup];
        (values as BatchMessageData).ToWxids = groupWxids.join(',');
      }

      const response = await axios.post<ApiResponse>(url, values, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.data.Success) {
        // 如果服务器返回失败状态
        message.error(`发送失败：${response.data.Message}`);
        console.error('服务器返回错误:', response.data);
        return;
      }

      message.success('发送成功！');
      console.log('响应:', response.data);
    } catch (error) {
      // 处理网络错误或其他错误
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ApiResponse>;
        if (axiosError.response?.data) {
          // 如果服务器返回了错误响应
          message.error(`发送失败：${axiosError.response.data.Message}`);
          console.error('服务器错误响应:', axiosError.response.data);
        } else {
          // 如果是网络错误或其他错误
          message.error(`发送失败：${axiosError.message}`);
          console.error('网络错误:', axiosError);
        }
      } else {
        // 处理其他类型的错误
        message.error(`发送失败：${(error as Error).message}`);
        console.error('其他错误:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGroupChange = (value: string) => {
    setSelectedGroup(value);
    const groupWxids = value ? RECEIVER_GROUPS[value].join(',') : '';
    form.setFieldsValue({ ToWxids: groupWxids });
  };

  const renderCardForm = () => (
    <>
      <Form.Item
        name="Title"
        label="标题"
        rules={[{ required: true, message: '请输入标题' }]}
      >
        <Input placeholder="请输入标题" />
      </Form.Item>

      <Form.Item
        name="Desc"
        label="描述"
        rules={[{ required: true, message: '请输入描述' }]}
      >
        <TextArea rows={4} placeholder="请输入描述" />
      </Form.Item>

      <Form.Item
        name="ThumbUrl"
        label="缩略图URL"
        rules={[{ required: true, message: '请输入缩略图URL' }]}
      >
        <Input placeholder="请输入缩略图URL" />
      </Form.Item>

      <Form.Item
        name="Url"
        label="链接URL"
        rules={[{ required: true, message: '请输入链接URL' }]}
      >
        <Input placeholder="请输入链接URL" />
      </Form.Item>

      <Form.Item
        name="ToWxid"
        label="目标微信ID"
        rules={[{ required: true, message: '请输入目标微信ID' }]}
      >
        <Input placeholder="请输入目标微信ID" />
      </Form.Item>

      <Form.Item
        name="Wxid"
        label="发送者微信ID"
        rules={[{ required: true, message: '请输入发送者微信ID' }]}
      >
        <Input placeholder="请输入发送者微信ID" />
      </Form.Item>
    </>
  );

  const renderTextForm = () => (
    <>
      <Form.Item
        name="Content"
        label="消息内容"
        rules={[{ required: true, message: '请输入消息内容' }]}
      >
        <TextArea rows={4} placeholder="请输入消息内容" />
      </Form.Item>

      <Form.Item
        name="At"
        label="@用户"
      >
        <Input placeholder="请输入要@的用户ID（可选）" />
      </Form.Item>

      <Form.Item
        name="Type"
        label="消息类型"
        initialValue={0}
      >
        <Input type="number" disabled />
      </Form.Item>

      <Form.Item
        name="ToWxid"
        label="目标微信ID"
        rules={[{ required: true, message: '请输入目标微信ID' }]}
      >
        <Input placeholder="请输入目标微信ID" />
      </Form.Item>

      <Form.Item
        name="Wxid"
        label="发送者微信ID"
        rules={[{ required: true, message: '请输入发送者微信ID' }]}
      >
        <Input placeholder="请输入发送者微信ID" />
      </Form.Item>
    </>
  );

  const renderBatchForm = () => {
    const groupOptions = Object.keys(RECEIVER_GROUPS).map(groupName => ({
      label: groupName,
      value: groupName
    }));

    return (
      <>
        <Form.Item
          name="Content"
          label="消息内容"
          rules={[{ required: true, message: '请输入消息内容' }]}
        >
          <TextArea rows={4} placeholder="请输入要批量发送的消息内容" />
        </Form.Item>

        <Form.Item
          label="选择接收者群组"
        >
          <Select
            value={selectedGroup}
            onChange={handleGroupChange}
            options={groupOptions}
            placeholder="选择预设的接收者群组"
            allowClear
            style={{ marginBottom: '8px' }}
          />
        </Form.Item>

        <Form.Item
          name="ToWxids"
          label="目标微信ID列表"
          rules={[{ required: true, message: '请输入目标微信ID列表' }]}
          extra="多个微信ID请用英文逗号(,)分隔"
        >
          <TextArea 
            rows={4} 
            placeholder="请输入目标微信ID列表，多个ID用英文逗号(,)分隔&#13;&#10;例如：wxid_1,wxid_2,wxid_3" 
          />
        </Form.Item>

        <Form.Item
          name="Wxid"
          label="发送者微信ID"
          rules={[{ required: true, message: '请输入发送者微信ID' }]}
        >
          <Input placeholder="请输入发送者微信ID" />
        </Form.Item>
      </>
    );
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={
        messageType === 'card' 
          ? cardInitialValues 
          : messageType === 'text'
            ? textInitialValues
            : batchInitialValues
      }
      onFinish={handleSubmit}
      style={{ maxWidth: 800, margin: '0 auto' }}
    >
      <Form.Item
        label="消息类型"
        required
      >
        <Select
          value={messageType}
          onChange={(value: MessageType) => {
            setMessageType(value);
            setSelectedGroup('');
          }}
          options={[
            { label: '卡片消息', value: 'card' },
            { label: '文本消息', value: 'text' },
            { label: '批量文本消息', value: 'batch' }
          ]}
        />
      </Form.Item>

      {messageType === 'card' && renderCardForm()}
      {messageType === 'text' && renderTextForm()}
      {messageType === 'batch' && renderBatchForm()}

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading} block>
          {messageType === 'card' 
            ? '发送卡片消息' 
            : messageType === 'text'
              ? '发送文本消息'
              : '批量发送文本消息'
          }
        </Button>
      </Form.Item>
    </Form>
  );
};

export default PostForm; 