
import duLieuDanhMucService from '@/services/duLieuDanhMuc/duLieuDanhMuc.service';
import { DM_DuLieuDanhMucType } from '@/types/dM_DuLieuDanhMuc/dto';
import { BookOutlined } from '@ant-design/icons';
import { Button, Modal } from 'antd';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

const NavHDSD = () => {
  const [open, setOpen] = useState(false);
  const StaticFileUrl = process.env.NEXT_PUBLIC_STATIC_FILE_BASE_URL;
  const showModal = () => setOpen(true);
  const handleCancel = () => setOpen(false)
  const [HDSD, setHDSD] = useState<DM_DuLieuDanhMucType | null>(null);
  const getHDSD = async () => {
    try {
      const response = await duLieuDanhMucService.getListDataByGroupCode("HUONGDANSUDUNG");
      setHDSD(response.data[0]);
    } catch (error) { }
  }
  useEffect(() => {
    getHDSD();
  }, []);
  return (
    <div className="shrink-0">
      <div
        onClick={showModal}
        className="flex items-center gap-2 cursor-pointer !text-gray-600"
      >
        <BookOutlined />
        <span>Hướng dẫn sử dụng</span>
      </div>

      <Modal
        open={open}
        title="Hướng dẫn sử dụng"
        onCancel={handleCancel}
        width="60%"
        style={{ top: 20 }}
        footer={[
          <Button key="back" className='' onClick={handleCancel}>
            Đóng
          </Button>
        ]}
      >
        
      </Modal>
    </div>


  );
};

export default NavHDSD;
