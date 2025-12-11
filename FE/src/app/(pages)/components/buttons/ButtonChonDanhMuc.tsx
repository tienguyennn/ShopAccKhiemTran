import { DownOutlined, SmileOutlined } from '@ant-design/icons';
import { Dropdown, MenuProps, Space } from 'antd';
import React from 'react';

interface ButtonLoginProps {
  text?: string;
}

const items: MenuProps['items'] = [
  {
    key: '1',
    label: (
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://www.antgroup.com"
      >
        1st menu item
      </a>
    ),
  },
  {
    key: '2',
    label: (
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://www.aliyun.com"
      >
        2nd menu item (disabled)
      </a>
    ),
    icon: <SmileOutlined />,
    disabled: true,
  },
  {
    key: '3',
    label: (
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://www.luohanacademy.com"
      >
        3rd menu item (disabled)
      </a>
    ),
    disabled: true,
  },
  {
    key: '4',
    danger: true,
    label: 'a danger item',
  },
];

const ButtonChonDanhMuc: React.FC<ButtonLoginProps> = ({
  text = 'Chọn mức giá',
}) => {
  return (
    <button
      className="
        relative
        inline-flex
        items-center
        justify-center
        px-10 py-2
        font-bold
        uppercase
        leading-none
        text-white
        transition
        bg-[#890000E8]
        [clip-path:polygon(0%_80%,6%_100%,88%_100%,100%_20%,94%_0%,12%_0%)]
        hover:bg-[#890000E8]
        before:content-['']
        before:absolute
        before:inset-0
        before:bg-[#CD0000]
        before:[clip-path:polygon(0%_80%,6%_100%,88%_100%,100%_20%,94%_0%,12%_0%)]
        before:-translate-x-0.5
        before:-translate-y-0.5
      "
    >
      <span className="relative -translate-x-[2px] -translate-y-[2px]">
        <Dropdown menu={{ items }} placement="bottomRight">
          <a onClick={(e) => e.preventDefault()}>
            <Space>
              {text}
              <DownOutlined className="text-sm" />
            </Space>
          </a>
        </Dropdown>
      </span>
    </button>
  );
};

export default ButtonChonDanhMuc;
