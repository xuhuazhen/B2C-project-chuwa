import { Footer } from "antd/es/layout/layout";
import { Flex, Typography, Grid } from "antd";
import {
  YoutubeFilled,
  TwitterOutlined,
  FacebookFilled,
} from "@ant-design/icons";

const { Text } = Typography;
const { useBreakpoint } = Grid;

const linksStyle = {
  color: "#fff",
  fontSize: "16px",
  fontWeight: "500",
};

const iconsStyles = {
  fontSize: "20px",
};

const FooterComponent = () => {
  const screens = useBreakpoint();
  const isMobile = !screens.md; //mobile if width < 768px

  const Copyright = (
    <Text
      style={{
        color: "#fff",
        fontSize: "16px",
        fontWeight: "400",
      }}
    >
      &copy; 2025 All Rights Reserved.
    </Text>
  );

  const SocialIcons = (
    <Flex gap={12} align="center" style={{ color: "#fff" }}>
      <YoutubeFilled style={iconsStyles} />
      <TwitterOutlined style={iconsStyles} />
      <FacebookFilled style={iconsStyles} />
    </Flex>
  );

  const Links = (
    <Flex gap={16} align={isMobile ? "center" : "start"}>
      <Text style={linksStyle}>Contact us</Text>
      <Text style={linksStyle}>Privacy Policies</Text>
      <Text style={linksStyle}>Help</Text>
    </Flex>
  );

  return (
    <Footer style={{ backgroundColor: "#111827" }}>
      <Flex
        vertical={isMobile}
        justify="space-between"
        align={isMobile ? "center" : "start"}
        style={{ width: "100%", gap: 14 }}
      >
        {isMobile ? (
          <>
            {SocialIcons}
            {Links}
            {Copyright}
          </>
        ) : (
          <>
            {Copyright}
            {SocialIcons}
            {Links}
          </>
        )}
      </Flex>
    </Footer>
  );
};

export default FooterComponent;
