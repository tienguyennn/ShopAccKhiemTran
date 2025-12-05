"use client";
import { HeaderNav } from "@/components/layout-components/HeaderNav";
import { SideNav } from "@/components/layout-components/SideNav";
import { MEDIA_QUERIES, TEMPLATE } from "@/constants/ThemeConstant";
import { useSelector } from "@/store/hooks";
import utils from "@/utils";
import styled from "@emotion/styled";
import { ConfigProvider, Grid, Layout } from "antd";

import "@/app/assets/css/global.css";
import "../layout.css";
import "react-toastify/dist/ReactToastify.css";

import Loading from "@/components/shared-components/Loading";
import authService from "@/services/auth/auth.service";
import { setUserInfo } from "@/store/auth/AuthSlice";
import { setMenuData } from "@/store/menu/MenuSlice";
import { AppDispatch } from "@/store/store";
import { usePathname } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { ToastContainer } from "react-toastify";
//chuyển khu vực của antd về việt nam
import locale from "antd/locale/vi_VN";
import dayjs from "dayjs";
import "dayjs/locale/vi";

import NProgress from "nprogress"; // Thêm nprogress
import "nprogress/nprogress.css";
import { MenuDataType } from "@/types/operation/dto";
import { AppUserType } from "@/types/appUser/dto";

dayjs.locale("vi");

const { useBreakpoint } = Grid;
const { Content } = Layout;

const AppContent = styled("div")`
  padding: ${TEMPLATE.LAYOUT_CONTENT_GUTTER}px;
  margin-top: ${TEMPLATE.HEADER_HEIGHT}px;
  min-height: calc(100vh - 126px);
  position: relative;
  @media ${MEDIA_QUERIES.MOBILE} {
    padding: ${TEMPLATE.LAYOUT_CONTENT_GUTTER_SM}px;
  }
  /* margin-bottom: 30px; */
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const loading = useSelector((state) => state.general.isLoading);
  const pathname = usePathname();
  const navCollapsed = useSelector((state) => state.customizer.isCollapse);
  const screens = utils.getBreakPoint(useBreakpoint());
  const isMobile = screens.length === 0 ? false : !screens.includes("lg");
  const userInfo: AppUserType | null = useSelector(
    (state: any) => state.auth.User
  );
  const menuData: MenuDataType[] | null = useSelector(
    (state) => state.menu.menuData
  );

  const getLayoutGutter = () => {
    if (isMobile) {
      return 0;
    }
    return navCollapsed
      ? TEMPLATE.SIDE_NAV_COLLAPSED_WIDTH
      : TEMPLATE.SIDE_NAV_WIDTH;
  };

  const getLayoutDirectionGutter = () => {
    return { paddingLeft: getLayoutGutter() };
  };

  const handleGetUserInfo = async () => {
    try {
      const response = await authService.getInfo();
      if (response) {
        dispatch(setUserInfo(response));
        dispatch(setMenuData(response));
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    NProgress.set(0.3);
    const timer = setInterval(() => {
      NProgress.inc(0.1);
    }, 300);

    return () => {
      clearInterval(timer);
      NProgress.set(1.0);
    };
  }, [pathname]);

  useEffect(() => {
    if (userInfo == null || menuData == null) {
      handleGetUserInfo();
    }
  }, []);

  return (
    <ConfigProvider
      locale={locale}
      theme={{
        token: {
          colorPrimary: "#1877F2",
          fontFamily: `var(--font-inter), system-ui`,
        },
        components: {
          Input: {
            borderRadius: 4,
          },
          Select: {
            borderRadius: 4,
          },
          DatePicker: {
            borderRadius: 4,
          },
        },
      }}
    >
      <Layout>
        <ToastContainer />
        <HeaderNav></HeaderNav>
        <SideNav />
        <Layout style={getLayoutDirectionGutter()}>
          <AppContent>
            {/* <PageHeader display={true} title={``} /> */}
            <Content className="h-100">
              <Suspense fallback={<Loading content="content" />}>
                {children}
              </Suspense>
            </Content>
          </AppContent>
          {pathname !== "/auth/login" && pathname !== "/auth/register" && (
            <div className="flex items-center gap-6 justify-center p-[20px] bg-[#fff]">
              <div className="text-md font-semibold">
                Hệ Thống Quản Lý Thanh Toán EcosysPayment
              </div>
              <div className="">
                <div className="p-1">
                  Địa chỉ: 61, phố Tôn Thất Nghiệp, phường Điện Biên, quận Ba
                  Đình, thành phố Hà Nội
                </div>
                <div className="flex gap-6 p-1">
                  <div>Điện thoại: 069533189 | 0865611389</div>
                  <div>Fax: 069551567</div>
                  <div>Email: banthuongtruc1389@mod.gov.vn</div>
                </div>
              </div>
            </div>
          )}
        </Layout>
      </Layout>
    </ConfigProvider>
  );
}
