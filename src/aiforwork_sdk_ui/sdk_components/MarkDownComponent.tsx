import React from "react";
import Markdown, { MarkdownIt } from "react-native-markdown-display";
import { Platform, View, Image } from "react-native";
import { markdownStyles } from "./MarkDownStyles";

interface MarkDownComponentProps {
  answer: string;
  styles: any;
}

const MarkDownComponent: React.FC<MarkDownComponentProps> = ({
  answer,
  styles,
}) => {
  const isAndroid = Platform.OS === "android";
  const getMarkdownImageRules = (node: any) => {
    return (
      <View style={markdownStyles.markdown_img_container}>
        <Image
          source={{ uri: node?.attributes?.src }}
          style={markdownStyles.markdown_img}
          resizeMode="cover"
        />
      </View>
    );
  };
  const renderMarkdown = (answer: string) => {
    const md = new MarkdownIt({
      html: true,
      linkify: true,
      typographer: true,
    });
    return (
      <Markdown
        markdownit={md}
        style={{
          body: {
            ...markdownStyles.bodyStyle,
          },
          link: { ...markdownStyles.textTypo, color: "#004EEB" },
          heading1: markdownStyles.h1Style,
          heading2: markdownStyles.h2Style,
          heading3: markdownStyles.h3Style,
          heading4: markdownStyles.h4Style,
          heading5: markdownStyles.h5Style,
          heading6: markdownStyles.h6Style,
          bullet_list: markdownStyles.bulletStyle,
          ordered_list: markdownStyles.orderStyle,
          list_item: markdownStyles.listItemStyle,
        }}
        rules={{
          image: (node, _children, _parent) => {
            return getMarkdownImageRules(node);
          },
        }}
      >
        {answer}
      </Markdown>
    );
  };

  return renderMarkdown(answer);
};

export default MarkDownComponent;
