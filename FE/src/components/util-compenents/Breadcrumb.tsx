import { CalendarOutlined, HomeOutlined } from '@ant-design/icons';
import { Breadcrumb } from 'antd';
import dayjs from 'dayjs';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useSelector } from '@/store/hooks';
import operationService from '@/services/operation/operation.service';

const weekdays = [
  'Chủ nhật',
  'Thứ 2',
  'Thứ 3',
  'Thứ 4',
  'Thứ 5',
  'Thứ 6',
  'Thứ 7',
];
const today = dayjs();

type Operation = {
  name: string;
  url: string;
};
const AutoBreadcrumb = () => {
  const [operations, setOperations] = useState<Operation[]>([]);
  const user = useSelector((state) => state.auth.User);

  const handleBuildBreadcrumb = () => {
    const items = [
      {
        title: <Link href="/dashboard">Trang chủ</Link>,
      },
    ];
    const pathName = window.location.pathname;
    pathName
      .slice(1)
      .split('/')
      .forEach((op) => {
        const matchedOperation = operations.find((x) =>
          x.url.toUpperCase().includes(op.toUpperCase())
        );
        if (matchedOperation) {
          items.push({
            title: (
              <Link href={matchedOperation.url}>{matchedOperation.name}</Link>
            ),
          });
        }
      });
    // Thêm style cho phần tử cuối cùng
    if (items.length > 1) {
      const lastItem = items[items.length - 1];
      items[items.length - 1] = {
        title: (
          <Link
            href={(lastItem.title as any).props.href}
            style={{ color: 'var(--color-primary)' }}
          >
            {(lastItem.title as any).props.children}
          </Link>
        ),
      };
    }
    return items;
  };

  useEffect(() => {
    operationService
      .getBreadcrumb()
      .then((res) => {
        if (res.status) {
          setOperations(res.data);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);
  return (
    <div className="w-full flex justify-between align-items-center pb-2 border-b border-gray-300 mb-2">
      <Breadcrumb items={handleBuildBreadcrumb()} />{' '}
      <span className="uppercase font-bold">{user?.tenDonVi_txt}</span>
      <span>
        <CalendarOutlined /> {weekdays[today.day()]} ngày{' '}
        {today.format('DD/MM/YYYY')}
      </span>
    </div>
  );
};

export default AutoBreadcrumb;
